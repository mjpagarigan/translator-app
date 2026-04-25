"""ElevenLabs TTS + voice cloning, with gTTS fallback."""

import io
import json
import logging
from pathlib import Path

from app.config import DATA_DIR, ELEVENLABS_API_KEY
from app.services.language_map import is_tts_supported, get_elevenlabs_code

logger = logging.getLogger(__name__)

_client = None
if DATA_DIR:
    DATA_PATH = Path(DATA_DIR)
    DATA_PATH.mkdir(parents=True, exist_ok=True)
else:
    DATA_PATH = Path(__file__).parent.parent.parent

VOICES_FILE = DATA_PATH / "voices.json"


def init_client() -> None:
    """Initialize ElevenLabs client."""
    global _client
    if not ELEVENLABS_API_KEY:
        logger.warning("ELEVENLABS_API_KEY not set - TTS will use fallback only")
        return
    try:
        from elevenlabs.client import ElevenLabs

        _client = ElevenLabs(api_key=ELEVENLABS_API_KEY)
        logger.info("ElevenLabs client initialized")
    except Exception as e:
        logger.error("Failed to initialize ElevenLabs: %s", e)


def is_configured() -> bool:
    return _client is not None


def clone_voice(name: str, audio_files: list[bytes]) -> dict:
    """
    Create an instant voice clone from audio samples.

    Args:
        name: Name for the cloned voice.
        audio_files: List of audio file bytes (WAV/MP3).

    Returns:
        {"voice_id": str, "name": str, "status": "created"}
    """
    if _client is None:
        raise RuntimeError("ElevenLabs client not configured")

    # Convert bytes to file-like objects
    files = []
    for i, audio in enumerate(audio_files):
        buf = io.BytesIO(audio)
        buf.name = f"sample_{i}.wav"
        files.append(buf)

    voice = _client.clone(name=name, files=files)
    voice_id = voice.voice_id

    # Persist voice info
    _save_voice(voice_id, name)

    return {"voice_id": voice_id, "name": name, "status": "created"}


def synthesize(
    text: str, voice_id: str | None = None, language_code: str = "eng_Latn"
) -> tuple[bytes, bool]:
    """
    Synthesize text to speech.

    Returns:
        (audio_bytes, voice_cloned) - audio as MP3 bytes, and whether cloned voice was used.
    """
    elevenlabs_lang = get_elevenlabs_code(language_code)

    # Try ElevenLabs first if language is supported
    if _client is not None and elevenlabs_lang is not None:
        try:
            vid = voice_id or "21m00Tcm4TlvDq8ikWAM"  # Default "Rachel" voice
            audio_gen = _client.generate(
                text=text,
                voice=vid,
                model="eleven_multilingual_v2",
            )
            # Collect audio bytes from generator
            audio_bytes = b"".join(audio_gen)
            is_cloned = voice_id is not None
            return audio_bytes, is_cloned
        except Exception as e:
            logger.warning("ElevenLabs TTS failed, falling back to gTTS: %s", e)

    # Fallback to gTTS
    return _gtts_fallback(text, language_code), False


def _gtts_fallback(text: str, language_code: str) -> bytes:
    """Use Google TTS as fallback (no voice cloning)."""
    from gtts import gTTS

    # Map NLLB code to gTTS language code (ISO 639-1)
    lang_map = {
        "eng_Latn": "en",
        "kor_Hang": "ko",
        "jpn_Jpan": "ja",
        "zho_Hans": "zh-CN",
        "spa_Latn": "es",
        "fra_Latn": "fr",
        "deu_Latn": "de",
        "arb_Arab": "ar",
        "hin_Deva": "hi",
        "por_Latn": "pt",
        "rus_Cyrl": "ru",
        "ita_Latn": "it",
        "tha_Thai": "th",
        "vie_Latn": "vi",
        "ind_Latn": "id",
        "tgl_Latn": "tl",
        "nld_Latn": "nl",
        "pol_Latn": "pl",
        "tur_Latn": "tr",
        "ukr_Cyrl": "uk",
        "swe_Latn": "sv",
        "ces_Latn": "cs",
        "ron_Latn": "ro",
        "dan_Latn": "da",
        "fin_Latn": "fi",
        "ell_Grek": "el",
        "hun_Latn": "hu",
        "nob_Latn": "no",
        "bul_Cyrl": "bg",
        "hrv_Latn": "hr",
        "slk_Latn": "sk",
        "ben_Beng": "bn",
        "tam_Taml": "ta",
        "tel_Telu": "te",
        "mal_Mlym": "ml",
        "kan_Knda": "kn",
        "guj_Gujr": "gu",
        "mar_Deva": "mr",
        "npi_Deva": "ne",
        "swh_Latn": "sw",
        "cat_Latn": "ca",
        "eus_Latn": "eu",
        "glg_Latn": "gl",
    }

    gtts_lang = lang_map.get(language_code, "en")

    try:
        tts = gTTS(text=text, lang=gtts_lang)
        buf = io.BytesIO()
        tts.write_to_fp(buf)
        buf.seek(0)
        return buf.read()
    except Exception as e:
        logger.error("gTTS fallback also failed: %s", e)
        raise RuntimeError(f"All TTS methods failed for language {language_code}")


def list_voices() -> list[dict]:
    """List available voices (preset + cloned)."""
    voices = []

    # Load cloned voices from local file
    saved = _load_voices()
    for vid, name in saved.items():
        voices.append({"voice_id": vid, "name": name, "is_cloned": True})

    # Add a few default ElevenLabs voices
    defaults = [
        {"voice_id": "21m00Tcm4TlvDq8ikWAM", "name": "Rachel", "is_cloned": False},
        {"voice_id": "ErXwobaYiN019PkySvjV", "name": "Antoni", "is_cloned": False},
        {"voice_id": "MF3mGyEYCl7XYWbV9V6O", "name": "Elli", "is_cloned": False},
        {"voice_id": "TxGEqnHWrfWFTfGW9XjX", "name": "Josh", "is_cloned": False},
    ]
    voices.extend(defaults)
    return voices


def delete_voice(voice_id: str) -> bool:
    """Delete a cloned voice."""
    if _client is not None:
        try:
            _client.voices.delete(voice_id)
        except Exception as e:
            logger.warning("Failed to delete from ElevenLabs: %s", e)

    saved = _load_voices()
    if voice_id in saved:
        del saved[voice_id]
        _write_voices(saved)
        return True
    return False


def _save_voice(voice_id: str, name: str) -> None:
    saved = _load_voices()
    saved[voice_id] = name
    _write_voices(saved)


def _load_voices() -> dict:
    if VOICES_FILE.exists():
        return json.loads(VOICES_FILE.read_text())
    return {}


def _write_voices(data: dict) -> None:
    VOICES_FILE.write_text(json.dumps(data, indent=2))
