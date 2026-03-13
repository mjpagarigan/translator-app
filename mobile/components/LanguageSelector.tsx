import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TouchableOpacity,
  TextInput,
  Pressable,
} from "react-native";
import { LanguageInfo } from "../types";
import { useTranslationStore } from "../stores/translationStore";

interface LanguageSelectorProps {
  label: string;
  selected: LanguageInfo;
  onSelect: (lang: LanguageInfo) => void;
  showAutoDetect?: boolean;
}

export function LanguageSelector({
  label,
  selected,
  onSelect,
  showAutoDetect = false,
}: LanguageSelectorProps) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");
  const { languages, recentLanguages } = useTranslationStore();

  const filteredLanguages = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return languages;
    return languages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(query) ||
        lang.native_name.toLowerCase().includes(query) ||
        lang.code.toLowerCase().includes(query)
    );
  }, [languages, search]);

  const recentLangs = useMemo(() => {
    return recentLanguages
      .map((code) => languages.find((l) => l.code === code))
      .filter(Boolean) as LanguageInfo[];
  }, [recentLanguages, languages]);

  const handleSelect = (lang: LanguageInfo) => {
    onSelect(lang);
    setVisible(false);
    setSearch("");
  };

  return (
    <>
      <Pressable style={styles.selector} onPress={() => setVisible(true)}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.selectedName} numberOfLines={1}>
          {selected.name}
        </Text>
        <Text style={styles.arrow}>&#9662;</Text>
      </Pressable>

      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Language</Text>
            <TouchableOpacity onPress={() => { setVisible(false); setSearch(""); }}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search languages..."
            value={search}
            onChangeText={setSearch}
            autoFocus
          />

          {showAutoDetect && !search && (
            <TouchableOpacity
              style={styles.autoDetect}
              onPress={() =>
                handleSelect({
                  code: "auto",
                  name: "Auto-detect",
                  native_name: "Auto",
                  whisper_supported: true,
                  nllb_supported: false,
                  tts_supported: false,
                  voice_clone_supported: false,
                })
              }
            >
              <Text style={styles.autoDetectText}>Auto-detect</Text>
              <Text style={styles.autoDetectSub}>
                Automatically detect the spoken language
              </Text>
            </TouchableOpacity>
          )}

          {recentLangs.length > 0 && !search && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent</Text>
              {recentLangs.map((lang) => (
                <LanguageRow
                  key={lang.code}
                  lang={lang}
                  isSelected={selected.code === lang.code}
                  onPress={() => handleSelect(lang)}
                />
              ))}
            </View>
          )}

          <FlatList
            data={filteredLanguages}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <LanguageRow
                lang={item}
                isSelected={selected.code === item.code}
                onPress={() => handleSelect(item)}
              />
            )}
            style={styles.list}
          />
        </View>
      </Modal>
    </>
  );
}

function LanguageRow({
  lang,
  isSelected,
  onPress,
}: {
  lang: LanguageInfo;
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.langRow, isSelected && styles.langRowSelected]}
      onPress={onPress}
    >
      <View style={styles.langInfo}>
        <Text style={[styles.langName, isSelected && styles.langNameSelected]}>
          {lang.name}
        </Text>
        <Text style={styles.langNative}>{lang.native_name}</Text>
      </View>
      <View style={styles.badges}>
        {lang.whisper_supported && <Badge text="ASR" color="#4CAF50" />}
        {lang.tts_supported && <Badge text="TTS" color="#2196F3" />}
        {lang.voice_clone_supported && <Badge text="Clone" color="#9C27B0" />}
      </View>
    </TouchableOpacity>
  );
}

function Badge({ text, color }: { text: string; color: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: color + "20" }]}>
      <Text style={[styles.badgeText, { color }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  selector: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 12,
    minWidth: 140,
    flexDirection: "column",
    alignItems: "center",
  },
  label: {
    fontSize: 11,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  selectedName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  arrow: {
    fontSize: 10,
    color: "#999",
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  closeButton: {
    fontSize: 16,
    color: "#6C63FF",
    fontWeight: "600",
  },
  searchInput: {
    margin: 16,
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    fontSize: 16,
  },
  autoDetect: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "#F8F7FF",
  },
  autoDetectText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6C63FF",
  },
  autoDetectSub: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
  },
  section: {
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
    paddingHorizontal: 16,
    paddingVertical: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  list: {
    flex: 1,
  },
  langRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F0F0F0",
  },
  langRowSelected: {
    backgroundColor: "#F8F7FF",
  },
  langInfo: {
    flex: 1,
  },
  langName: {
    fontSize: 16,
    color: "#333",
  },
  langNameSelected: {
    color: "#6C63FF",
    fontWeight: "600",
  },
  langNative: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
  },
  badges: {
    flexDirection: "row",
    gap: 4,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
});
