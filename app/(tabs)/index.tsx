import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { quranApi } from '@/services/quranApi';
import { Reciter } from '@/types/quran';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [reciters, setReciters] = useState<Reciter[]>([]);
  const [filteredReciters, setFilteredReciters] = useState<Reciter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReciter, setSelectedReciter] = useState<Reciter | null>(null);

  useEffect(() => {
    loadReciters();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredReciters(reciters);
    } else {
      const filtered = reciters.filter((reciter) =>
        reciter.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredReciters(filtered);
    }
  }, [searchQuery, reciters]);

  const loadReciters = async () => {
    setLoading(true);
    const data = await quranApi.getReciters('ar');
    setReciters(data);
    setFilteredReciters(data);
    setLoading(false);
  };

  const handleReciterSelect = (reciter: Reciter) => {
    setSelectedReciter(reciter);
    // Navigate to explore tab with reciter data
    router.push({
      pathname: '/(tabs)/explore',
      params: {
        reciterId: reciter.id,
        reciterName: reciter.name,
        server: reciter.moshaf[0]?.server || '',
      },
    });
  };

  const renderReciter = ({ item, index }: { item: Reciter; index: number }) => (
    <TouchableOpacity
      style={styles.reciterCard}
      onPress={() => handleReciterSelect(item)}
      activeOpacity={0.7}
      hasTVPreferredFocus={index === 0}
    >
      <View style={styles.reciterInfo}>
        <ThemedText style={styles.reciterName}>{item.name}</ThemedText>
        {item.moshaf && item.moshaf.length > 0 && (
          <ThemedText style={styles.reciterDetails}>
            {item.moshaf[0].name} • {item.moshaf[0].surah_total} سورة
          </ThemedText>
        )}
      </View>
      <ThemedText style={styles.arrow}>›</ThemedText>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#1a9e5d" />
        <ThemedText style={styles.loadingText}>جاري تحميل القراء...</ThemedText>
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
          القرآن الكريم
        </ThemedText>
        <ThemedText style={styles.subtitle}>اختر القارئ</ThemedText>
      </ThemedView>

      <TextInput
        style={styles.searchInput}
        placeholder="ابحث عن قارئ..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoFocus={false}
      />

      <FlatList
        data={filteredReciters}
        renderItem={renderReciter}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
      />
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
    fontSize: 18,
    opacity: 0.7,
  },
  searchInput: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    fontSize: 16,
    textAlign: 'right',
  },
  listContainer: {
    padding: 20,
    paddingTop: 0,
  },
  reciterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginBottom: 12,
    backgroundColor: '#1a9e5d',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  reciterInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  reciterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  reciterDetails: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  arrow: {
    fontSize: 28,
    color: '#fff',
    marginLeft: 10,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
  },
});
