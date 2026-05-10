import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AudioContextType {
    isPlaying: boolean;
    isLoading: boolean;
    currentSurah: string | null;
    currentReciter: string | null;
    currentPosition: number;
    duration: number;
    playAudio: (url: string, surahName: string, reciterName: string) => Promise<void>;
    pauseAudio: () => Promise<void>;
    resumeAudio: () => Promise<void>;
    stopAudio: () => Promise<void>;
    restartAudio: () => Promise<void>;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sound, setSound] = useState<Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentSurah, setCurrentSurah] = useState<string | null>(null);
    const [currentReciter, setCurrentReciter] = useState<string | null>(null);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        // Configure audio mode for background playback
        Audio.setAudioModeAsync({
            staysActiveInBackground: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
        });

        return () => {
            if (sound) {
                sound.unloadAsync().catch(console.error);
            }
        };
    }, [sound]);

    const playAudio = async (url: string, surahName: string, reciterName: string) => {
        try {
            setIsLoading(true);

            // Stop and unload current sound if any
            if (sound) {
                await sound.stopAsync().catch(console.error);
                await sound.unloadAsync().catch(console.error);
                setSound(null);
            }

            // Create and play new sound
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: url },
                { shouldPlay: true }
            );

            setSound(newSound);
            setIsPlaying(true);
            setCurrentSurah(surahName);
            setCurrentReciter(reciterName);

            // Set up playback status update
            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded) {
                    setIsPlaying(status.isPlaying);
                    setCurrentPosition(status.positionMillis || 0);
                    setDuration(status.durationMillis || 0);
                    if (status.didJustFinish) {
                        setIsPlaying(false);
                        setCurrentPosition(0);
                    }
                }
            });

            setIsLoading(false);
        } catch (error) {
            console.error('Error playing audio:', error);
            setIsLoading(false);
            setSound(null);
            setIsPlaying(false);
        }
    };

    const pauseAudio = async () => {
        if (sound) {
            await sound.pauseAsync();
            setIsPlaying(false);
        }
    };

    const resumeAudio = async () => {
        if (sound) {
            await sound.playAsync();
            setIsPlaying(true);
        }
    };

    const stopAudio = async () => {
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
            setSound(null);
            setIsPlaying(false);
            setCurrentSurah(null);
            setCurrentReciter(null);
            setCurrentPosition(0);
            setDuration(0);
        }
    };

    const restartAudio = async () => {
        if (sound) {
            await sound.setPositionAsync(0);
            await sound.playAsync();
            setIsPlaying(true);
            setCurrentPosition(0);
        }
    };

    return (
        <AudioContext.Provider
            value={{
                isPlaying,
                isLoading,
                currentSurah,
                currentReciter,
                currentPosition,
                duration,
                playAudio,
                pauseAudio,
                resumeAudio,
                stopAudio,
                restartAudio,
            }}
        >
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within AudioProvider');
    }
    return context;
};
