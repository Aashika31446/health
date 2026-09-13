import os
import json
import uuid
import logging
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional, Any
from app.core.db import get_supabase

logger = logging.getLogger(__name__)

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
PRESCRIPTIONS_STORE_FILE = BACKEND_DIR / "curamind_prescriptions.json"
REMINDERS_STORE_FILE = BACKEND_DIR / "curamind_pill_reminders.json"

VALID_TIMES_OF_DAY = {"morning", "afternoon", "night", "evening"}

def load_prescriptions() -> Dict[str, Any]:
    if os.path.exists(PRESCRIPTIONS_STORE_FILE):
        try:
            with open(PRESCRIPTIONS_STORE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.warning(f"Error loading prescriptions: {e}")
    return {}

def save_prescriptions(data: Dict[str, Any]):
    try:
        with open(PRESCRIPTIONS_STORE_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        logger.error(f"Error saving prescriptions: {e}")

def load_reminders() -> Dict[str, Any]:
    if os.path.exists(REMINDERS_STORE_FILE):
        try:
            with open(REMINDERS_STORE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.warning(f"Error loading reminders: {e}")
    return {}

def save_reminders(data: Dict[str, Any]):
    try:
        with open(REMINDERS_STORE_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        logger.error(f"Error saving reminders: {e}")

def is_valid_uuid(val: Any) -> bool:
    try:
        uuid.UUID(str(val))
        return True
    except (ValueError, AttributeError, TypeError):
        return False

def get_prescriptions_for_user(user_id: str) -> List[Dict[str, Any]]:
    clean_uid = str(user_id).strip()[:100] if user_id else "default-user"
    all_local = load_prescriptions()
    presc_map = {}

    for pid, p in all_local.items():
        uid = p.get("user_id")
        if uid == clean_uid or (clean_uid in ['default-user', 'guest', ''] and uid in ['default-user', 'guest', '']):
            presc_map[pid] = p
        elif uid in ['default-user', 'guest', '']:
            presc_map[pid] = p

    if is_valid_uuid(clean_uid):
        try:
            supabase = get_supabase()
            res = supabase.table("prescriptions").select("*").eq("user_id", clean_uid).order("created_at", desc=True).execute()
            if res.data:
                for p in res.data:
                    presc_map[p["id"]] = p
        except Exception as e:
            logger.debug(f"Notice fetching prescriptions from Supabase: {e}")

    result = list(presc_map.values())
    result.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return result

def save_prescriptions_for_user(
    prescriptions_list: List[Dict[str, Any]], 
    user_id: Optional[str] = None, 
    document_id: Optional[str] = None, 
    session_id: Optional[str] = None
) -> List[Dict[str, Any]]:
    if not prescriptions_list:
        return []

    if not user_id and session_id:
        try:
            sess_file = BACKEND_DIR / "curamind_sessions.json"
            if os.path.exists(sess_file):
                with open(sess_file, "r", encoding="utf-8") as f:
                    sessions = json.load(f)
                    if session_id in sessions:
                        user_id = sessions[session_id].get("user_id")
        except Exception:
            pass

    user_id = str(user_id).strip()[:100] if user_id else "default-user"

    all_presc = load_prescriptions()
    saved = []

    for p in prescriptions_list:
        raw_name = p.get("medicine_name") or ""
        med_name = str(raw_name).strip()[:150]
        if not med_name or len(med_name) < 2:
            continue

        existing_id = None
        for pid, existing in all_presc.items():
            if (existing.get("user_id") == user_id or existing.get("user_id") in ['default-user', '']) and \
               existing.get("medicine_name", "").strip().lower() == med_name.lower():
                existing_id = pid
                break

        rec_id = existing_id or str(uuid.uuid4())
        rec = {
            "id": rec_id,
            "user_id": user_id,
            "document_id": str(document_id)[:100] if document_id else (all_presc[rec_id].get("document_id") if existing_id else None),
            "session_id": str(session_id)[:100] if session_id else (all_presc[rec_id].get("session_id") if existing_id else None),
            "medicine_name": med_name,
            "dosage": str(p.get("dosage", "") or (all_presc[rec_id].get("dosage", "") if existing_id else ""))[:100],
            "frequency": str(p.get("frequency", "") or (all_presc[rec_id].get("frequency", "") if existing_id else ""))[:100],
            "duration": str(p.get("duration", "") or (all_presc[rec_id].get("duration", "") if existing_id else ""))[:100],
            "instructions": str(p.get("instructions", "") or (all_presc[rec_id].get("instructions", "") if existing_id else ""))[:250],
            "created_at": all_presc[rec_id].get("created_at") if existing_id else (datetime.utcnow().isoformat() + "Z")
        }
        all_presc[rec_id] = rec
        saved.append(rec)

        if is_valid_uuid(user_id):
            try:
                supabase = get_supabase()
                supabase.table("prescriptions").upsert({
                    "id": rec_id,
                    "user_id": user_id,
                    "document_id": document_id,
                    "medicine_name": med_name,
                    "dosage": rec["dosage"],
                    "frequency": rec["frequency"],
                    "duration": rec["duration"]
                }).execute()
            except Exception:
                pass

    save_prescriptions(all_presc)
    return saved

def delete_prescription(prescription_id: str) -> bool:
    clean_id = str(prescription_id).strip()[:100]
    all_presc = load_prescriptions()
    if clean_id in all_presc:
        del all_presc[clean_id]
        save_prescriptions(all_presc)

    all_rem = load_reminders()
    rem_to_delete = [rid for rid, r in all_rem.items() if r.get("prescription_id") == clean_id]
    for rid in rem_to_delete:
        del all_rem[rid]
    if rem_to_delete:
        save_reminders(all_rem)

    try:
        supabase = get_supabase()
        supabase.table("prescriptions").delete().eq("id", clean_id).execute()
    except Exception:
        pass

    return True

def get_reminders_for_user(user_id: str) -> List[Dict[str, Any]]:
    clean_uid = str(user_id).strip()[:100] if user_id else "default-user"
    all_rem = load_reminders()
    all_presc = load_prescriptions()
    rem_map = {}

    for rid, r in all_rem.items():
        uid = r.get("user_id")
        if uid == clean_uid or (clean_uid in ['default-user', 'guest', ''] and uid in ['default-user', 'guest', '']) or uid in ['default-user', 'guest', '']:
            pid = r.get("prescription_id")
            p_detail = all_presc.get(pid, {})
            r_copy = dict(r)
            r_copy["prescriptions"] = {
                "id": pid,
                "medicine_name": p_detail.get("medicine_name", "Medication"),
                "dosage": p_detail.get("dosage", "")
            }
            rem_map[rid] = r_copy

    try:
        supabase = get_supabase()
        res = supabase.table("pill_reminders").select("*").execute()
        if res.data:
            for r in res.data:
                pid = r.get("prescription_id")
                p_detail = all_presc.get(pid, {})
                r_enriched = dict(r)
                r_enriched["prescriptions"] = {
                    "id": pid,
                    "medicine_name": p_detail.get("medicine_name", "Medication"),
                    "dosage": p_detail.get("dosage", "")
                }
                rem_map[r["id"]] = r_enriched
    except Exception:
        pass

    return list(rem_map.values())

def create_reminder(user_id: str, prescription_id: str, time_of_day: str) -> Dict[str, Any]:
    clean_uid = str(user_id).strip()[:100] if user_id else "default-user"
    clean_pid = str(prescription_id).strip()[:100]
    clean_time = str(time_of_day).strip().lower()
    if clean_time not in VALID_TIMES_OF_DAY:
        clean_time = "morning"

    all_rem = load_reminders()
    all_presc = load_prescriptions()
    new_id = str(uuid.uuid4())
    now_iso = datetime.utcnow().isoformat() + "Z"

    p_detail = all_presc.get(clean_pid, {})
    new_rem = {
        "id": new_id,
        "user_id": clean_uid,
        "prescription_id": clean_pid,
        "time_of_day": clean_time,
        "taken_status": False,
        "created_at": now_iso,
        "prescriptions": {
            "id": clean_pid,
            "medicine_name": p_detail.get("medicine_name", "Medication"),
            "dosage": p_detail.get("dosage", "")
        }
    }
    all_rem[new_id] = new_rem
    save_reminders(all_rem)

    if is_valid_uuid(clean_uid) and is_valid_uuid(clean_pid):
        try:
            supabase = get_supabase()
            supabase.table("pill_reminders").insert({
                "id": new_id,
                "prescription_id": clean_pid,
                "time_of_day": clean_time,
                "taken_status": False
            }).execute()
        except Exception:
            pass

    return new_rem

def update_reminder_status(reminder_id: str, taken_status: bool) -> Optional[Dict[str, Any]]:
    clean_id = str(reminder_id).strip()[:100]
    all_rem = load_reminders()
    if clean_id in all_rem:
        all_rem[clean_id]["taken_status"] = bool(taken_status)
        save_reminders(all_rem)
        res = all_rem[clean_id]
    else:
        res = None

    try:
        supabase = get_supabase()
        supabase.table("pill_reminders").update({"taken_status": bool(taken_status)}).eq("id", clean_id).execute()
    except Exception:
        pass

    return res

def delete_reminder(reminder_id: str) -> bool:
    clean_id = str(reminder_id).strip()[:100]
    all_rem = load_reminders()
    if clean_id in all_rem:
        del all_rem[clean_id]
        save_reminders(all_rem)

    try:
        supabase = get_supabase()
        supabase.table("pill_reminders").delete().eq("id", clean_id).execute()
    except Exception:
        pass

    return True
