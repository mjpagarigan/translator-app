"""
Maps between three different language code systems:
- Whisper: ISO 639-1 codes ("en", "ko", "tl", etc.)
- NLLB: flores200 codes ("eng_Latn", "kor_Hang", "tgl_Latn", etc.)
- ElevenLabs: BCP-47 / language names
"""

# Whisper ISO code -> NLLB flores200 code
WHISPER_TO_NLLB: dict[str, str] = {
    "af": "afr_Latn",
    "am": "amh_Ethi",
    "ar": "arb_Arab",
    "as": "asm_Beng",
    "az": "azj_Latn",
    "ba": "bak_Cyrl",
    "be": "bel_Cyrl",
    "bg": "bul_Cyrl",
    "bn": "ben_Beng",
    "bo": "bod_Tibt",
    "br": "bre_Latn",
    "bs": "bos_Latn",
    "ca": "cat_Latn",
    "cs": "ces_Latn",
    "cy": "cym_Latn",
    "da": "dan_Latn",
    "de": "deu_Latn",
    "el": "ell_Grek",
    "en": "eng_Latn",
    "es": "spa_Latn",
    "et": "est_Latn",
    "eu": "eus_Latn",
    "fa": "pes_Arab",
    "fi": "fin_Latn",
    "fo": "fao_Latn",
    "fr": "fra_Latn",
    "ga": "gle_Latn",
    "gl": "glg_Latn",
    "gu": "guj_Gujr",
    "ha": "hau_Latn",
    "haw": "haw_Latn",
    "he": "heb_Hebr",
    "hi": "hin_Deva",
    "hr": "hrv_Latn",
    "ht": "hat_Latn",
    "hu": "hun_Latn",
    "hy": "hye_Armn",
    "id": "ind_Latn",
    "is": "isl_Latn",
    "it": "ita_Latn",
    "ja": "jpn_Jpan",
    "jw": "jav_Latn",
    "ka": "kat_Geor",
    "kk": "kaz_Cyrl",
    "km": "khm_Khmr",
    "kn": "kan_Knda",
    "ko": "kor_Hang",
    "la": "lat_Latn",
    "lb": "ltz_Latn",
    "ln": "lin_Latn",
    "lo": "lao_Laoo",
    "lt": "lit_Latn",
    "lv": "lvs_Latn",
    "mg": "plt_Latn",
    "mi": "mri_Latn",
    "mk": "mkd_Cyrl",
    "ml": "mal_Mlym",
    "mn": "khk_Cyrl",
    "mr": "mar_Deva",
    "ms": "zsm_Latn",
    "mt": "mlt_Latn",
    "my": "mya_Mymr",
    "ne": "npi_Deva",
    "nl": "nld_Latn",
    "nn": "nno_Latn",
    "no": "nob_Latn",
    "oc": "oci_Latn",
    "pa": "pan_Guru",
    "pl": "pol_Latn",
    "ps": "pbt_Arab",
    "pt": "por_Latn",
    "ro": "ron_Latn",
    "ru": "rus_Cyrl",
    "sa": "san_Deva",
    "sd": "snd_Arab",
    "si": "sin_Sinh",
    "sk": "slk_Latn",
    "sl": "slv_Latn",
    "sn": "sna_Latn",
    "so": "som_Latn",
    "sq": "als_Latn",
    "sr": "srp_Cyrl",
    "su": "sun_Latn",
    "sv": "swe_Latn",
    "sw": "swh_Latn",
    "ta": "tam_Taml",
    "te": "tel_Telu",
    "tg": "tgk_Cyrl",
    "th": "tha_Thai",
    "tk": "tuk_Latn",
    "tl": "tgl_Latn",
    "tr": "tur_Latn",
    "tt": "tat_Cyrl",
    "uk": "ukr_Cyrl",
    "ur": "urd_Arab",
    "uz": "uzn_Latn",
    "vi": "vie_Latn",
    "yi": "ydd_Hebr",
    "yo": "yor_Latn",
    "zh": "zho_Hans",
    "zu": "zul_Latn",
}

