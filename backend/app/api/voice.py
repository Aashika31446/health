import os
import io
import uuid
import logging
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from app.services.llm import get_groq_client

router = APIRouter()
logger = logging.getLogger(__name__)

# Optional faster_whisper support
WhisperModel = None
try:
    from faster_whisper import WhisperModel
except ImportError:
    WhisperModel = None

# Optional gTTS support
gTTS = None
try:
    from gTTS import gTTS
except ImportError:
    gTTS = None

model = None
if WhisperModel:
    try:
        model = WhisperModel("tiny", device="cpu", compute_type="int8")
    except Exception as e:
        logger.warning(f"Notice loading local Whisper model: {e}")

MAX_AUDIO_SIZE = 25 * 1024 * 1024  # 25 MB

@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """Transcribes uploaded audio using Groq Whisper or local Faster-Whisper."""
    audio_bytes = await file.read()
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Empty audio file.")
    if len(audio_bytes) > MAX_AUDIO_SIZE:
        raise HTTPException(status_code=413, detail="Audio file too large. Max 25MB.")

    # 1. Try Groq Whisper (ultra fast and highly accurate cloud inference)
    groq_client = get_groq_client()
    if groq_client:
        try:
            filename = file.filename or "voice.wav"
            transcription = groq_client.audio.transcriptions.create(
                file=(filename, audio_bytes),
                model="whisper-large-v3",
                response_format="json"
            )
            text_result = getattr(transcription, "text", "") or str(transcription)
            return {"text": text_result.strip()}
        except Exception as groq_err:
            logger.warning(f"Groq Whisper notice: {groq_err}. Falling back to local model.")

    # 2. Try local Whisper model if available
    if model:
        temp_filename = f"temp_voice_{uuid.uuid4().hex}.wav"
        try:
            with open(temp_filename, "wb") as f:
                f.write(audio_bytes)
            segments, info = model.transcribe(temp_filename, beam_size=5)
            text = " ".join([segment.text for segment in segments])
            return {"text": text.strip()}
        except Exception as local_err:
            logger.error(f"Local Whisper transcription error: {local_err}")
            raise HTTPException(status_code=500, detail="Transcription failed.")
        finally:
            if os.path.exists(temp_filename):
                try:
                    os.remove(temp_filename)
                except Exception:
                    pass

    return {"text": "Speech recognition service is currently unavailable."}

class TTSRequest(BaseModel):
    text: str = Field(..., max_length=2000)
    language: str = "en"

@router.post("/speak")
async def text_to_speech(req: TTSRequest):
    """Converts text to speech using gTTS and returns audio stream."""
    if not gTTS:
        raise HTTPException(status_code=503, detail="TTS service not available.")
        
    try:
        clean_text = req.text.strip()[:1000]
        tts = gTTS(text=clean_text, lang=req.language, slow=False)
        audio_fp = io.BytesIO()
        tts.write_to_fp(audio_fp)
        audio_fp.seek(0)
        return StreamingResponse(audio_fp, media_type="audio/mpeg")
    except Exception as e:
        logger.error(f"TTS error: {e}")
        raise HTTPException(status_code=500, detail="Failed to synthesize speech.")
