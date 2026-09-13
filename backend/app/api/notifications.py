import os
import json
import logging
from pathlib import Path
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field
from app.core.db import get_supabase

router = APIRouter()
logger = logging.getLogger(__name__)

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
SUBS_STORE_FILE = BACKEND_DIR / "curamind_push_subscriptions.json"

def load_local_subscriptions() -> list:
    if os.path.exists(SUBS_STORE_FILE):
        try:
            with open(SUBS_STORE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.warning(f"Notice loading local push subscriptions: {e}")
            return []
    return []

def save_local_subscriptions(data: list):
    try:
        with open(SUBS_STORE_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        logger.error(f"Notice saving local push subscriptions: {e}")

class PushSubscription(BaseModel):
    user_id: str = Field(..., max_length=128)
    endpoint: str = Field(..., max_length=1024)
    p256dh: str = Field(..., max_length=256)
    auth: str = Field(..., max_length=128)

@router.post("/subscribe")
async def subscribe(sub: PushSubscription, request: Request):
    # Validate endpoint scheme for security
    endpoint = sub.endpoint.strip()
    if not (endpoint.startswith("https://") or endpoint.startswith("http://localhost")):
        raise HTTPException(status_code=400, detail="Invalid push subscription endpoint protocol.")

    auth_header = request.headers.get("Authorization", "")
    token = None
    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ", 1)[1]

    supabase = get_supabase(token=token)
    saved_to_supabase = False

    # 1. Attempt writing to Supabase
    try:
        supabase.table("push_subscriptions").upsert({
            "user_id": sub.user_id,
            "endpoint": endpoint,
            "p256dh": sub.p256dh,
            "auth": sub.auth
        }, on_conflict="user_id,endpoint").execute()
        saved_to_supabase = True
    except Exception as e:
        logger.debug(f"Notice: Supabase write notice on push_subscriptions ({e}). Saving to persistent local store.")

    # 2. Always persist to local subscriptions store so background scheduler never loses reminders
    try:
        subs = load_local_subscriptions()
        found = False
        for item in subs:
            if item.get("user_id") == sub.user_id and item.get("endpoint") == endpoint:
                item["p256dh"] = sub.p256dh
                item["auth"] = sub.auth
                found = True
                break
        if not found:
            subs.append({
                "user_id": sub.user_id,
                "endpoint": endpoint,
                "p256dh": sub.p256dh,
                "auth": sub.auth
            })
        save_local_subscriptions(subs)
    except Exception as local_err:
        logger.error(f"Notice saving local fallback subscription: {local_err}")

    return {
        "status": "success",
        "message": "Push subscription saved successfully",
        "saved_to_cloud": saved_to_supabase
    }

@router.get("/status")
async def subscription_status(user_id: str):
    clean_uid = str(user_id).strip()[:128]
    subs = load_local_subscriptions()
    user_subs = [s for s in subs if s.get("user_id") == clean_uid]
    return {
        "user_id": clean_uid,
        "active_subscriptions": len(user_subs)
    }

class UnsubscribeRequest(BaseModel):
    user_id: str = Field(..., max_length=128)

@router.post("/unsubscribe")
async def unsubscribe(req: UnsubscribeRequest):
    clean_uid = req.user_id.strip()[:128]
    # 1. Remove from local fallback store
    subs = load_local_subscriptions()
    subs = [s for s in subs if s.get("user_id") != clean_uid]
    save_local_subscriptions(subs)

    # 2. Attempt removal from Supabase if table exists
    try:
        supabase = get_supabase()
        supabase.table("push_subscriptions").delete().eq("user_id", clean_uid).execute()
    except Exception as e:
        logger.debug(f"Notice deleting push subscription from Supabase: {e}")

    return {"status": "success", "message": "Push notifications disabled"}
