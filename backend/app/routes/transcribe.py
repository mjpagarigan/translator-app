"""Speech-to-text only endpoint."""

from fastapi import APIRouter, File, UploadFile, HTTPException

from app.models import whisper_model
from app.services.audio_utils import convert_to_wav, detect_format
from app.services.language_map import whisper_to_nllb, get_display_name
from app.schemas.models import TranscriptionResponse

router = APIRouter()


@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_audio(audio: UploadFile = File(...)):
    """Transcribe audio to text using Whisper."""
    audio_bytes = await audio.read()

    if len(audio_bytes) > 25 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="Audio file too large (max 25MB)")

    if len(audio_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty audio file")

    source_format = detect_format(audio.content_type or "audio/wav")
    if source_format != "wav":
        audio_bytes = convert_to_wav(audio_bytes, source_format)

    result = whisper_model.transcribe(audio_bytes)

    nllb_code = whisper_to_nllb(result["language"]) or "eng_Latn"
    display_name = get_display_name(nllb_code)

    return TranscriptionResponse(
        text=result["text"],
        language=display_name,
        language_code=nllb_code,
    )