# NLLB code -> human-readable display name
NLLB_TO_DISPLAY: dict[str, tuple[str, str]] = {
    "ace_Arab": ("Acehnese (Arabic)", "بهسا اچيه"),
    "ace_Latn": ("Acehnese (Latin)", "Bahsa Acèh"),
    "acm_Arab": ("Mesopotamian Arabic", "عربي"),
    "acq_Arab": ("Ta'izzi-Adeni Arabic", "عربي"),
    "aeb_Arab": ("Tunisian Arabic", "تونسي"),
    "afr_Latn": ("Afrikaans", "Afrikaans"),
    "ajp_Arab": ("South Levantine Arabic", "عربي"),
    "aka_Latn": ("Akan", "Akan"),
    "als_Latn": ("Albanian", "Shqip"),
    "amh_Ethi": ("Amharic", "አማርኛ"),
    "apc_Arab": ("North Levantine Arabic", "عربي"),
    "arb_Arab": ("Arabic", "العربية"),
    "ars_Arab": ("Najdi Arabic", "عربي"),
    "ary_Arab": ("Moroccan Arabic", "الدارجة"),
    "arz_Arab": ("Egyptian Arabic", "مصري"),
    "asm_Beng": ("Assamese", "অসমীয়া"),
    "ast_Latn": ("Asturian", "Asturianu"),
    "awa_Deva": ("Awadhi", "अवधी"),
    "ayr_Latn": ("Central Aymara", "Aymar aru"),
    "azb_Arab": ("South Azerbaijani", "تۆرکجه"),
    "azj_Latn": ("Azerbaijani", "Azərbaycan"),
    "bak_Cyrl": ("Bashkir", "Башҡорт"),
    "bam_Latn": ("Bambara", "Bamanankan"),
    "ban_Latn": ("Balinese", "Basa Bali"),
    "bel_Cyrl": ("Belarusian", "Беларуская"),
    "bem_Latn": ("Bemba", "Ichibemba"),
    "ben_Beng": ("Bengali", "বাংলা"),
    "bho_Deva": ("Bhojpuri", "भोजपुरी"),
    "bjn_Arab": ("Banjar (Arabic)", "بنجر"),
    "bjn_Latn": ("Banjar (Latin)", "Banjar"),
    "bod_Tibt": ("Tibetan", "བོད་སྐད"),
    "bos_Latn": ("Bosnian", "Bosanski"),
    "bre_Latn": ("Breton", "Brezhoneg"),
    "bug_Latn": ("Buginese", "ᨅᨔ ᨕᨘᨁᨗ"),
    "bul_Cyrl": ("Bulgarian", "Български"),
    "cat_Latn": ("Catalan", "Català"),
    "ceb_Latn": ("Cebuano", "Cebuano"),
    "ces_Latn": ("Czech", "Čeština"),
    "cjk_Latn": ("Chokwe", "Chokwe"),
    "ckb_Arab": ("Central Kurdish", "کوردی"),
    "crh_Latn": ("Crimean Tatar", "Qırımtatar"),
    "cym_Latn": ("Welsh", "Cymraeg"),
    "dan_Latn": ("Danish", "Dansk"),
    "deu_Latn": ("German", "Deutsch"),
    "dik_Latn": ("Southwestern Dinka", "Thuɔŋjäŋ"),
    "dyu_Latn": ("Dyula", "Julakan"),
    "dzo_Tibt": ("Dzongkha", "རྫོང་ཁ"),
    "ell_Grek": ("Greek", "Ελληνικά"),
    "eng_Latn": ("English", "English"),
    "epo_Latn": ("Esperanto", "Esperanto"),
    "est_Latn": ("Estonian", "Eesti"),
    "eus_Latn": ("Basque", "Euskara"),
    "ewe_Latn": ("Ewe", "Eʋegbe"),
    "fao_Latn": ("Faroese", "Føroyskt"),
    "fij_Latn": ("Fijian", "Na Vosa Vakaviti"),
    "fin_Latn": ("Finnish", "Suomi"),
    "fon_Latn": ("Fon", "Fɔngbe"),
    "fra_Latn": ("French", "Français"),
    "fur_Latn": ("Friulian", "Furlan"),
    "fuv_Latn": ("Nigerian Fulfulde", "Fulfulde"),
    "gaz_Latn": ("West Central Oromo", "Afaan Oromoo"),
    "gla_Latn": ("Scottish Gaelic", "Gàidhlig"),
    "gle_Latn": ("Irish", "Gaeilge"),
    "glg_Latn": ("Galician", "Galego"),
    "grn_Latn": ("Guarani", "Avañe'ẽ"),
    "guj_Gujr": ("Gujarati", "ગુજરાતી"),
    "hat_Latn": ("Haitian Creole", "Kreyòl Ayisyen"),
    "hau_Latn": ("Hausa", "Hausa"),
    "haw_Latn": ("Hawaiian", "ʻŌlelo Hawaiʻi"),
    "heb_Hebr": ("Hebrew", "עברית"),
    "hin_Deva": ("Hindi", "हिन्दी"),
    "hne_Deva": ("Chhattisgarhi", "छत्तीसगढ़ी"),
    "hrv_Latn": ("Croatian", "Hrvatski"),
    "hun_Latn": ("Hungarian", "Magyar"),
    "hye_Armn": ("Armenian", "Հայերեն"),
    "ibo_Latn": ("Igbo", "Igbo"),
    "ilo_Latn": ("Ilocano", "Iloko"),
    "ind_Latn": ("Indonesian", "Bahasa Indonesia"),
    "isl_Latn": ("Icelandic", "Íslenska"),
    "ita_Latn": ("Italian", "Italiano"),
    "jav_Latn": ("Javanese", "Basa Jawa"),
    "jpn_Jpan": ("Japanese", "日本語"),
    "kab_Latn": ("Kabyle", "Taqbaylit"),
    "kac_Latn": ("Jingpho", "Jinghpaw"),
    "kam_Latn": ("Kamba", "Kĩkamba"),
    "kan_Knda": ("Kannada", "ಕನ್ನಡ"),
    "kas_Arab": ("Kashmiri (Arabic)", "كٲشُر"),
    "kas_Deva": ("Kashmiri (Devanagari)", "कॉशुर"),
    "kat_Geor": ("Georgian", "ქართული"),
    "kaz_Cyrl": ("Kazakh", "Қазақша"),
    "kbp_Latn": ("Kabiyè", "Kabɩyɛ"),
    "kea_Latn": ("Kabuverdianu", "Kriolu"),
    "khk_Cyrl": ("Mongolian", "Монгол"),
    "khm_Khmr": ("Khmer", "ភាសាខ្មែរ"),
    "kik_Latn": ("Kikuyu", "Gĩkũyũ"),
    "kin_Latn": ("Kinyarwanda", "Ikinyarwanda"),
    "kir_Cyrl": ("Kyrgyz", "Кыргызча"),
    "kmb_Latn": ("Kimbundu", "Kimbundu"),
    "kmr_Latn": ("Northern Kurdish", "Kurmancî"),
    "knc_Arab": ("Central Kanuri (Arabic)", "كانوري"),
    "knc_Latn": ("Central Kanuri (Latin)", "Kanuri"),
    "kon_Latn": ("Kikongo", "Kikongo"),
    "kor_Hang": ("Korean", "한국어"),
    "lao_Laoo": ("Lao", "ລາວ"),
    "lat_Latn": ("Latin", "Latina"),
    "lij_Latn": ("Ligurian", "Ligure"),
    "lim_Latn": ("Limburgish", "Limburgs"),
    "lin_Latn": ("Lingala", "Lingála"),
    "lit_Latn": ("Lithuanian", "Lietuvių"),
    "lmo_Latn": ("Lombard", "Lombard"),
    "ltg_Latn": ("Latgalian", "Latgaļu"),
    "ltz_Latn": ("Luxembourgish", "Lëtzebuergesch"),
    "lua_Latn": ("Luba-Kasai", "Tshiluba"),
    "lug_Latn": ("Ganda", "Luganda"),
    "luo_Latn": ("Luo", "Dholuo"),
    "lus_Latn": ("Mizo", "Mizo ṭawng"),
    "lvs_Latn": ("Latvian", "Latviešu"),
    "mag_Deva": ("Magahi", "मगही"),
    "mai_Deva": ("Maithili", "मैथिली"),
    "mal_Mlym": ("Malayalam", "മലയാളം"),
    "mar_Deva": ("Marathi", "मराठी"),
    "min_Latn": ("Minangkabau", "Baso Minang"),
    "mkd_Cyrl": ("Macedonian", "Македонски"),
    "mlt_Latn": ("Maltese", "Malti"),
    "mni_Beng": ("Manipuri", "মৈতৈলোন্"),
    "mos_Latn": ("Mossi", "Mooré"),
    "mri_Latn": ("Maori", "Te Reo Māori"),
    "mya_Mymr": ("Burmese", "မြန်မာဘာသာ"),
    "nld_Latn": ("Dutch", "Nederlands"),
    "nno_Latn": ("Norwegian Nynorsk", "Nynorsk"),
    "nob_Latn": ("Norwegian Bokmål", "Bokmål"),
    "npi_Deva": ("Nepali", "नेपाली"),
    "nso_Latn": ("Northern Sotho", "Sepedi"),
    "nus_Latn": ("Nuer", "Thok Nath"),
    "nya_Latn": ("Chichewa", "Chichewa"),
    "oci_Latn": ("Occitan", "Occitan"),
    "ory_Orya": ("Odia", "ଓଡ଼ିଆ"),
    "pag_Latn": ("Pangasinan", "Pangasinan"),
    "pan_Guru": ("Punjabi", "ਪੰਜਾਬੀ"),
    "pap_Latn": ("Papiamento", "Papiamentu"),
    "pbt_Arab": ("Pashto", "پښتو"),
    "pes_Arab": ("Persian", "فارسی"),
    "plt_Latn": ("Malagasy", "Malagasy"),
    "pol_Latn": ("Polish", "Polski"),
    "por_Latn": ("Portuguese", "Português"),
    "prs_Arab": ("Dari", "دری"),
    "quy_Latn": ("Quechua", "Runasimi"),
    "ron_Latn": ("Romanian", "Română"),
    "run_Latn": ("Rundi", "Ikirundi"),
    "rus_Cyrl": ("Russian", "Русский"),
    "sag_Latn": ("Sango", "Sängö"),
    "san_Deva": ("Sanskrit", "संस्कृतम्"),
    "sat_Olck": ("Santali", "ᱥᱟᱱᱛᱟᱲᱤ"),
    "scn_Latn": ("Sicilian", "Sicilianu"),
    "shn_Mymr": ("Shan", "လိၵ်ႈတႆး"),
    "sin_Sinh": ("Sinhala", "සිංහල"),
    "slk_Latn": ("Slovak", "Slovenčina"),
    "slv_Latn": ("Slovenian", "Slovenščina"),
    "smo_Latn": ("Samoan", "Gagana Sāmoa"),
    "sna_Latn": ("Shona", "ChiShona"),
    "snd_Arab": ("Sindhi", "سنڌي"),
    "som_Latn": ("Somali", "Soomaali"),
    "sot_Latn": ("Southern Sotho", "Sesotho"),
    "spa_Latn": ("Spanish", "Español"),
    "srp_Cyrl": ("Serbian", "Српски"),
    "ssw_Latn": ("Swati", "SiSwati"),
    "sun_Latn": ("Sundanese", "Basa Sunda"),
    "swe_Latn": ("Swedish", "Svenska"),
    "swh_Latn": ("Swahili", "Kiswahili"),
    "szl_Latn": ("Silesian", "Ślōnsko godka"),
    "tam_Taml": ("Tamil", "தமிழ்"),
    "tat_Cyrl": ("Tatar", "Татарча"),
    "tel_Telu": ("Telugu", "తెలుగు"),
    "tgk_Cyrl": ("Tajik", "Тоҷикӣ"),
    "tgl_Latn": ("Filipino", "Filipino"),
    "tha_Thai": ("Thai", "ไทย"),
    "tir_Ethi": ("Tigrinya", "ትግርኛ"),
    "tpi_Latn": ("Tok Pisin", "Tok Pisin"),
    "tsn_Latn": ("Tswana", "Setswana"),
    "tso_Latn": ("Tsonga", "Xitsonga"),
    "tuk_Latn": ("Turkmen", "Türkmen"),
    "tum_Latn": ("Tumbuka", "ChiTumbuka"),
    "tur_Latn": ("Turkish", "Türkçe"),
    "twi_Latn": ("Twi", "Twi"),
    "tzm_Tfng": ("Central Atlas Tamazight", "ⵜⴰⵎⴰⵣⵉⵖⵜ"),
    "uig_Arab": ("Uyghur", "ئۇيغۇرچە"),
    "ukr_Cyrl": ("Ukrainian", "Українська"),
    "umb_Latn": ("Umbundu", "Umbundu"),
    "urd_Arab": ("Urdu", "اردو"),
    "uzn_Latn": ("Uzbek", "O'zbek"),
    "vec_Latn": ("Venetian", "Vèneto"),
    "vie_Latn": ("Vietnamese", "Tiếng Việt"),
    "war_Latn": ("Waray", "Winaray"),
    "wol_Latn": ("Wolof", "Wolof"),
    "xho_Latn": ("Xhosa", "IsiXhosa"),
    "ydd_Hebr": ("Yiddish", "ייִדיש"),
    "yor_Latn": ("Yoruba", "Èdè Yorùbá"),
    "yue_Hant": ("Cantonese", "粵語"),
    "zho_Hans": ("Chinese (Simplified)", "中文(简体)"),
    "zho_Hant": ("Chinese (Traditional)", "中文(繁體)"),
    "zsm_Latn": ("Malay", "Bahasa Melayu"),
    "zul_Latn": ("Zulu", "IsiZulu"),
}

