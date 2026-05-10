import { Verse } from '@/types/verse';
import React, { useEffect, useRef } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface VerseDisplayProps {
    verses: Verse[];
    surahName: string;
    isPlaying: boolean;
    onTogglePlay: () => void;
    onRestart: () => void;
    currentPosition: number;
    duration: number;
}

export function VerseDisplay({
    verses,
    surahName,
    isPlaying,
    onTogglePlay,
    onRestart,
    currentPosition,
    duration
}: VerseDisplayProps) {
    const flatListRef = useRef<FlatList>(null);

    if (!verses || verses.length === 0) {
        return null;
    }

    // Calculate current verse based on audio position
    const currentVerseIndex = duration > 0
        ? Math.floor((currentPosition / duration) * verses.length)
        : 0;

    // Debug logging
    useEffect(() => {
        if (isPlaying) {
            console.log(`Position: ${currentPosition}ms, Duration: ${duration}ms, Current Verse: ${currentVerseIndex + 1}/${verses.length}`);
        }
    }, [currentPosition, duration, currentVerseIndex, isPlaying, verses.length]);

    // Auto-scroll to current verse
    useEffect(() => {
        if (isPlaying && currentVerseIndex > 0 && currentVerseIndex < verses.length && flatListRef.current) {
            console.log(`Scrolling to verse ${currentVerseIndex} of ${verses.length}`);
            setTimeout(() => {
                try {
                    flatListRef.current?.scrollToIndex({
                        index: currentVerseIndex,
                        animated: true,
                        viewPosition: 0.3,
                    });
                } catch (error) {
                    console.error('Scroll error:', error);
                    // Fallback to scrollToOffset
                    flatListRef.current?.scrollToOffset({
                        offset: currentVerseIndex * 150,
                        animated: true,
                    });
                }
            }, 100);
        }
    }, [currentVerseIndex, isPlaying, verses.length]);

    const renderVerse = ({ item, index }: { item: Verse; index: number }) => {
        const isCurrentVerse = index === currentVerseIndex && isPlaying;

        return (
            <View style={[
                styles.verseWrapper,
                isCurrentVerse && styles.verseWrapperActive
            ]}>
                <ThemedText style={[
                    styles.verseText,
                    isCurrentVerse && styles.verseTextActive
                ]}>
                    {item.text}
                    <ThemedText style={[
                        styles.verseNumber,
                        isCurrentVerse && styles.verseNumberActive
                    ]}> ﴿{item.numberInSurah}﴾</ThemedText>
                </ThemedText>
            </View>
        );
    };

    const ListHeaderComponent = () => (
        <ThemedView style={styles.header}>
            <ThemedText style={styles.surahTitle}>{surahName}</ThemedText>
            <ThemedText style={styles.bismillah}>
                {verses[0]?.numberInSurah === 1 && verses[0]?.text.includes('بِسْمِ')
                    ? ''
                    : 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
            </ThemedText>
            <ThemedText style={styles.verseCount}>
                {verses.length} آية
                {isPlaying && duration > 0 && (
                    <ThemedText style={styles.currentVerseIndicator}>
                        {' • '}الآية {currentVerseIndex + 1}
                    </ThemedText>
                )}
            </ThemedText>

            <TouchableOpacity
                style={styles.playButton}
                onPress={onTogglePlay}
                activeOpacity={0.7}
                hasTVPreferredFocus={true}
            >
                <ThemedText style={styles.playButtonText}>
                    {isPlaying ? '⏸ إيقاف مؤقت' : '▶ تشغيل'}
                </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.restartButton}
                onPress={onRestart}
                activeOpacity={0.7}
            >
                <ThemedText style={styles.restartButtonText}>
                    ↻ إعادة من البداية
                </ThemedText>
            </TouchableOpacity>
        </ThemedView>
    );

    return (
        <ThemedView style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={verses}
                renderItem={renderVerse}
                keyExtractor={(item) => item.number.toString()}
                ListHeaderComponent={ListHeaderComponent}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={true}
                initialNumToRender={30}
                maxToRenderPerBatch={10}
                windowSize={21}
                removeClippedSubviews={false}
                onScrollToIndexFailed={(info) => {
                    const wait = new Promise(resolve => setTimeout(resolve, 500));
                    wait.then(() => {
                        flatListRef.current?.scrollToIndex({
                            index: info.index,
                            animated: true,
                            viewPosition: 0.3
                        });
                    });
                }}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#1a9e5d',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 20,
    },
    surahTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    bismillah: {
        fontSize: 22,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 5,
    },
    verseCount: {
        fontSize: 16,
        color: '#e0e0e0',
        marginTop: 5,
    },
    currentVerseIndicator: {
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold',
    },
    playButton: {
        marginTop: 15,
        backgroundColor: '#fff',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        borderWidth: 3,
        borderColor: 'transparent',
    },
    playButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a9e5d',
    },
    restartButton: {
        marginTop: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#fff',
    },
    restartButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    contentContainer: {
        padding: 20,
        paddingTop: 0,
    },
    verseWrapper: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    verseWrapperActive: {
        backgroundColor: '#e8f5e9',
        borderWidth: 2,
        borderColor: '#1a9e5d',
        elevation: 5,
    },
    verseText: {
        fontSize: 24,
        lineHeight: 45,
        textAlign: 'right',
        color: '#333',
        fontWeight: '500',
    },
    verseTextActive: {
        color: '#000',
        fontWeight: '600',
    },
    verseNumber: {
        fontSize: 20,
        color: '#1a9e5d',
        fontWeight: 'bold',
    },
    verseNumberActive: {
        color: '#1a9e5d',
        fontSize: 22,
    },
});
