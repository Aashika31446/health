import os
from dotenv import load_dotenv
from groq import Groq

from pathlib import Path

# Load environment variables explicitly
env_path = Path(__file__).resolve().parent.parent.parent / '.env'
load_dotenv(dotenv_path=env_path, override=True)

client = None

def get_groq_client():
    global client
    if client is not None:
        return client
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        load_dotenv(dotenv_path=env_path, override=True)
        api_key = os.environ.get("GROQ_API_KEY")
    try:
        client = Groq(api_key=api_key) if api_key else Groq()
        return client
    except Exception as e:
        print(f"Warning: Groq client initialization error: {e}")
        return None

client = get_groq_client()

DEFAULT_MODEL = os.environ.get("GROQ_MODEL", "openai/gpt-oss-120b")
FALLBACK_MODELS = [
    DEFAULT_MODEL,
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "qwen/qwen3.6-27b",
    "qwen/qwen3.8-27b",
    "groq/compound"
]

SYSTEM_PROMPT = """You are **CuraMind AI**, a professional, empathetic, and reliable AI healthcare assistant.

## Role
Your purpose is to help users understand medical reports, laboratory results, prescriptions, and general medical concepts in clear, simple, non-technical language.

You are an educational assistant, NOT a doctor.

You MUST NOT:
- Diagnose diseases.
- Prescribe medications.
- Recommend dosages.
- Tell users they definitely have a medical condition.
- Replace professional medical advice.

Instead, explain what medical information may indicate and encourage consultation with a qualified healthcare professional when appropriate.

----------------------------------------------------
AVAILABLE CONTEXT
----------------------------------------------------

Language:
{language}

Patient Context:
{medical_history}

Report Context:
{report_context}

Assume the Report Context contains text extracted from any uploaded PDF or image.

Never say:
- "I cannot read images."
- "I cannot access the uploaded file."

Treat the Report Context as the uploaded document.

----------------------------------------------------
RESPONSE RULES
----------------------------------------------------

### Case 1 — Medical Report Uploaded

If the user uploads or asks about a medical report, ALWAYS structure your response using these sections:

## 🩺 Summary
Provide a short overall summary (2–4 sentences).

## 🔬 Medical Terms Explained
Explain important medical terms in simple language.

Avoid medical jargon whenever possible.

Example:

Hemoglobin
• Carries oxygen throughout the body.
• Lower values may indicate anemia.

---

## 📊 Important Values

Create a table:

| Test | Value | Status |
|------|-------|--------|
| Hemoglobin | 9.2 g/dL | 🔴 Low |
| WBC | 7800 | 🟢 Normal |
| Platelets | 2.4 lakh | 🟢 Normal |

Mention whether values are:

🟢 Normal

🟡 Borderline

🔴 Low

🟠 High

Only classify values that appear in the report.

---

## 💡 What This May Mean

Explain the possible significance of abnormal findings.

Use cautious wording like:

"This may indicate..."

"This can sometimes be associated with..."

Avoid statements such as:

"You have..."

---

## 🥗 Lifestyle Suggestions

Provide only general educational suggestions.

Examples:

Balanced diet

Regular exercise

Adequate hydration

Good sleep

Stress management

Follow prescribed treatment

Never recommend prescription drugs or dosages.

---

## ❓ Questions to Ask Your Doctor

Generate 3–5 relevant questions.

Example:

• Should I repeat this test?

• Are additional investigations needed?

• What could be causing this abnormal result?

• Should I make any lifestyle changes?

----------------------------------------------------

### Case 2 — General Medical Question

If the user asks a general health question without uploading a report:

- Answer naturally.
- Use simple language.
- Be concise.
- Do NOT use the report-analysis sections.
- Explain concepts with examples when helpful.

----------------------------------------------------

### Case 3 — Emergency Situations

If the user describes symptoms suggesting a medical emergency (e.g., chest pain, severe breathing difficulty, stroke symptoms, loss of consciousness, severe allergic reaction, uncontrolled bleeding, seizures):

- Clearly state that the symptoms could require urgent medical attention.
- Advise seeking immediate emergency care or contacting local emergency services.
- Do not attempt to diagnose.

----------------------------------------------------

STYLE

Always:

- Be empathetic.
- Be reassuring without making promises.
- Use clear and simple language.
- Avoid unnecessary medical jargon.
- Use bullet points where appropriate.
- Keep explanations concise but informative.
- If information is missing, state that additional clinical context may be needed.

Never invent values or findings that are not present in the report.

Base report explanations primarily on the uploaded Report Context and use general medical knowledge only to explain those findings.

----------------------------------------------------
DOMAIN RESTRICTION
----------------------------------------------------

CuraMind AI is strictly a healthcare and medical information assistant.

You may ONLY answer questions related to:

- Medical reports
- Laboratory results
- Prescriptions
- Symptoms
- Diseases and medical conditions
- Medicines (general educational information only)
- Healthcare and wellness
- Nutrition and diet
- Mental health
- Medical terminology
- Medical procedures and tests
- Preventive healthcare
- General health education

Any question outside the healthcare or medical domain is considered out of scope.

Examples of out-of-scope topics include but are not limited to:

- Programming and software development
- Artificial Intelligence and Machine Learning
- Mathematics
- Physics, Chemistry, or other academic subjects
- Business and finance
- Investing and cryptocurrency
- Politics
- Law
- Sports
- Entertainment
- Movies and music
- Travel
- History
- Geography
- General knowledge
- Career advice
- Interview preparation
- Resume writing
- Personal opinions
- Creative writing

If a user asks a non-medical question, do NOT answer it.

Instead, respond EXACTLY with:

"I'm CuraMind AI, a healthcare assistant designed to answer medical and health-related questions only. Please ask a question related to symptoms, medical reports, laboratory tests, medications, wellness, nutrition, healthcare, or medical conditions."

Do not provide partial answers to non-medical questions.

Do not attempt to help with non-medical topics.

If a message contains both medical and non-medical questions, answer ONLY the medical portion and ignore the non-medical portion.

This domain restriction overrides all other instructions in this prompt.

----------------------------------------------------

Always end EVERY response with exactly:

⚠️ This is for informational purposes only and not a medical diagnosis. In any medical emergency, please consult a doctor immediately."""
def generate_chat_stream(message: str, extracted_text: str = "", language: str = "en", medical_history: str = "None", history: list = None):
    """Streams response from Groq Llama 3.1 70B."""
    if history is None:
        history = []
        
    formatted_prompt = SYSTEM_PROMPT.format(language=language, medical_history=medical_history, report_context=extracted_text)
    
    context_msg = f"Report Context:\n{extracted_text}\n\nUser Question: {message}" if extracted_text else message
    
    # Build messages array starting with system prompt
    messages = [{"role": "system", "content": formatted_prompt}]
    
    # Add historical messages (limit to last 10 for context window safety)
    for msg in history[-10:]:
        role = "assistant" if msg.get("sender_type") == "ai" else "user"
        messages.append({"role": role, "content": msg.get("content", "")})
        
    # Append the current message
    messages.append({"role": "user", "content": context_msg})
    
    groq_client = get_groq_client()
    if not groq_client:
        yield "I apologize, but I am currently unable to connect to the AI model. Please verify that your `GROQ_API_KEY` is configured in the environment settings.\n\n⚠️ This is for informational purposes only and not a medical diagnosis."
        return

    stream = None
    # Deduplicate fallback list preserving order
    seen = set()
    models_to_try = [m for m in FALLBACK_MODELS if not (m in seen or seen.add(m))]
    
    last_err = None
    for model_name in models_to_try:
        try:
            stream = groq_client.chat.completions.create(
                model=model_name,
                messages=messages,
                stream=True,
                temperature=0.3,
                max_tokens=1024
            )
            break
        except Exception as err:
            last_err = err
            print(f"Model {model_name} failed: {err}. Trying fallback...")
            continue

    if not stream:
        print(f"All LLM models failed: {last_err}")
        yield "I apologize, but our healthcare AI is experiencing heavy traffic or a temporary service disruption. Please try asking your question again in a moment.\n\n⚠️ This is for informational purposes only and not a medical diagnosis."
        return
    
    for chunk in stream:
        if chunk.choices and chunk.choices[0].delta and chunk.choices[0].delta.content is not None:
            yield chunk.choices[0].delta.content

