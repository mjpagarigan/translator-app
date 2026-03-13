from pydantic import BaseModel


class TranscriptionResponse(BaseModel):
    text: str
    language: str
    language_code: str


class TextTranslationRequest(BaseModel):
    text: str
    source_language: str
    target_language: str


class TextTranslationResponse(BaseModel):
    source_text: str
    source_language: str
    source_language_code: str
    translated_text: str
    target_language: str
    target_language_code: str


class TranslationResponse(BaseModel):
    source_text: str
    source_language: str
    source_language_code: str
    translated_text: str
    target_language: str
    target_language_code: str
    audio_base64: str | None = None
    voice_cloned: bool = False
    processing_time_ms: int = 0


class TTSRequest(BaseModel):
    text: str
    voice_id: str | None = None
    language: str = "en"


class VoiceCloneResponse(BaseModel):
    voice_id: str
    name: str
    status: str = "created"


class VoiceInfo(BaseModel):
    voice_id: str
    name: str
    is_cloned: bool = False


class VoiceListResponse(BaseModel):
    voices: list[VoiceInfo]


class LanguageInfo(BaseModel):
    code: str
    name: str
    native_name: str
    whisper_supported: bool = False
    nllb_supported: bool = True
    tts_supported: bool = False
    voice_clone_supported: bool = False


class HealthResponse(BaseModel):
    status: str
    whisper_loaded: bool
    nllb_loaded: bool
    elevenlabs_configured: bool


class WSStatusMessage(BaseModel):
    type: str = "status"
    status: str


class WSTranslationMessage(BaseModel):
    type: str = "translation"
    source_text: str
    translated_text: str
    audio_base64: str | None = None
    source_language: str
