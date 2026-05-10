import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { VerseDisplay } from '@/components/VerseDisplay';
import { useAudio } from '@/contexts/AudioContext';
import { quranApi } from '@/services/quranApi';
import { Surah } from '@/types/quran';
import { SurahText } from '@/types/verse';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TabTwoScreen() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSurahText, setCurrentSurahText] = useState<SurahText | null>(null);
  const [showVerses, setShowVerses] = useState(false);
  const [currentSurahId, setCurrentSurahId] = useState<string | null>(null);
  const params = useLocalSearchParams();
  const { playAudio, pauseAudio, resumeAudio, restartAudio, isPlaying, isLoading, currentSurah, currentPosition, duration } = useAudio();

  const reciterName = params.reciterName as string || 'قارئ';
  const server = params.server as string || '';

  useEffect(() => {
    loadSurahs();
  }, []);

  const loadSurahs = async () => {
    setLoading(true);
    const data = await quranApi.getSurahs('ar');
    setSurahs(data);
    setLoading(false);
  };

  const handleSurahSelect = async (surah: Surah) => {
    if (!server) {
      Alert.alert('خطأ', 'الرجاء اختيار قارئ أولاً');
      return;
    }

    // If clicking the same surah that's currently loaded
    if (currentSurahId === surah.id) {
      if (isPlaying) {
        await pauseAudio();
      } else {
        // Resume if paused, or play if stopped
        if (currentSurah === surah.name) {
          await resumeAudio();
        } else {
          // Start playing fresh
          const url = quranApi.getSurahUrl(server, surah.id);
          await playAudio(url, surah.name, reciterName);
        }
      }
      return;
    }

    // Load new surah
    const url = quranApi.getSurahUrl(server, surah.id);

    // Load surah text
    const surahText = await quranApi.getSurahText(surah.id);
    if (surahText) {
      console.log(`Loaded ${surahText.ayahs.length} verses for ${surahText.name}`);
      setCurrentSurahText(surahText);
      setCurrentSurahId(surah.id);
      setShowVerses(true);
    } else {
      console.error('Failed to load surah text');
    }

    await playAudio(url, surah.name, reciterName);
  };

  const renderSurah = ({ item, index }: { item: Surah; index: number }) => {
    const isCurrentlyPlaying = isPlaying && currentSurah === item.name;

    return (
      <TouchableOpacity
        style={[styles.surahCard, isCurrentlyPlaying && styles.surahCardActive]}
        onPress={() => handleSurahSelect(item)}
        activeOpacity={0.7}
        hasTVPreferredFocus={index === 0}
      >
        <View style={styles.surahNumber}>
          <ThemedText style={styles.surahNumberText}>{item.id}</ThemedText>
        </View>
        <View style={styles.surahInfo}>
          <ThemedText style={[styles.surahName, isCurrentlyPlaying && styles.activeSurahText]}>
            {item.name}
          </ThemedText>
          <ThemedText style={styles.surahType}>
            {item.makkia === '1' ? 'مكية' : 'مدنية'}
          </ThemedText>
        </View>
        {isCurrentlyPlaying && (
          <ThemedText style={styles.playingIndicator}>▶</ThemedText>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#1a9e5d" />
        <ThemedText style={styles.loadingText}>جاري تحميل السور...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <ThemedText type="title" style={styles.title}>
          السور
        </ThemedText>
        <ThemedText style={styles.subtitle}>{reciterName}</ThemedText>
      </ThemedView>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <ThemedText style={styles.loadingOverlayText}>جاري التحميل...</ThemedText>
        </View>
      )}

      <FlatList
        data={surahs}
        renderItem={renderSurah}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        numColumns={1}
      />

      {/* Floating Player Controls */}
      {currentSurah && (
        <View style={styles.floatingPlayer}>
          <View style={styles.playerInfo}>
            <ThemedText style={styles.playerSurahName} numberOfLines={1}>
              {currentSurah}
            </ThemedText>
            <ThemedText style={styles.playerReciterName} numberOfLines={1}>
              {reciterName}
            </ThemedText>
          </View>

          <View style={styles.playerControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={async () => {
                if (isPlaying) {
                  await pauseAudio();
                } else {
                  await resumeAudio();
                }
              }}
              activeOpacity={0.7}
              hasTVPreferredFocus={true}
            >
              <ThemedText style={styles.controlIcon}>
                {isPlaying ? '⏸' : '▶'}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={async () => {
                await restartAudio();
              }}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.controlIcon}>↻</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setShowVerses(true)}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.controlIcon}>📖</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal
        visible={showVerses}
        animationType="slide"
        onRequestClose={() => setShowVerses(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowVerses(false)}
              hasTVPreferredFocus={true}
            >
              <ThemedText style={styles.closeButtonText}>✕</ThemedText>
            </TouchableOpacity>
          </View>
          {currentSurahText && (
            <VerseDisplay
              verses={currentSurahText.ayahs}
              surahName={currentSurahText.name}
              isPlaying={isPlaying}
              currentPosition={currentPosition}
              duration={duration}
              onTogglePlay={async () => {
                if (isPlaying) {
                  await pauseAudio();
                } else {
                  await resumeAudio();
                }
              }}
              onRestart={async () => {
                await restartAudio();
              }}
            />
          )}
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  listContainer: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 100,
  },
  surahCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  surahCardActive: {
    backgroundColor: '#1a9e5d',
  },
  surahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a9e5d',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  surahNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  surahInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  surahName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  activeSurahText: {
    color: '#fff',
  },
  surahType: {
    fontSize: 14,
    opacity: 0.6,
  },
  playingIndicator: {
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    padding: 15,
    paddingTop: 50,
    backgroundColor: '#1a9e5d',
    alignItems: 'flex-start',
  },
  closeButton: {
    padding: 10,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  closeButtonText: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingOverlayText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
  },
  floatingPlayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a9e5d',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingBottom: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  playerInfo: {
    flex: 1,
    marginRight: 15,
  },
  playerSurahName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
    textAlign: 'right',
  },
  playerReciterName: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'right',
  },
  playerControls: {
    flexDirection: 'row',
    gap: 10,
  },
  controlButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  controlIcon: {
    fontSize: 22,
    color: '#fff',
  },
});
