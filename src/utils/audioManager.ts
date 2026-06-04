import { Howl } from 'howler';
import { sfxRegistry, type SfxKey } from '../data/sfx';

export type BGMType = 'intro' | 'cyoa' | 'sheet';

export interface TrackInfo {
    youtubeId: string;
    displayName: string;
    index: number;
}

// Listener callback type for state changes
type AudioStateListener = () => void;

declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: any;
    }
}

class AudioManager {
    private playlist: { id: string; title: string }[] = [
        { id: '8gXrVsuNAkc', title: 'Orbits of Glass' },
        { id: 'ob2FMylnyHM', title: 'Silver Chimes at Sunset' },
        { id: 'ke5T5aIFvcw', title: 'Tea Leaves and Copper Bells' },
        { id: 'z5yIxRUeIlg', title: "The Alchemist's Study" },
        { id: 'YFIussOhdfc', title: "The Bookseller's Tea" },
        { id: 'PbPYoT0lw7U', title: 'The Glass Harp Room' },
        { id: 'DFQ13Y_Xeto', title: "The Lantern Keeper's Walk" },
        { id: 'WhA-6nKUrOo', title: 'The Map of Midnight' },
        { id: 'xo91kEHV6Ao', title: 'Beyond the Overgrown Gate' },
        { id: 'Q0HHf3v1pNM', title: 'Maps of the Silver Night' },
        { id: 'hw383dUGiH4', title: 'The Seventh Card' },
        { id: 'rVZXYHC2_4c', title: 'Underneath the Gilded Arch' },
        { id: 'D2VwmK4IrHw', title: 'After the Last Reading' },
        { id: 'NlSgifw4-Mc', title: 'Before the Final Candle' }
    ];
    private playlistIndex: number = 0;
    private ytPlayer: any = null;
    private isYtReady: boolean = false;
    private volume: number = 0.5;
    private isMuted: boolean = false;
    private isPlaying: boolean = false;
    private bgmEnabled: boolean = true;
    private sfxEnabled: boolean = false; 
    private listeners: Set<AudioStateListener> = new Set();
    private sfxCooldowns: Map<SfxKey, number> = new Map();
    private activeInterruptingSfx: Map<SfxKey, Set<Howl>> = new Map();

    constructor() {
        // Shuffle the entire playlist randomly
        this.playlist = [...this.playlist].sort(() => Math.random() - 0.5);
        this.playlistIndex = Math.max(0, this.playlist.findIndex(track => track.title === 'The Seventh Card'));
        
        this.initYouTubeAPI();
    }

    private initYouTubeAPI() {
        if (typeof window === 'undefined') return;

        // Load YouTube API script
        if (!document.getElementById('youtube-api')) {
            const tag = document.createElement('script');
            tag.id = 'youtube-api';
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        window.onYouTubeIframeAPIReady = () => {
            const container = document.createElement('div');
            container.id = 'youtube-player-container';
            container.style.position = 'fixed';
            container.style.top = '-9999px';
            container.style.left = '-9999px';
            container.style.width = '1px';
            container.style.height = '1px';
            container.style.pointerEvents = 'none';
            document.body.appendChild(container);

            this.ytPlayer = new window.YT.Player('youtube-player-container', {
                height: '0',
                width: '0',
                videoId: this.playlist[this.playlistIndex].id,
                playerVars: {
                    autoplay: 0,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    rel: 0,
                    modestbranding: 1
                },
                events: {
                    onReady: () => {
                        this.isYtReady = true;
                        this.ytPlayer.setVolume(this.isMuted ? 0 : this.volume * 100);
                        this.notify();
                    },
                    onStateChange: (event: any) => {
                        // YT.PlayerState.ENDED = 0
                        if (event.data === 0) {
                            this.playlistNext();
                        }
                        // YT.PlayerState.PLAYING = 1
                        this.isPlaying = event.data === 1;
                        this.notify();
                    }
                }
            });
        };
    }

    // --- Listener system ---
    subscribe(listener: AudioStateListener): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notify() {
        this.listeners.forEach(l => l());
    }

    // --- Getters ---
    getIsPlaying(): boolean {
        return this.isPlaying;
    }

    getCurrentTrack(): TrackInfo {
        const track = this.playlist[this.playlistIndex];
        return { 
            youtubeId: track.id, 
            displayName: track.title, 
            index: this.playlistIndex 
        };
    }

    getPlaylist(): TrackInfo[] {
        return this.playlist.map((track, index) => ({
            youtubeId: track.id,
            displayName: track.title,
            index
        }));
    }

    getVolume(): number { return this.volume; }
    getIsMuted(): boolean { return this.isMuted; }

    setBgmEnabled(enabled: boolean) {
        this.bgmEnabled = enabled;
        if (!enabled) this.pause();
        this.notify();
    }

    // --- Playback controls ---
    playPlaylist(index?: number) {
        if (!this.isYtReady || !this.ytPlayer) return;

        if (index !== undefined) {
            this.playlistIndex = index % this.playlist.length;
        }

        const track = this.playlist[this.playlistIndex];
        this.ytPlayer.loadVideoById(track.id);
        this.isPlaying = true;
        this.notify();
    }

    playlistNext() {
        if (!this.bgmEnabled) {
            this.notify();
            return;
        }
        this.playlistIndex = (this.playlistIndex + 1) % this.playlist.length;
        this.playPlaylist();
    }

    playlistPrev() {
        this.playlistIndex = (this.playlistIndex - 1 + this.playlist.length) % this.playlist.length;
        this.playPlaylist();
    }

    playTrack(index: number) {
        this.playlistIndex = index % this.playlist.length;
        this.playPlaylist();
    }

    pause() {
        if (this.isYtReady && this.ytPlayer) {
            this.ytPlayer.pauseVideo();
        }
    }

    resume() {
        if (!this.bgmEnabled) return;
        if (this.isYtReady && this.ytPlayer) {
            this.ytPlayer.playVideo();
        } else if (!this.isPlaying) {
            this.playPlaylist();
        }
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.resume();
        }
    }

