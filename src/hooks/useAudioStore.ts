import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { audioManager, type BGMType, type TrackInfo } from '../utils/audioManager';
import type { SfxKey } from '../data/sfx';
import { useEffect, useState } from 'react';

interface AudioState {
    volume: number;
    isMuted: boolean;
    bgmEnabled: boolean;
    currentBGM: BGMType | null;

    setVolume: (volume: number) => void;
    toggleMute: () => void;
    playBGM: (type: BGMType) => void;
    playSfx: (key: SfxKey, scale?: number) => void;
    playSFX: (src: string, scale?: number) => void;
    nextTrack: () => void;
    prevTrack: () => void;
    playTrack: (index: number) => void;
    togglePlay: () => void;
}

export const useAudioStore = create<AudioState>()(
    persist(
        (set, get) => ({
            volume: 0.5,
            isMuted: false,
            bgmEnabled: true,
            currentBGM: null,

            setVolume: (volume) => {
                set({ volume });
                audioManager.setVolume(volume);
            },

            toggleMute: () => {
                const newMute = !get().isMuted;
                set({ isMuted: newMute });
                audioManager.setMute(newMute);
            },

            playBGM: (type) => {
                set({ currentBGM: type });
                audioManager.setBgmEnabled(get().bgmEnabled);
                audioManager.playBGM(type);
            },

            playSfx: (key, scale = 1.0) => {
                audioManager.playSfx(key, scale);
            },

            playSFX: (src, scale = 1.0) => {
                audioManager.playSFX(src, scale);
            },

            nextTrack: () => {
                set({ bgmEnabled: true });
                audioManager.setBgmEnabled(true);
                audioManager.playlistNext();
            },

            prevTrack: () => {
                set({ bgmEnabled: true });
                audioManager.setBgmEnabled(true);
                audioManager.playlistPrev();
            },

            playTrack: (index) => {
                set({ bgmEnabled: true });
                audioManager.setBgmEnabled(true);
                audioManager.playTrack(index);
            },

            togglePlay: () => {
                const shouldEnable = !audioManager.getIsPlaying();
                set({ bgmEnabled: shouldEnable });
                audioManager.setBgmEnabled(shouldEnable);
                audioManager.togglePlay();
            }
        }),
        {
            name: 'audio-settings',
            partialize: (state) => ({
                volume: state.volume,
                isMuted: state.isMuted,
                bgmEnabled: state.bgmEnabled,
            }),
            onRehydrateStorage: () => (state) => {
                if (!state) return;
                audioManager.setVolume(state.volume);
                audioManager.setMute(state.isMuted);
                audioManager.setBgmEnabled(state.bgmEnabled);
            },
        }
    )
);

// Hook that syncs live audioManager state (isPlaying, currentTrack, playlist)
// into React state via the subscription system
export function useAudioLiveState() {
    const [isPlaying, setIsPlaying] = useState(() => audioManager.getIsPlaying());
    const [currentTrack, setCurrentTrack] = useState<TrackInfo>(() => audioManager.getCurrentTrack());
    const [playlist, setPlaylist] = useState<TrackInfo[]>(() => audioManager.getPlaylist());

    useEffect(() => {
        const unsub = audioManager.subscribe(() => {
            setIsPlaying(audioManager.getIsPlaying());
            setCurrentTrack(audioManager.getCurrentTrack());
            setPlaylist(audioManager.getPlaylist());
        });
        return unsub;
    }, []);

    return { isPlaying, currentTrack, playlist };
}