# ElevenLabs supported languages (multilingual_v2 model)
ELEVENLABS_LANGUAGES: set[str] = {
    "eng_Latn",  # English
    "jpn_Jpan",  # Japanese
    "zho_Hans",  # Chinese
    "deu_Latn",  # German
    "hin_Deva",  # Hindi
    "fra_Latn",  # French
    "kor_Hang",  # Korean
    "por_Latn",  # Portuguese
    "ita_Latn",  # Italian
    "spa_Latn",  # Spanish
    "ind_Latn",  # Indonesian
    "nld_Latn",  # Dutch
    "tur_Latn",  # Turkish
    "tgl_Latn",  # Filipino
    "pol_Latn",  # Polish
    "swe_Latn",  # Swedish
    "bul_Cyrl",  # Bulgarian
    "ron_Latn",  # Romanian
    "arb_Arab",  # Arabic
    "ces_Latn",  # Czech
    "ell_Grek",  # Greek
    "fin_Latn",  # Finnish
    "hrv_Latn",  # Croatian
    "zsm_Latn",  # Malay
    "slk_Latn",  # Slovak
    "dan_Latn",  # Danish
    "tam_Taml",  # Tamil
    "ukr_Cyrl",  # Ukrainian
    "rus_Cyrl",  # Russian
}