    playBGM(_type: BGMType) {
        if (!this.bgmEnabled) return;
        if (!this.isPlaying) {
            this.resume();
        }
    }

    setVolume(volume: number) {
        this.volume = volume;
        if (this.isYtReady && this.ytPlayer) {
            this.ytPlayer.setVolume(this.isMuted ? 0 : volume * 100);
        }
        this.notify();
    }

    setMute(mute: boolean) {
        this.isMuted = mute;
        if (this.isYtReady && this.ytPlayer) {
            this.ytPlayer.setVolume(mute ? 0 : this.volume * 100);
        }
        this.notify();
    }


    playSfx(key: SfxKey, volumeScale: number = 1.0) {
        // 효과음 기능이 비활성화된 경우 재생하지 않음
        if (!this.sfxEnabled) return;
        const definition = sfxRegistry[key];
        if (!definition || (definition.srcs.length === 0 && !definition.layers?.length)) return;

        const now = Date.now();
        const cooldownUntil = this.sfxCooldowns.get(key) ?? 0;
        if (definition.cooldownMs && now < cooldownUntil) return;
        if (definition.cooldownMs) {
            this.sfxCooldowns.set(key, now + definition.cooldownMs);
        }

        if (definition.interrupt) {
            this.activeInterruptingSfx.get(key)?.forEach(sfx => sfx.stop());
            this.activeInterruptingSfx.delete(key);
        }

        const activeSet = definition.interrupt ? new Set<Howl>() : undefined;
        if (activeSet) {
            this.activeInterruptingSfx.set(key, activeSet);
        }

        const playSource = (src: string, layerVolume: number) => {
            const sfx = new Howl({
                src: [src],
                volume: this.isMuted ? 0 : (this.volume * definition.volume * layerVolume * volumeScale),
                onend: () => {
                    activeSet?.delete(sfx);
                    sfx.unload();
                },
                onstop: () => {
                    activeSet?.delete(sfx);
                    sfx.unload();
                }
            });

            activeSet?.add(sfx);
            sfx.play();
        };

        const playRandomFrom = (srcs: string[], layerVolume: number = 1.0, delayMs: number = 0) => {
            if (srcs.length === 0) return;

            const src = srcs[Math.floor(Math.random() * srcs.length)];
            if (delayMs > 0) {
                window.setTimeout(() => playSource(src, layerVolume), delayMs);
                return;
            }

            playSource(src, layerVolume);
        };

        if (definition.layers?.length) {
            definition.layers.forEach(layer => {
                playRandomFrom(layer.srcs, layer.volume ?? 1.0, layer.delayMs ?? 0);
            });
            return;
        }

        playRandomFrom(definition.srcs);
    }

    playSFX(src: string, volumeScale: number = 1.0) {
        // 효과음 기능이 비활성화된 경우 재생하지 않음
        if (!this.sfxEnabled) return;
        const sfx = new Howl({
            src: [src],
            volume: this.isMuted ? 0 : (this.volume * volumeScale),
            onend: () => sfx.unload()
        });
        sfx.play();
    }
}

export const audioManager = new AudioManager();
