"""Orchestrates the full ASR -> NMT -> TTS translation pipeline."""

import base64
import logging
import time

from app.models import whisper_model, nllb_model, tts_model
from app.services.audio_utils import convert_to_wav
from app.services.language_map import (
    whisper_to_nllb,
    get_display_name,
    is_tts_supported,
)

logger = logging.getLogger(__name__)


class TranslationResult:
    def __init__(
        self,
        source_text: str,
        source_language: str,
        source_language_code: str,
        translated_text: str,
        target_language: str,
        target_language_code: str,
        audio_base64: str | None,
        voice_cloned: bool,
        processing_time_ms: int,
    ):
        self.source_text = source_text
        self.source_language = source_language
        self.source_language_code = source_language_code
        self.translated_text = translated_text
        self.target_language = target_language
        self.target_language_code = target_language_code
        self.audio_base64 = audio_base64
        self.voice_cloned = voice_cloned
        self.processing_time_ms = processing_time_ms

    def to_dict(self) -> dict:
        return {
            "source_text": self.source_text,
            "source_language": self.source_language,
            "source_language_code": self.source_language_code,
            "translated_text": self.translated_text,
            "target_language": self.target_language,
            "target_language_code": self.target_language_code,
            "audio_base64": self.audio_base64,
            "voice_cloned": self.voice_cloned,
            "processing_time_ms": self.processing_time_ms,
        }


async def translate_speech(
    audio_bytes: bytes,
    target_language: str,
    voice_id: str | None = None,
    source_format: str = "wav",
    on_status=None,
) -> TranslationResult:
    """
    Full translation pipeline: audio -> transcribe -> translate -> TTS.

    Args:
        audio_bytes: Raw audio bytes.
        target_language: NLLB language code for target.
        voice_id: Optional ElevenLabs voice ID for cloned voice.
        source_format: Audio format of input.
        on_status: Optional async callback for status updates.
    """
    start_time = time.time()

    # Step 1: Convert audio to WAV
    if source_format != "wav":
        audio_bytes = convert_to_wav(audio_bytes, source_format)

    # Step 2: Transcribe
    if on_status:
        await on_status("transcribing")
    logger.info("Transcribing audio...")
    transcription = whisper_model.transcribe(audio_bytes)
    source_text = transcription["text"]
    detected_lang = transcription["language"]

    # Convert Whisper language to NLLB code
    source_nllb = whisper_to_nllb(detected_lang)
    if source_nllb is None:
        source_nllb = "eng_Latn"  # fallback

    source_display = get_display_name(source_nllb)
    target_display = get_display_name(target_language)

    # Step 3: Translate (skip if same language)
    if on_status:
        await on_status("translating")

    if source_nllb == target_language:
        translated_text = source_text
    else:
        logger.info("Translating %s -> %s", source_nllb, target_language)
        translated_text = nllb_model.translate(
            source_text, source_nllb, target_language
        )

    # Step 4: Synthesize speech
    if on_status:
        await on_status("synthesizing")
    logger.info("Synthesizing speech...")

    try:
        audio_out, voice_cloned = tts_model.synthesize(
            translated_text, voice_id, target_language
        )
        audio_base64 = base64.b64encode(audio_out).decode("utf-8")
    except Exception as e:
        logger.error("TTS failed: %s", e)
        audio_base64 = None
        voice_cloned = False

    elapsed_ms = int((time.time() - start_time) * 1000)

    return TranslationResult(
        source_text=source_text,
        source_language=source_display,
        source_language_code=source_nllb,
        translated_text=translated_text,
        target_language=target_display,
        target_language_code=target_language,
        audio_base64=audio_base64,
        voice_cloned=voice_cloned,
        processing_time_ms=elapsed_ms,
    )
