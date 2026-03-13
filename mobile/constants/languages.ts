import { LanguageInfo } from "../types";

/**
 * Static language list for offline use / fast initial load.
 * The full list is fetched from the backend at runtime.
 */
export const POPULAR_LANGUAGES: LanguageInfo[] = [
  { code: "eng_Latn", name: "English", native_name: "English", whisper_supported: true, nllb_supported: true, tts_supported: true, voice_clone_supported: true },
  { code: "spa_Latn", name: "Spanish", native_name: "Español", whisper_supported: true, nllb_supported: true, tts_supported: true, voice_clone_supported: true },
  { code: "fra_Latn", name: "French", native_name: "Français", whisper_supported: true, nllb_supported: true, tts_supported: true, voice_clone_supported: true },
  { code: "deu_Latn", name: "German", native_name: "Deutsch", whisper_supported: true, nllb_supported: true, tts_supported: true, voice_clone_supported: true },
  { code: "zho_Hans", name: "Chinese (Simplified)", native_name: "中文(简体)", whisper_supported: true, nllb_supported: true, tts_supported: true, voice_clone_supported: true },
  { code: "jpn_Jpan", name: "Japanese", native_name: "日本語", whisper_supported: true, nllb_supported: true, tts_supported: true, voice_clone_supported: true },
  { code: "kor_Hang", name: "Korean", native_name: "한국어", whisper_supported: true, nllb_supported: true, tts_supported: true, voice_clone_supported: true },
  { code: "arb_Arab", name: "Arabic", native_name: "العربية", whisper_supported: true, nllb_supported: true, tts_supported: true, voice_clone_supported: true },
  { code: "hin_Deva", name: "Hindi", native_name: "हिन्दी", whisper_supported: true, nllb_supported: true, tts_supported: true, voice_clone_supported: true },
  { code: "por_Latn", name: "Portuguese", native_name: "Português", whisper_supported: true, nllb_supported: true, tts_supported: true, voice_clone_supported: true },
  { code: "rus_Cyrl", name: "Russian", native_name: "Русский", whisper_supported: true, nllb_supported: true, tts_supported: true, voice_clone_supported: true },
  { code: "ita_Latn", name: "Italian", native_name: "Italiano", whisper_supported: true, nllb_supported: true, tts_supported: true, voice_clone_supported: true },
  { code: "tgl_Latn", name: "Filipino", native_name: "Filipino", whisper_supported: true, nllb_supported: true, tts_supported: true, voice_clone_supported: true },
  { code: "tha_Thai", name: "Thai", native_name: "ไทย", whisper_supported: true, nllb_supported: true, tts_supported: false, voice_clone_supported: false },
  { code: "vie_Latn", name: "Vietnamese", native_name: "Tiếng Việt", whisper_supported: true, nllb_supported: true, tts_supported: false, voice_clone_supported: false },
  { code: "ind_Latn", name: "Indonesian", native_name: "Bahasa Indonesia", whisper_supported: true, nllb_supported: true, tts_supported: true, voice_clone_supported: true },
  { code: "nld_Latn", name: "Dutch", native_name: "Nederlands", whisper_supported: true, nllb_supported: true, tts_supported: true, voice_clone_supported: true },
  { code: "pol_Latn", name: "Polish", native_name: "Polski", whisper_supported: true, nllb_supported: true, tts_supported: true, voice_clone_supported: true },
  { code: "tur_Latn", name: "Turkish", native_name: "Türkçe", whisper_supported: true, nllb_supported: true, tts_supported: true, voice_clone_supported: true },
  { code: "ukr_Cyrl", name: "Ukrainian", native_name: "Українська", whisper_supported: true, nllb_supported: true, tts_supported: true, voice_clone_supported: true },
];

export const AUTO_DETECT = {
  code: "auto",
  name: "Auto-detect",
  native_name: "Auto",
  whisper_supported: true,
  nllb_supported: false,
  tts_supported: false,
  voice_clone_supported: false,
};
