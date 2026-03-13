"""Meta NLLB-200 translation model - singleton loader and translation."""

import logging

from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

from app.services.language_map import (
    NLLB_TO_DISPLAY,
    whisper_to_nllb,
    get_display_name,
)

logger = logging.getLogger(__name__)

MODEL_NAME = "facebook/nllb-200-distilled-600M"

_model = None
_tokenizer = None


def load_model() -> None:
    """Load NLLB model and tokenizer into memory (call once at startup)."""
    global _model, _tokenizer
    if _model is not None:
        return
    logger.info("Loading NLLB model: %s", MODEL_NAME)
    _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    _model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)
    logger.info("NLLB model loaded successfully")


def is_loaded() -> bool:
    return _model is not None


def translate(text: str, source_lang: str, target_lang: str) -> str:
    """
    Translate text from source_lang to target_lang.

    Args:
        text: Text to translate.
        source_lang: NLLB language code (e.g. "eng_Latn") or Whisper ISO code (e.g. "en").
        target_lang: NLLB language code (e.g. "kor_Hang").

    Returns:
        Translated text string.
    """
    if _model is None or _tokenizer is None:
        raise RuntimeError("NLLB model not loaded. Call load_model() first.")

    # Resolve codes: if a short ISO code is passed, convert to NLLB
    src = _resolve_nllb_code(source_lang)
    tgt = _resolve_nllb_code(target_lang)

    if src is None:
        raise ValueError(f"Unsupported source language: {source_lang}")
    if tgt is None:
        raise ValueError(f"Unsupported target language: {target_lang}")

    if src == tgt:
        return text

    _tokenizer.src_lang = src
    inputs = _tokenizer(text, return_tensors="pt", truncation=True, max_length=512)

    target_token_id = _tokenizer.convert_tokens_to_ids(tgt)
    generated = _model.generate(
        **inputs,
        forced_bos_token_id=target_token_id,
        max_new_tokens=512,
    )

    result = _tokenizer.batch_decode(generated, skip_special_tokens=True)[0]
    return result.strip()


def _resolve_nllb_code(code: str) -> str | None:
    """Resolve a language code to NLLB format."""
    # Already an NLLB code
    if code in NLLB_TO_DISPLAY:
        return code
    # Whisper ISO code
    nllb = whisper_to_nllb(code)
    if nllb:
        return nllb
    return None
