import json
import logging
from typing import Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)

# Try to import SDKs
try:
    import anthropic
except ImportError:
    anthropic = None

try:
    import openai
except ImportError:
    openai = None

SYSTEM_PROMPT = """
You are an expert cybersecurity threat analyst specializing in phone-based scams, specifically "Digital Arrest" fraud.
Digital arrest scams typically involve:
1. Authority Impersonation (fake CBI, ED, Customs, Police, Judges).
2. Psychological Isolation (ordering the victim to lock doors, stay on camera, tell no one).
3. Urgency creation (threatening immediate arrest warrant, court appearance).
4. Payment coercion (demanding transfer to 'secure' government verification accounts, RBI check accounts).

Analyze the following call transcript snippet. Assess the probability that this is a digital arrest scam on a scale of 0 to 100.
Identify which categories are matched, and write a clear, concise reasoning explanation (max 2 sentences) for user safety warning display.

You MUST respond strictly with a valid JSON object of this structure:
{
  "score": <float, 0-100>,
  "matched_patterns": [<list of strings from "Authority Impersonation", "Isolation", "Urgency", "Payment Coercion">],
  "reasoning": "<string description of the threat indicators found>"
}
Do not return any other text, markdown, or explanation.
"""

def local_fallback_llm_score(text: str) -> Dict[str, Any]:
    """
    Intelligent offline simulator for scam-pattern detection.
    Analyzes phrases semantically to mimic LLM responses when API keys are not set.
    """
    text_lower = text.lower()
    score = 0.0
    matched = []
    reasons = []

    # Semantic analysis mimicry
    # 1. Authority Impersonation
    if any(x in text_lower for x in ["cbi", "central bureau", "ed", "directorate", "customs", "police", "arrest warrant", "warrant", "cyber cell", "crime branch", "officer", "inspector", "giraftar", "गिरफ्तार", "वॉरंट", "जेल", "jail bhejenge"]):
        matched.append("Authority Impersonation")
        reasons.append("Speaker is impersonating a law enforcement official (CBI/ED/Police)")
        score += 40.0
    
    # 2. Isolation
    if any(x in text_lower for x in ["lock", "camera", "don't talk", "dont talk", "confidential", "secret", "don't tell", "dont tell", "disconnect", "do not talk", "do not tell", "secrecy", "kamra band", "room lock", "kisi ko mat batana", "baat mat", "किसी को मत बताना", "बात मत करो"]):
        matched.append("Isolation")
        reasons.append("Speaker is enforcing isolation tactics (camera-on orders, secrecy requirements)")
        score += 20.0

    # 3. Urgency
    if any(x in text_lower for x in ["immediate", "now", "minutes", "jail", "court", "delay", "urgent", "soon", "turant", "jaldi", "abhi ke abhi", "तुरंत", "अभी", "जल्दी"]):
        matched.append("Urgency")
        reasons.append("Speaker is manufacturing extreme urgency and threat of immediate arrest")
        score += 20.0

    # 4. Payment Coercion
    if any(x in text_lower for x in ["transfer", "money", "deposit", "bank", "rbi", "funds", "verify", "pay", "fine", "cash", "paisa transfer", "paise transfer", "पैसे ट्रांसफर", "खाता"]):
        matched.append("Payment Coercion")
        reasons.append("Speaker is coercing the user into a financial transaction or 'asset verification'")
        score += 20.0

    # Adjust score based on combination density to align with production LLMs
    if len(matched) >= 3:
        score = max(score, 90.0)
    elif len(matched) == 2:
        score = max(score, 80.0)
    elif len(matched) == 1:
        score = max(score, 35.0)
    else:
        # Check general conversation tone
        if len(text.split()) > 10:
            score = 5.0
            reasons.append("Conversation seems to be a normal dialogue with low threat indicators.")
        else:
            score = 0.0
            reasons.append("Insufficient transcript length to determine threat.")

    # Cap score
    score = min(score, 100.0)
    
    reasoning_text = " | ".join(reasons) if reasons else "No digital arrest scam signals detected."
    
    return {
        "score": score,
        "matched_patterns": matched,
        "reasoning": reasoning_text
    }

async def llm_score(transcript_text: str) -> Dict[str, Any]:
    """
    Computes LLM semantic score using OpenAI/Anthropic based on configuration.
    Falls back to local offline model if keys are not set or provider defaults to fallback.
    """
    if not transcript_text or len(transcript_text.strip()) < 10:
        return {
            "score": 0.0,
            "matched_patterns": [],
            "reasoning": "Transcript too short to perform semantic analysis."
        }

    # If fallback is explicitly selected, skip external API calls
    if settings.DEFAULT_LLM_PROVIDER == "fallback":
        return local_fallback_llm_score(transcript_text)

    # 1. Try Anthropic if configured and available
    if settings.ANTHROPIC_API_KEY and anthropic:
        try:
            client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
            response = await client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=250,
                temperature=0.0,
                system=SYSTEM_PROMPT,
                messages=[
                    {"role": "user", "content": f"Analyze this transcript: '{transcript_text}'"}
                ]
            )
            content_text = response.content[0].text
            result = json.loads(content_text.strip())
            return result
        except Exception as e:
            logger.error(f"Anthropic API error, trying fallback: {e}")

    # 2. Try OpenAI if configured and available
    if settings.OPENAI_API_KEY and openai:
        try:
            client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            response = await client.chat.completions.create(
                model="gpt-4-turbo",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"Analyze this transcript: '{transcript_text}'"}
                ],
                response_format={"type": "json_object"},
                temperature=0.0
            )
            content_text = response.choices[0].message.content
            result = json.loads(content_text.strip())
            return result
        except Exception as e:
            logger.error(f"OpenAI API error, trying fallback: {e}")

    # 3. Fallback to offline rule-based semantic analyzer
    return local_fallback_llm_score(transcript_text)
