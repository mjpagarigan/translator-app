"""FastAPI application entry point."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS
from app.models import whisper_model, nllb_model, tts_model
from app.routes import translate, transcribe, tts, voice, languages, ws
from app.schemas.models import HealthResponse

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load ML models on startup."""
    logger.info("Starting up - loading models...")
    whisper_model.load_model()
    nllb_model.load_model()
    tts_model.init_client()
    logger.info("All models loaded. Server ready.")
    yield
    logger.info("Shutting down.")


app = FastAPI(
    title="VoiceBridge - Real-Time Voice Translator",
    description="Speech-to-speech translation with voice cloning",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
origins = CORS_ORIGINS.split(",") if CORS_ORIGINS != "*" else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routes
app.include_router(translate.router)
app.include_router(transcribe.router)
app.include_router(tts.router)
app.include_router(voice.router)
app.include_router(languages.router)
app.include_router(ws.router)


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Server health and model status."""
    return HealthResponse(
        status="ok",
        whisper_loaded=whisper_model.is_loaded(),
        nllb_loaded=nllb_model.is_loaded(),
        elevenlabs_configured=tts_model.is_configured(),
    )
