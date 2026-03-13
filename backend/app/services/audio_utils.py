"""Audio format conversion and utility functions."""

import io
import tempfile
import os
import logging

from pydub import AudioSegment

logger = logging.getLogger(__name__)


def convert_to_wav(audio_bytes: bytes, source_format: str = "webm") -> bytes:
    """
    Convert audio bytes from any format to WAV (16kHz, mono) for Whisper.

    Args:
        audio_bytes: Raw audio bytes.
        source_format: Format of the input audio (webm, mp3, ogg, wav, etc.).

    Returns:
        WAV audio bytes (16kHz, mono, 16-bit PCM).
    """
    try:
        audio = AudioSegment.from_file(io.BytesIO(audio_bytes), format=source_format)
    except Exception:
        # Try auto-detection if explicit format fails
        audio = AudioSegment.from_file(io.BytesIO(audio_bytes))

    # Convert to Whisper-compatible format
    audio = audio.set_frame_rate(16000).set_channels(1).set_sample_width(2)

    buf = io.BytesIO()
    audio.export(buf, format="wav")
    buf.seek(0)
    return buf.read()


def get_audio_duration(audio_bytes: bytes) -> float:
    """Get duration of audio in seconds."""
    try:
        audio = AudioSegment.from_file(io.BytesIO(audio_bytes))
        return len(audio) / 1000.0
    except Exception:
        return 0.0


def detect_format(content_type: str) -> str:
    """Map MIME content type to pydub format string."""
    mime_map = {
        "audio/wav": "wav",
        "audio/x-wav": "wav",
        "audio/wave": "wav",
        "audio/webm": "webm",
        "audio/ogg": "ogg",
        "audio/mp3": "mp3",
        "audio/mpeg": "mp3",
        "audio/mp4": "mp4",
        "audio/m4a": "m4a",
        "audio/flac": "flac",
    }
    return mime_map.get(content_type, "wav")


def compute_energy(audio_bytes: bytes) -> float:
    """Compute RMS energy of audio for VAD (Voice Activity Detection)."""
    try:
        audio = AudioSegment.from_file(io.BytesIO(audio_bytes), format="wav")
        return audio.rms
    except Exception:
        return 0.0
