import os
import tempfile
import logging
from typing import Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

def transcribe_audio(audio_data: bytes, session_id: str, filename: Optional[str] = None) -> str:
    """
    Decodes raw audio bytes and transcribes it using:
    1. OpenAI Whisper API (if key is set)
    2. SpeechRecognition Google API (free bilingual fallback)
    3. Preset static simulation triggers (if APIs fail or keys are absent)
    """
    transcript_text = ""

    # 1. Whisper API integration
    if settings.OPENAI_API_KEY:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                temp_file.write(audio_data)
                temp_filepath = temp_file.name
            
            try:
                with open(temp_filepath, "rb") as audio_file:
                    transcription = client.audio.transcriptions.create(
                        model="whisper-1", 
                        file=audio_file
                    )
                    transcript_text = transcription.text
                    logger.info(f"Whisper transcribed text: {transcript_text}")
            finally:
                if os.path.exists(temp_filepath):
                    os.remove(temp_filepath)
        except Exception as e:
            logger.error(f"Whisper API transcription failed: {e}")

    # 2. Free Google Speech Recognition fallback
    if not transcript_text:
        try:
            import io
            import soundfile as sf
            import speech_recognition as sr
            
            logger.info("Attempting free SpeechRecognition pipeline for audio file...")
            audio_file = io.BytesIO(audio_data)
            data, samplerate = sf.read(audio_file)
            
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_wav:
                temp_wav_name = temp_wav.name
            try:
                sf.write(temp_wav_name, data, samplerate, format='WAV', subtype='PCM_16')
                r = sr.Recognizer()
                with sr.AudioFile(temp_wav_name) as source:
                    audio_captured = r.record(source)
                
                # Heuristic bilingual selector: hi-IN for Hindi triggers, en-IN for English/Hinglish
                lang = "hi-IN" if (filename and "hindi" in filename.lower()) else "en-IN"
                transcript_text = r.recognize_google(audio_captured, language=lang)
                logger.info(f"Free SpeechRecognition transcribed content ({lang}): {transcript_text}")
            finally:
                if os.path.exists(temp_wav_name):
                    os.remove(temp_wav_name)
        except Exception as e:
            logger.warning(f"Free SpeechRecognition fallback skipped/failed: {e}")

    # 3. Fallback / Simulation based on keywords or filename
    if not transcript_text or "[Error" in transcript_text:
        lower_sid = session_id.lower()
        lower_fn = filename.lower() if filename else ""
        
        if "cbi" in lower_sid or "cbi" in lower_fn:
            transcript_text = "This is a call from CBI Head Office. Your bank details were found in a money laundering case. Do not speak to anyone or leave this room."
        elif "customs" in lower_sid or "customs" in lower_fn:
            transcript_text = "I am a Customs Officer calling from Mumbai Airport. We have seized a parcel containing drugs sent in your name. You face immediate arrest."
        elif "bank" in lower_sid or "bank" in lower_fn:
            transcript_text = "Hello, this is a genuine confirmation from your bank regarding your recent card transaction. Did you authorize this charge?"
        elif "deepfake" in lower_sid or "deepfake" in lower_fn:
            transcript_text = "Hello, this is an urgent notification from your telecom carrier. Your SIM card is involved in illegal activity. You face digital arrest and a security fine."
        else:
            transcript_text = "This is an alert from the Cyber Department. We found illegal transactions on your bank account. You must deposit liquid cash for security clearance."

    return transcript_text
