"""Full translation pipeline REST endpoint."""

from fastapi import APIRouter, File, Form, UploadFile, HTTPException

from app.services.pipeline import translate_speech
from app.services.audio_utils import detect_format
from app.schemas.models import TranslationResponse, TextTranslationRequest, TextTranslationResponse
from app.models import nllb_model
from app.services.language_map import get_display_name, whisper_to_nllb

router = APIRouter()


@router.post("/translate", response_model=TranslationResponse)
async def translate_audio(
    audio: UploadFile = File(...),
    target_language: str = Form(...),
    voice_id: str = Form(None),
):
    """Full pipeline: audio file -> transcription -> translation -> TTS audio."""
    audio_bytes = await audio.read()

    if len(audio_bytes) > 25 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Audio file too large (max 25MB)")

    if len(audio_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty audio file")

    source_format = detect_format(audio.content_type or "audio/wav")

    result = await translate_speech(
        audio_bytes=audio_bytes,
        target_language=target_language,
        voice_id=voice_id,
        source_format=source_format,
    )

    return TranslationResponse(**result.to_dict())


@router.post("/translate/text", response_model=TextTranslationResponse)
async def translate_text(request: TextTranslationRequest):
    """Text-only translation (no audio involved)."""
    try:
        translated = nllb_model.translate(
            request.text,
            request.source_language,
            request.target_language,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return TextTranslationResponse(
        source_text=request.text,
        source_language=get_display_name(request.source_language),
        source_language_code=request.source_language,
        translated_text=translated,
        target_language=get_display_name(request.target_language),
        target_language_code=request.target_language,
    )
