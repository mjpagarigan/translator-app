import { Platform } from "react-native";

// Use localhost for web, machine IP for native devices
const DEV_HOST = Platform.select({
  web: "localhost",
  default: "192.168.1.100", // Change to your machine's local IP
});

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_BACKEND_URL || `http://${DEV_HOST}:8000`;

export const WS_BASE_URL =
  process.env.EXPO_PUBLIC_WS_URL || `ws://${DEV_HOST}:8000`;

export const DEFAULT_SOURCE_LANGUAGE = "auto";
export const DEFAULT_TARGET_LANGUAGE = "kor_Hang";

export const MAX_RECORDING_DURATION_MS = 30000; // 30 seconds
export const AUDIO_SAMPLE_RATE = 16000;

export const LANGUAGE_REGIONS: Record<string, string[]> = {
  "Popular": [
    "eng_Latn", "spa_Latn", "fra_Latn", "deu_Latn", "zho_Hans",
    "jpn_Jpan", "kor_Hang", "arb_Arab", "hin_Deva", "por_Latn",
    "rus_Cyrl", "ita_Latn", "tgl_Latn",
  ],
  "Asian": [
    "jpn_Jpan", "kor_Hang", "zho_Hans", "zho_Hant", "hin_Deva",
    "ben_Beng", "tha_Thai", "vie_Latn", "ind_Latn", "zsm_Latn",
    "tgl_Latn", "tam_Taml", "tel_Telu", "mal_Mlym", "kan_Knda",
    "khm_Khmr", "lao_Laoo", "mya_Mymr", "npi_Deva", "sin_Sinh",
    "urd_Arab", "guj_Gujr", "mar_Deva", "pan_Guru",
  ],
  "European": [
    "eng_Latn", "spa_Latn", "fra_Latn", "deu_Latn", "ita_Latn",
    "por_Latn", "rus_Cyrl", "nld_Latn", "pol_Latn", "ukr_Cyrl",
    "ron_Latn", "ces_Latn", "ell_Grek", "hun_Latn", "swe_Latn",
    "dan_Latn", "fin_Latn", "nob_Latn", "bul_Cyrl", "hrv_Latn",
    "slk_Latn", "slv_Latn", "srp_Cyrl", "cat_Latn", "eus_Latn",
  ],
  "Middle Eastern": [
    "arb_Arab", "pes_Arab", "tur_Latn", "heb_Hebr", "urd_Arab",
    "pbt_Arab", "kaz_Cyrl", "uzn_Latn", "tgk_Cyrl", "azj_Latn",
  ],
  "African": [
    "swh_Latn", "hau_Latn", "yor_Latn", "ibo_Latn", "amh_Ethi",
    "som_Latn", "zul_Latn", "xho_Latn", "afr_Latn", "lin_Latn",
    "sna_Latn", "kin_Latn",
  ],
};
