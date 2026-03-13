"""Tests for NLLB translation model."""

import pytest
from app.models import nllb_model


@pytest.fixture(scope="module", autouse=True)
def load_model():
    """Load NLLB model once for all tests in this module."""
    nllb_model.load_model()


def test_model_loads():
    assert nllb_model.is_loaded()


def test_translate_english_to_spanish():
    result = nllb_model.translate("Hello, how are you?", "eng_Latn", "spa_Latn")
    assert isinstance(result, str)
    assert len(result) > 0


def test_translate_english_to_korean():
    result = nllb_model.translate("Good morning", "eng_Latn", "kor_Hang")
    assert isinstance(result, str)
    assert len(result) > 0


def test_translate_same_language():
    result = nllb_model.translate("Hello", "eng_Latn", "eng_Latn")
    assert result == "Hello"


def test_translate_with_whisper_code():
    result = nllb_model.translate("Hello", "en", "kor_Hang")
    assert isinstance(result, str)
    assert len(result) > 0


def test_translate_unsupported_language():
    with pytest.raises(ValueError):
        nllb_model.translate("Hello", "xxx_Xxxx", "eng_Latn")
