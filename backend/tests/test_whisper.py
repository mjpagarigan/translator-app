"""Tests for Whisper ASR model."""

import io
import wave
import struct
import pytest
from app.models import whisper_model


def _make_silent_wav(duration_s: float = 1.0, sample_rate: int = 16000) -> bytes:
    """Generate a silent WAV file for testing."""
    n_samples = int(sample_rate * duration_s)
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(struct.pack(f"<{n_samples}h", *([0] * n_samples)))
    buf.seek(0)
    return buf.read()


@pytest.fixture(scope="module", autouse=True)
def load_model():
    """Load Whisper model once for all tests."""
    whisper_model.load_model()


def test_model_loads():
    assert whisper_model.is_loaded()


def test_transcribe_silent_audio():
    wav_bytes = _make_silent_wav(1.0)
    result = whisper_model.transcribe(wav_bytes)
    assert "text" in result
    assert "language" in result
    assert "segments" in result
    assert isinstance(result["text"], str)
