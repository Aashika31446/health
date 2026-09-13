import os
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent / '.env'
load_dotenv(dotenv_path=env_path, override=True)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.api import documents, chat, voice, notifications
import json
from datetime import datetime, timezone, timedelta
try:
    from zoneinfo import ZoneInfo
    IST_TZ = ZoneInfo("Asia/Kolkata")
except Exception:
    IST_TZ = timezone(timedelta(hours=5, minutes=30))
try:
    from pywebpush import webpush, WebPushException
except ImportError:
    webpush = None
    WebPushException = Exception
from supabase import create_client
from apscheduler.schedulers.background import BackgroundScheduler
from contextlib import asynccontextmanager

def send_pill_notifications():
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
    if not supabase_url or not supabase_key:
        return

    try:
        supabase = create_client(supabase_url, supabase_key)
    except Exception as init_err:
        print("Notice initializing Supabase in scheduler:", init_err)
        return
    
    # Check current time in India Standard Time (Asia/Kolkata)
    now = datetime.now(IST_TZ)
    
    current_time_of_day = None
    # Calculate current time of day based on hours
    if now.hour == 8 and now.minute == 0:
        current_time_of_day = "morning"
    elif now.hour == 13 and now.minute == 0:
        current_time_of_day = "afternoon"
    elif now.hour == 20 and now.minute == 0:
        current_time_of_day = "night"
        
    if current_time_of_day:
        try:
            # 1. Fetch users and their pills scheduled for this time
            reminders_res = supabase.table("pill_reminders").select("*, prescriptions(user_id, medicine_name)").eq("time_of_day", current_time_of_day).eq("taken_status", False).execute()
            reminders = reminders_res.data

            
            if not reminders:
                return
                
            # Group by user_id
            user_pills = {}
            for r in reminders:
                if not r.get('prescriptions'): continue
                
                uid = r['prescriptions']['user_id']
                if uid not in user_pills:
                    user_pills[uid] = []
                user_pills[uid].append(r['prescriptions']['medicine_name'])
                
            # 2. Fetch push subscriptions for these users
            from app.api.notifications import load_local_subscriptions
            local_subs = load_local_subscriptions()

            for uid, pills in user_pills.items():
                subs = []
                try:
                    subs_res = supabase.table("push_subscriptions").select("*").eq("user_id", uid).execute()
                    if subs_res.data:
                        subs.extend(subs_res.data)
                except Exception as db_err:
                    print("Notice fetching push_subscriptions from Supabase:", db_err)
                
                # Merge local subscriptions
                for ls in local_subs:
                    if ls.get("user_id") == uid and not any(s.get("endpoint") == ls.get("endpoint") for s in subs):
                        subs.append(ls)
                
                if subs:
                    pill_list = ", ".join(pills)
                    message_title = "💊 Time for your Medication!"
                    message_body = f"It's time to take your {pill_list}."
                    
                    vapid_private_key = os.getenv("VAPID_PRIVATE_KEY")
                    vapid_claims = {"sub": "mailto:admin@curamind.com"}
                    
                    for sub in subs:
                        try:
                            webpush(
                                subscription_info={
                                    "endpoint": sub['endpoint'],
                                    "keys": {
                                        "p256dh": sub['p256dh'],
                                        "auth": sub['auth']
                                    }
                                },
                                data=json.dumps({"title": message_title, "body": message_body}),
                                vapid_private_key=vapid_private_key,
                                vapid_claims=vapid_claims
                            )
                        except WebPushException as ex:
                            print("WebPush Error:", repr(ex))
        except Exception as e:
            print("Scheduler error:", e)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    scheduler = BackgroundScheduler()
    scheduler.add_job(send_pill_notifications, 'cron', minute='*') # Run every minute
    scheduler.start()
    yield
    # Shutdown
    scheduler.shutdown()

app = FastAPI(title="CuraMind API", lifespan=lifespan)

cors_origins_env = os.getenv("CORS_ORIGINS", "")
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]
if cors_origins_env:
    for o in cors_origins_env.split(","):
        clean_o = o.strip()
        if clean_o and clean_o not in allowed_origins:
            allowed_origins.append(clean_o)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?|https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(voice.router, prefix="/api/voice", tags=["voice"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["notifications"])

@app.get("/")
def read_root():
    return {"message": "Welcome to CuraMind API"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

