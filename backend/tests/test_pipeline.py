"""Tests for the translation pipeline."""

import pytest
from app.services.language_map import (
    whisper_to_nllb,
    get_display_name,
    get_native_name,
    is_tts_supported,
    get_elevenlabs_code,
    get_supported_languages,
)


def test_whisper_to_nllb_mapping():
    assert whisper_to_nllb("en") == "eng_Latn"
    assert whisper_to_nllb("ko") == "kor_Hang"
    assert whisper_to_nllb("tl") == "tgl_Latn"
    assert whisper_to_nllb("ja") == "jpn_Jpan"
    assert whisper_to_nllb("zh") == "zho_Hans"
    assert whisper_to_nllb("unknown") is None


def test_display_names():
    assert get_display_name("eng_Latn") == "English"
    assert get_display_name("kor_Hang") == "Korean"
    assert get_display_name("tgl_Latn") == "Filipino"


def test_native_names():
    assert get_native_name("kor_Hang") == "한국어"
    assert get_native_name("jpn_Jpan") == "日本語"


def test_tts_supported():
    assert is_tts_supported("eng_Latn") is True
    assert is_tts_supported("kor_Hang") is True
    assert is_tts_supported("tha_Thai") is False


def test_elevenlabs_code():
    assert get_elevenlabs_code("eng_Latn") == "en"
    assert get_elevenlabs_code("kor_Hang") == "ko"
    assert get_elevenlabs_code("tha_Thai") is None


def test_supported_languages_list():
    languages = get_supported_languages()
    assert len(languages) > 100

    # Check structure
    lang = languages[0]
    assert "code" in lang
    assert "name" in lang
    assert "native_name" in lang
    assert "whisper_supported" in lang
    assert "nllb_supported" in lang
    assert "tts_supported" in lang

    # Check sorted by name
    names = [l["name"] for l in languages]
    assert names == sorted(names)
