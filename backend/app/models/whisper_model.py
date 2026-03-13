"""Whisper ASR model - singleton loader and transcription."""

import logging
import tempfile
import os

import whisper
import torch

from app.config import WHISPER_MODEL_SIZE, DEVICE

logger = logging.getLogger(__name__)

_model = None


def load_model() -> None:
    """Load Whisper model into memory (call once at startup)."""
    global _model
    if _model is not None:
        return
    logger.info("Loading Whisper model: %s on %s", WHISPER_MODEL_SIZE, DEVICE)
    torch.set_num_threads(4)
    _model = whisper.load_model(WHISPER_MODEL_SIZE, device=DEVICE)
    logger.info("Whisper model loaded successfully")


def is_loaded() -> bool:
    return _model is not None


def transcribe(audio_bytes: bytes) -> dict:
    """
    Transcribe audio bytes to text.

    Returns:
        {"text": str, "language": str, "segments": list}
    """
    if _model is None:
        raise RuntimeError("Whisper model not loaded. Call load_model() first.")

    # Write bytes to temp file
    tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    try:
        tmp.write(audio_bytes)
        tmp.flush()
        tmp.close()

        result = _model.transcribe(tmp.name)

        return {
            "text": result["text"].strip(),
            "language": result.get("language", "en"),
            "segments": [
                {
                    "start": seg["start"],
                    "end": seg["end"],
                    "text": seg["text"],
                }
                for seg in result.get("segments", [])
            ],
        }
    finally:
        os.unlink(tmp.name)
