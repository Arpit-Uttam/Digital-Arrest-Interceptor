import os
from dotenv import load_dotenv

# Load variables from .env file if it exists
load_dotenv()

class Settings:
    PROJECT_NAME: str = "Digital Arrest Interceptor API"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./interceptor.db")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    
    # LLM Settings
    DEFAULT_LLM_PROVIDER: str = os.getenv("DEFAULT_LLM_PROVIDER", "fallback")  # anthropic, openai, fallback
    
    # Risk Fusion Settings
    # final_score = RULE_WEIGHT * rule_score + LLM_WEIGHT * llm_score
    RULE_WEIGHT: float = float(os.getenv("RULE_WEIGHT", "0.4"))
    LLM_WEIGHT: float = float(os.getenv("LLM_WEIGHT", "0.6"))
    ALERT_THRESHOLD: float = float(os.getenv("ALERT_THRESHOLD", "75.0"))  # Alert triggered if risk_score > 75

settings = Settings()
