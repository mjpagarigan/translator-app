import { create } from "zustand";
import {
  LanguageInfo,
  TranslationResult,
  TranslationStatus,
  VoiceInfo,
} from "../types";
import { POPULAR_LANGUAGES, AUTO_DETECT } from "../constants/languages";

interface TranslationStore {
  // Languages
  sourceLanguage: LanguageInfo;
  targetLanguage: LanguageInfo;
  languages: LanguageInfo[];
  recentLanguages: string[];

  // Translation state
  status: TranslationStatus;
  currentResult: TranslationResult | null;
  error: string | null;

  // Voice
  selectedVoiceId: string | null;
  voices: VoiceInfo[];

  // Settings
  autoPlay: boolean;
  backendUrl: string;

  // Actions
  setSourceLanguage: (lang: LanguageInfo) => void;
  setTargetLanguage: (lang: LanguageInfo) => void;
  swapLanguages: () => void;
  setLanguages: (langs: LanguageInfo[]) => void;
  addRecentLanguage: (code: string) => void;

  setStatus: (status: TranslationStatus) => void;
  setResult: (result: TranslationResult | null) => void;
  setError: (error: string | null) => void;

  setSelectedVoiceId: (id: string | null) => void;
  setVoices: (voices: VoiceInfo[]) => void;

  setAutoPlay: (val: boolean) => void;
  setBackendUrl: (url: string) => void;
}

export const useTranslationStore = create<TranslationStore>((set, get) => ({
  // Initial state
  sourceLanguage: AUTO_DETECT as LanguageInfo,
  targetLanguage: POPULAR_LANGUAGES.find((l) => l.code === "kor_Hang")!,
  languages: POPULAR_LANGUAGES,
  recentLanguages: [],

  status: "idle",
  currentResult: null,
  error: null,

  selectedVoiceId: null,
  voices: [],

  autoPlay: true,
  backendUrl: "",

  // Actions
  setSourceLanguage: (lang) => {
    set({ sourceLanguage: lang });
    get().addRecentLanguage(lang.code);
  },

  setTargetLanguage: (lang) => {
    set({ targetLanguage: lang });
    get().addRecentLanguage(lang.code);
  },

  swapLanguages: () => {
    const { sourceLanguage, targetLanguage } = get();
    if (sourceLanguage.code === "auto") return; // Can't swap auto-detect
    set({ sourceLanguage: targetLanguage, targetLanguage: sourceLanguage });
  },

  setLanguages: (langs) => set({ languages: langs }),

  addRecentLanguage: (code) => {
    if (code === "auto") return;
    const recent = get().recentLanguages.filter((c) => c !== code);
    recent.unshift(code);
    set({ recentLanguages: recent.slice(0, 5) });
  },

  setStatus: (status) => set({ status }),
  setResult: (result) => set({ currentResult: result, status: result ? "done" : "idle" }),
  setError: (error) => set({ error, status: error ? "error" : "idle" }),

  setSelectedVoiceId: (id) => set({ selectedVoiceId: id }),
  setVoices: (voices) => set({ voices }),

  setAutoPlay: (val) => set({ autoPlay: val }),
  setBackendUrl: (url) => set({ backendUrl: url }),
}));
