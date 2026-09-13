import pymupdf
import io
import asyncio
import concurrent.futures
from PIL import Image

def _run_ocr_on_pil_image(image: Image.Image) -> str:
    """Extract text from a PIL Image using native Windows OCR."""
    try:
        import winocr
        async def _rec():
            res = await winocr.recognize_pil(image, 'en')
            return res.text if hasattr(res, 'text') else str(res)
        
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            loop = None

        if loop and loop.is_running():
            with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
                return pool.submit(asyncio.run, _rec()).result(timeout=25)
        else:
            return asyncio.run(_rec())
    except Exception as e:
        print(f"Windows OCR notice: {e}")
        return ""

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from a PDF file using PyMuPDF and OCR fallback for scanned pages."""
    text_chunks = []
    try:
        doc = pymupdf.open(stream=file_bytes, filetype="pdf")
        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            page_text = page.get_text("text") or ""
            
            # If text is too sparse (scanned PDF / photo of report), run OCR
            if len(page_text.strip()) < 40:
                try:
                    pix = page.get_pixmap(dpi=200)
                    img = Image.open(io.BytesIO(pix.tobytes("png")))
                    ocr_text = _run_ocr_on_pil_image(img)
                    if ocr_text.strip():
                        page_text = ocr_text.strip()
                except Exception as ocr_err:
                    print(f"Page {page_num} OCR notice: {ocr_err}")
            
            if page_text.strip():
                text_chunks.append(f"--- Page {page_num + 1} ---\n{page_text.strip()}")
        doc.close()
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
    return "\n\n".join(text_chunks).strip()

def extract_text_from_image(file_bytes: bytes) -> str:
    """Extract text from an image using Windows OCR."""
    try:
        image = Image.open(io.BytesIO(file_bytes))
        return _run_ocr_on_pil_image(image).strip()
    except Exception as e:
        print(f"Error extracting text from Image: {e}")
        return ""

def process_document(file_bytes: bytes, filename: str) -> str:
    """Process document based on extension."""
    ext = filename.lower().split('.')[-1]
    if ext == 'pdf':
        return extract_text_from_pdf(file_bytes)
    elif ext in ['jpg', 'jpeg', 'png', 'webp', 'bmp']:
        return extract_text_from_image(file_bytes)
    else:
        try:
            return file_bytes.decode('utf-8', errors='ignore')
        except Exception:
            return ""