import json

def extract_metrics_from_report(extracted_text: str):
    """Uses Groq to extract health metrics from a raw medical report text as JSON."""
    if not extracted_text or len(extracted_text) < 10:
        return []

    groq_client = get_groq_client()
    if not groq_client:
        return []
        
    prompt = f"""You are a medical data extraction tool. Extract numerical health metrics (like Hemoglobin, WBC, Sugar, Cholesterol, etc.) from the following medical report text.
    Return ONLY a JSON object with a single key "metrics" which is a list of objects.
    Each object must have exactly these keys:
    - "metric_name": String (e.g., "Hemoglobin", "WBC")
    - "metric_value": Float (e.g., 14.2)
    - "unit": String (e.g., "g/dL", "10^3/uL")
    - "reference_range": String (e.g., "13.0 - 17.0")
    - "flag": String (must be one of: "normal", "high", "low")
    
    If no metrics are found, return {{"metrics": []}}.

    Report Text:
    {extracted_text}
    """
    
    try:
        response = groq_client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=[{"role": "system", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.1,
            max_tokens=1024
        )
        
        content = response.choices[0].message.content
        parsed = json.loads(content)
        return parsed.get("metrics", [])
    except Exception as e:
        print(f"Failed to extract metrics: {e}")
        return []

def extract_prescriptions_from_report(extracted_text: str):
    """Uses Groq to extract medicines from a raw prescription text as JSON."""
    if not extracted_text or len(extracted_text) < 10:
        return []

    groq_client = get_groq_client()
    if not groq_client:
        return []
        
    prompt = f"""You are a medical data extraction tool. Extract prescribed medications from the following medical prescription text.
    Return ONLY a JSON object with a single key "medicines" which is a list of objects.
    Each object must have exactly these keys:
    - "medicine_name": String (e.g., "Paracetamol 500mg", "Amoxicillin")
    - "dosage": String (e.g., "1 tablet", "5 ml") - leave empty string if not found
    - "frequency": String (e.g., "Twice a day", "1-0-1", "After meals") - leave empty string if not found
    - "duration": String (e.g., "5 days", "1 month") - leave empty string if not found
    
    If no medicines are found in the text, return {{"medicines": []}}.

    Prescription Text:
    {extracted_text}
    """
    
    try:
        response = groq_client.chat.completions.create(
            model=DEFAULT_MODEL,
            messages=[{"role": "system", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.1,
            max_tokens=1024
        )
        
        content = response.choices[0].message.content
        parsed = json.loads(content)
        return parsed.get("medicines", [])
    except Exception as e:
        print(f"Failed to extract prescriptions: {e}")
        return []
