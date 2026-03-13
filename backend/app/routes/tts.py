"""Text-to-speech only endpoint."""

import base64
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from app.models import tts_model
from app.schemas.models import TTSRequest

router = APIRouter()


@router.post("/tts")
async def text_to_speech(request: TTSRequest):
    """Convert text to speech audio."""
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    try:
        audio_bytes, voice_cloned = tts_model.synthesize(
            text=request.text,
            voice_id=request.voice_id,
            language_code=request.language,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS failed: {str(e)}")

    return Response(
        content=audio_bytes,
        media_type="audio/mpeg",
        headers={
            "X-Voice-Cloned": str(voice_cloned).lower(),
        },
    )
