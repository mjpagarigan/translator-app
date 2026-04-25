import os
from dotenv import load_dotenv

load_dotenv()

ELEVENLABS_API_KEY: str = os.getenv("ELEVENLABS_API_KEY", "")
WHISPER_MODEL_SIZE: str = os.getenv("WHISPER_MODEL_SIZE", "base")
DEVICE: str = os.getenv("DEVICE", "cpu")
MAX_AUDIO_DURATION: int = int(os.getenv("MAX_AUDIO_DURATION", "30"))
CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")
HOST: str = os.getenv("HOST", "0.0.0.0")
PORT: int = int(os.getenv("PORT", "8000"))
DATA_DIR: str = os.getenv("DATA_DIR", "")
MAX_UPLOAD_SIZE: int = 25 * 1024 * 1024  # 25 MB
