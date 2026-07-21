import re
from typing import List, Tuple, Dict
from app.core.config import settings

try:
    from rapidfuzz import fuzz
except ImportError:
    fuzz = None

SCAM_CATEGORIES: Dict[str, List[str]] = {
    "Authority Impersonation": [
        "cbi", "central bureau of investigation", "ed", "enforcement directorate",
        "customs department", "customs officer", "police warrant", "supreme court",
        "national crime branch", "money laundering", "drugs found in package",
        "illegal package", "parcel seized", "dcp", "cyber cell", "arrest warrant",
        "taiwan police", "mumbai police",
        # Hinglish Authority triggers
        "arrest karenge", "jail bhejenge", "police case", "court warrant", "crime branch se", 
        "cyber cell se", "arrest warrant hai", "giraftar", "kanooni karwahi",
        # Hindi Devnagari Authority triggers
        "गिरफ्तार", "अरेस्ट", "वॉरंट", "पुलिस", "जेल", "मुकदमा", "कस्टम्स", "सीबीआई"
    ],
    "Isolation": [
        "don't talk to anyone", "keep the camera on", "lock the door",
        "confidential investigation", "secret investigation", "do not tell your family",
        "stay inside", "skype call", "don't disconnect the call", "maintain silence",
        "don't contact anyone",
        # Hinglish Isolation triggers
        "kisi se baat mat karo", "room lock karo", "kamra band karo", "darwaza band karo", 
        "camera on rakho", "camera chalu rakho", "kisi ko mat batana", "call disconnect mat karna", 
        "akela raho", "room me jao",
        # Hindi Devnagari Isolation triggers
        "कमरा बंद", "कैमरा चालू", "किसी को मत बताना", "बात मत करो", "दरवाज़ा बंद"
    ],
    "Urgency": [
        "immediate arrest", "within 30 minutes", "arrest you now",
        "no time", "immediately", "urgent verification", "court hearing today",
        "surrender now", "without delay", "fast verification",
        # Hinglish Urgency triggers
        "abhi ke abhi", "turant", "jaldi", "30 minute me", "30 minutes me", "deley mat karo",
        # Hindi Devnagari Urgency triggers
        "तुरंत", "अभी", "जल्दी", "देरी मत करो"
    ],
    "Payment Coercion": [
        "security deposit", "verify your funds", "transfer money",
        "rbi verification account", "refund department", "liquidate funds",
        "bank details", "pay fine", "avoid jail payment", "net banking login",
        "transfer to nationalized bank",
        # Hinglish Payment triggers
        "paisa transfer karo", "paise transfer", "deposit karo", "rbi verify karega", 
        "verify karo bank", "khata verify", "liquidity test", "audit karenge", "fine dena padega",
        # Hindi Devnagari Payment triggers
        "पैसे ट्रांसफर", "खाता वेरिफिकेशन", "रुपये जमा", "जुर्माना", "बैंक खाता"
    ]
}

CATEGORY_WEIGHTS: Dict[str, float] = {
    "Authority Impersonation": 35.0,
    "Isolation": 20.0,
    "Urgency": 20.0,
    "Payment Coercion": 25.0
}

def rule_based_score(transcript: str) -> Tuple[float, List[str]]:
    """
    Analyzes the transcript text and computes a score (0-100) based on rules.
    Returns (score, list_of_matched_patterns)
    """
    if not transcript:
        return 0.0, []

    text_lower = transcript.lower()
    matched_patterns = []
    category_scores = {cat: 0.0 for cat in SCAM_CATEGORIES}

    # Helper function for matching
    def is_phrase_matched(phrase: str, text: str) -> bool:
        # 1. Exact regex match (word boundaries where appropriate)
        # For acronyms like CBI/ED/RBI, use strict word boundaries
        if len(phrase) <= 3:
            pattern = rf"\b{re.escape(phrase)}\b"
        else:
            pattern = re.escape(phrase)
        if re.search(pattern, text):
            return True

        # 2. Fuzzy matching (if rapidfuzz is available and phrase is long enough)
        if fuzz and len(phrase) > 4:
            # We check if there's any section of the text that matches the phrase
            # by looking at partial ratio. If it's above 85%, we consider it a fuzzy match.
            ratio = fuzz.partial_ratio(phrase, text)
            if ratio >= 85:
                return True
        return False

    for category, phrases in SCAM_CATEGORIES.items():
        matches_found = 0
        for phrase in phrases:
            if is_phrase_matched(phrase, text_lower):
                matches_found += 1
                matched_patterns.append(f"{category}: '{phrase}'")
        
        # Calculate category score: if we match at least one phrase, we get a portion of the score.
        # Matching more phrases increases it up to the category weight.
        if matches_found > 0:
            # First match gives 70% of category weight, subsequent matches top it up
            factor = min(0.70 + (0.15 * (matches_found - 1)), 1.0)
            category_scores[category] = CATEGORY_WEIGHTS[category] * factor

    final_score = sum(category_scores.values())
    
    # Cap the final score to 100.0
    final_score = min(final_score, 100.0)
    
    # Simplify matched patterns for user display (just category names, or a list of specific phrases)
    unique_categories = list(set(pat.split(":")[0] for pat in matched_patterns))

    return round(final_score, 1), unique_categories

def calculate_fusion_score(rule_score: float, llm_score: float) -> float:
    """
    Combines rule-based classification and semantic LLM inference into a final rating.
    """
    final_score = (settings.RULE_WEIGHT * rule_score) + (settings.LLM_WEIGHT * llm_score)
    final_score = min(max(final_score, 0.0), 100.0)
    return round(final_score, 1)
