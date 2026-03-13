"""Voice management endpoints (clone, list, delete)."""

from fastapi import APIRouter, File, Form, UploadFile, HTTPException

from app.models import tts_model
from app.schemas.models import VoiceCloneResponse, VoiceListResponse, VoiceInfo

router = APIRouter()


@router.post("/voice/clone", response_model=VoiceCloneResponse)
async def clone_voice(
    name: str = Form(...),
    audio_files: list[UploadFile] = File(...),
):
    """Create a voice clone from audio samples."""
    if not tts_model.is_configured():
        raise HTTPException(
            status_code=503,
            detail="ElevenLabs not configured. Set ELEVENLABS_API_KEY.",
        )

    if len(audio_files) < 1 or len(audio_files) > 5:
        raise HTTPException(
            status_code=400, detail="Provide 1-5 audio files for voice cloning"
        )

    audio_bytes_list = []
    for f in audio_files:
        data = await f.read()
        if len(data) == 0:
            raise HTTPException(status_code=400, detail="Empty audio file provided")
        audio_bytes_list.append(data)

    try:
        result = tts_model.clone_voice(name, audio_bytes_list)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Voice cloning failed: {str(e)}")

    return VoiceCloneResponse(**result)


@router.get("/voice/list", response_model=VoiceListResponse)
async def list_voices():
    """List available voices (preset + cloned)."""
    voices = tts_model.list_voices()
    return VoiceListResponse(
        voices=[VoiceInfo(**v) for v in voices]
    )


@router.delete("/voice/{voice_id}")
async def delete_voice(voice_id: str):
    """Delete a cloned voice."""
    deleted = tts_model.delete_voice(voice_id)
    return {"deleted": deleted}
