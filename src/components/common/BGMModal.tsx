import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, SkipBack, SkipForward, Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import { useAudioStore, useAudioLiveState } from '../../hooks/useAudioStore';
import './BGMModal.css';

interface BGMModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const BGMModal: React.FC<BGMModalProps> = ({ isOpen, onClose }) => {
    const { volume, isMuted, setVolume, toggleMute, nextTrack, prevTrack, playTrack, togglePlay } = useAudioStore();
    const { isPlaying, currentTrack, playlist } = useAudioLiveState();
    const trackListRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to current track in list
    useEffect(() => {
        if (isOpen && trackListRef.current) {
            const activeEl = trackListRef.current.querySelector('.bgm-track-item.active');
            if (activeEl) {
                activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }, [isOpen, currentTrack.index]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="bgm-modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Center Overlay Container */}
                    <div className="bgm-modal-overlay">
                        {/* Modal */}
                        <motion.div
                            className="bgm-modal"
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        >
                        {/* Header */}
                        <div className="bgm-modal-header">
                            <div className="bgm-modal-title">
                                <Music size={16} className="bgm-modal-title-icon" />
                                <span>배경음악</span>
                            </div>
                            <button className="bgm-close-btn" onClick={onClose} title="닫기">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Now Playing */}
                        <div className="bgm-now-playing">
                            <div className="bgm-vinyl" data-playing={isPlaying}>
                                <div className="bgm-vinyl-inner" />
                            </div>
                            <div className="bgm-now-playing-info">
                                <div className="bgm-now-playing-label">NOW PLAYING</div>
                                <div className="bgm-now-playing-title">{currentTrack.displayName}</div>
                                <div className="bgm-now-playing-sub">
                                    {currentTrack.index + 1} / {playlist.length}
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="bgm-controls">
                            <button className="bgm-ctrl-btn" onClick={() => { prevTrack(); }} title="이전 곡">
                                <SkipBack size={20} />
                            </button>
                            <button className="bgm-ctrl-btn primary" onClick={() => { togglePlay(); }} title={isPlaying ? '일시정지' : '재생'}>
                                {isPlaying ? <Pause size={22} /> : <Play size={22} />}
                            </button>
                            <button className="bgm-ctrl-btn" onClick={() => { nextTrack(); }} title="다음 곡">
                                <SkipForward size={20} />
                            </button>
                        </div>

                        {/* Volume */}
                        <div className="bgm-volume-row">
                            <button className="bgm-mute-btn" onClick={() => { toggleMute(); }} title={isMuted ? '음소거 해제' : '음소거'}>
                                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                            </button>
                            <input
                                className="bgm-volume-slider"
                                type="range"
                                min={0}
                                max={1}
                                step={0.01}
                                value={isMuted ? 0 : volume}
                                onChange={(e) => {
                                    const v = parseFloat(e.target.value);
                                    setVolume(v);
                                    if (isMuted && v > 0) {
                                        toggleMute();
                                    }
                                }}
                            />
                            <span className="bgm-volume-label">{Math.round((isMuted ? 0 : volume) * 100)}%</span>
                        </div>

                        {/* Track List */}
                        <div className="bgm-track-list" ref={trackListRef}>
                            {playlist.map((track) => (
                                <button
                                    key={track.index}
                                    className={`bgm-track-item ${track.index === currentTrack.index ? 'active' : ''}`}
                                    onClick={() => {
                                        playTrack(track.index);
                                    }}
                                    title={track.displayName}
                                >
                                    <span className="bgm-track-num">{String(track.index + 1).padStart(2, '0')}</span>
                                    <span className="bgm-track-name">{track.displayName}</span>
                                    {track.index === currentTrack.index && (
                                        <span className="bgm-track-playing-dot" data-playing={isPlaying} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </>
            )}
        </AnimatePresence>
    );
};

export default BGMModal;