# NLLB code -> ElevenLabs language code (for API calls)
NLLB_TO_ELEVENLABS: dict[str, str] = {
    "eng_Latn": "en",
    "jpn_Jpan": "ja",
    "zho_Hans": "zh",
    "deu_Latn": "de",
    "hin_Deva": "hi",
    "fra_Latn": "fr",
    "kor_Hang": "ko",
    "por_Latn": "pt",
    "ita_Latn": "it",
    "spa_Latn": "es",
    "ind_Latn": "id",
    "nld_Latn": "nl",
    "tur_Latn": "tr",
    "tgl_Latn": "fil",
    "pol_Latn": "pl",
    "swe_Latn": "sv",
    "bul_Cyrl": "bg",
    "ron_Latn": "ro",
    "arb_Arab": "ar",
    "ces_Latn": "cs",
    "ell_Grek": "el",
    "fin_Latn": "fi",
    "hrv_Latn": "hr",
    "zsm_Latn": "ms",
    "slk_Latn": "sk",
    "dan_Latn": "da",
    "tam_Taml": "ta",
    "ukr_Cyrl": "uk",
    "rus_Cyrl": "ru",
}

# Whisper-supported language codes
WHISPER_LANGUAGES: set[str] = set(WHISPER_TO_NLLB.keys())


