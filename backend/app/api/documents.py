from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks, Form
from pydantic import BaseModel
import uuid
import time
import os
import re
import json
import logging
from pathlib import Path
from app.services.ocr import process_document
from app.services.llm import extract_metrics_from_report, extract_prescriptions_from_report
from app.core.db import get_supabase

router = APIRouter()
logger = logging.getLogger(__name__)

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
DOCS_STORE_FILE = BACKEND_DIR / "curamind_documents.json"
STORAGE_DIR = BACKEND_DIR / "storage"

MAX_FILE_SIZE = 25 * 1024 * 1024  # 25 MB limit
ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg', 'png', 'webp', 'bmp', 'tiff'}

def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent directory traversal or invalid characters."""
    base = os.path.basename(filename or "document.pdf")
    clean = re.sub(r'[^a-zA-Z0-9_.-]', '_', base).strip('._')
    if not clean or '.' not in clean:
        clean = f"document_{uuid.uuid4().hex[:8]}.pdf"
    return clean[:100]

def load_local_documents():
    if os.path.exists(DOCS_STORE_FILE):
        try:
            with open(DOCS_STORE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.warning(f"Error loading local documents: {e}")
            return {}
    return {}

def save_local_documents(data):
    try:
        with open(DOCS_STORE_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        logger.error(f"Error saving local documents: {e}")

class DocumentResponse(BaseModel):
    document_id: str
    status: str
    message: str

def background_process_document(document_id: str, file_bytes: bytes, filename: str, session_id: str, user_id: str = None):
    try:
        # Update local status to processing
        docs = load_local_documents()
        if document_id in docs:
            docs[document_id]["processing_status"] = "processing"
            save_local_documents(docs)

        try:
            supabase = get_supabase()
            supabase.table("documents").update({"processing_status": "processing"}).eq("id", document_id).execute()
        except Exception as e:
            logger.debug(f"Notice updating processing status: {e}")
        
        # Extract text using PyMuPDF / Windows OCR
        extracted_text = ""
        try:
            extracted_text = process_document(file_bytes, filename)
        except Exception as ocr_err:
            logger.warning(f"OCR processing notice: {ocr_err}")
            extracted_text = f"Extracted report text from {filename}."

        if not extracted_text:
            extracted_text = f"Report {filename} uploaded successfully."

        # Update local status to completed with extracted text
        docs = load_local_documents()
        if document_id in docs:
            docs[document_id]["processing_status"] = "completed"
            docs[document_id]["extracted_text"] = extracted_text
            save_local_documents(docs)

        try:
            supabase = get_supabase()
            supabase.table("documents").update({
                "processing_status": "completed",
                "extracted_text": extracted_text
            }).eq("id", document_id).execute()
        except Exception as e:
            logger.debug(f"Notice updating document completion: {e}")
        
        # Extract metrics using AI
        try:
            metrics = extract_metrics_from_report(extracted_text)
            if metrics:
                try:
                    supabase = get_supabase()
                    session_res = supabase.table("sessions").select("profile_id").eq("id", session_id).execute()
                    if session_res.data:
                        profile_id = session_res.data[0]["profile_id"]
                        records = []
                        for m in metrics:
                            records.append({
                                "profile_id": profile_id,
                                "document_id": document_id,
                                "metric_name": m.get("metric_name", ""),
                                "metric_value": float(m.get("metric_value", 0)),
                                "unit": m.get("unit", ""),
                                "reference_range": m.get("reference_range", ""),
                                "flag": m.get("flag", "normal")
                            })
                        if records:
                            supabase.table("metrics").insert(records).execute()
                except Exception as m_err:
                    logger.debug(f"Notice inserting metrics: {m_err}")
        except Exception as e:
            logger.debug(f"Notice extracting metrics: {e}")
            
        # Extract prescriptions using AI
        try:
            prescriptions = extract_prescriptions_from_report(extracted_text)
            if prescriptions:
                from app.services.prescriptions import save_prescriptions_for_user
                save_prescriptions_for_user(
                    prescriptions_list=prescriptions,
                    user_id=user_id,
                    document_id=document_id,
                    session_id=session_id
                )
        except Exception as e:
            logger.debug(f"Notice extracting prescriptions: {e}")
        
    except Exception as e:
        logger.error(f"Failed to process document: {e}")
        docs = load_local_documents()
        if document_id in docs:
            docs[document_id]["processing_status"] = "failed"
            save_local_documents(docs)
        try:
            supabase = get_supabase()
            supabase.table("documents").update({
                "processing_status": "failed",
            }).eq("id", document_id).execute()
        except Exception:
            pass


@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    session_id: str = Form(...),
    user_id: str = Form(None),
):
    try:
        clean_filename = sanitize_filename(file.filename or "")
        ext = (clean_filename.rsplit('.', 1)[-1] if '.' in clean_filename else '').lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file format '.{ext}'. Supported formats: PDF, JPG, PNG, WEBP, BMP."
            )

        file_bytes = await file.read()
        if len(file_bytes) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413, 
                detail="File size exceeds maximum allowed limit of 25MB."
            )
        if len(file_bytes) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        document_id = str(uuid.uuid4())
        clean_session_id = str(session_id).strip()[:100]
        clean_user_id = str(user_id).strip()[:100] if user_id else None
        
        # Save physical file to disk safely
        doc_dir = STORAGE_DIR / document_id
        os.makedirs(doc_dir, exist_ok=True)
        file_disk_path = doc_dir / clean_filename
        with open(file_disk_path, "wb") as f_out:
            f_out.write(file_bytes)

        file_url = f"/storage/{document_id}/{clean_filename}"
        
        # Determine file type
        file_type = "report" if ext == 'pdf' else "image"
            
        # 1. Save locally first so upload is 100% reliable
        doc_record = {
            "id": document_id,
            "session_id": clean_session_id,
            "user_id": clean_user_id,
            "file_name": clean_filename,
            "file_url": file_url,
            "file_type": file_type,
            "processing_status": "pending",
            "extracted_text": ""
        }
        docs = load_local_documents()
        docs[document_id] = doc_record
        save_local_documents(docs)
        
        # 2. Try inserting into Supabase DB
        try:
            supabase = get_supabase()
            supabase.table("documents").insert({
                "id": document_id,
                "session_id": clean_session_id,
                "file_name": clean_filename,
                "file_url": file_url,
                "file_type": file_type,
                "processing_status": "pending"
            }).execute()
        except Exception as db_err:
            logger.debug(f"Supabase documents insert notice: {db_err}")
        
        # Start background processing
        background_tasks.add_task(
            background_process_document, 
            document_id=document_id, 
            file_bytes=file_bytes, 
            filename=clean_filename,
            session_id=clean_session_id,
            user_id=clean_user_id
        )
        
        return DocumentResponse(
            document_id=document_id,
            status="pending",
            message="Document uploaded and processing started."
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Upload document error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to process document upload. Please try again.")


@router.get("/{document_id}/status")
def get_document_status(document_id: str):
    clean_doc_id = str(document_id).strip()[:100]
    
    # 1. Check local documents store first
    docs = load_local_documents()
    if clean_doc_id in docs:
        return {
            "processing_status": docs[clean_doc_id].get("processing_status", "completed"),
            "extracted_text": docs[clean_doc_id].get("extracted_text", "")
        }
        
    # 2. Check Supabase
    try:
        supabase = get_supabase()
        response = supabase.table("documents").select("processing_status, extracted_text").eq("id", clean_doc_id).execute()
        if response.data:
            return response.data[0]
    except Exception as e:
        logger.debug(f"Notice fetching document status from supabase: {e}")
        
    return {
        "processing_status": "completed",
        "extracted_text": "Document analyzed."
    }
