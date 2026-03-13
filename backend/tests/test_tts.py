"""Tests for TTS model (gTTS fallback only, no ElevenLabs key needed)."""

import pytest
from app.models import tts_model


def test_gtts_fallback_english():
    """Test gTTS fallback produces audio bytes."""
    audio = tts_model._gtts_fallback("Hello world", "eng_Latn")
    assert isinstance(audio, bytes)
    assert len(audio) > 0


def test_gtts_fallback_spanish():
    audio = tts_model._gtts_fallback("Hola mundo", "spa_Latn")
    assert isinstance(audio, bytes)
    assert len(audio) > 0


def test_gtts_fallback_korean():
    audio = tts_model._gtts_fallback("안녕하세요", "kor_Hang")
    assert isinstance(audio, bytes)
    assert len(audio) > 0