def whisper_to_nllb(whisper_code: str) -> str | None:
    """Convert a Whisper ISO code to NLLB flores200 code."""
    return WHISPER_TO_NLLB.get(whisper_code)


def get_display_name(nllb_code: str) -> str:
    """Get human-readable name for an NLLB language code."""
    entry = NLLB_TO_DISPLAY.get(nllb_code)
    return entry[0] if entry else nllb_code


def get_native_name(nllb_code: str) -> str:
    """Get native name for an NLLB language code."""
    entry = NLLB_TO_DISPLAY.get(nllb_code)
    return entry[1] if entry else nllb_code


def is_tts_supported(nllb_code: str) -> bool:
    """Check if ElevenLabs TTS supports this language."""
    return nllb_code in ELEVENLABS_LANGUAGES


def get_elevenlabs_code(nllb_code: str) -> str | None:
    """Get ElevenLabs language code from NLLB code."""
    return NLLB_TO_ELEVENLABS.get(nllb_code)


def get_supported_languages() -> list[dict]:
    """Return full list of supported languages with capabilities."""
    whisper_nllb_codes = set(WHISPER_TO_NLLB.values())
    languages = []
    for code, (name, native_name) in NLLB_TO_DISPLAY.items():
        languages.append(
            {
                "code": code,
                "name": name,
                "native_name": native_name,
                "whisper_supported": code in whisper_nllb_codes,
                "nllb_supported": True,
                "tts_supported": code in ELEVENLABS_LANGUAGES,
                "voice_clone_supported": code in ELEVENLABS_LANGUAGES,
            }
        )
    return sorted(languages, key=lambda x: x["name"])
