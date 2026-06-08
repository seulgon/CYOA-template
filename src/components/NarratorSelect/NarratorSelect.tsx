import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './NarratorSelect.css';
import GoldParticles from '../common/GoldParticles';
import { gameImagePreloader } from '../../utils/imagePreloader';
import { getNarratorThemeVariables, NARRATOR_PROFILES, type NarratorId } from '../../data/narrators';

interface NarratorSelectProps {
    onComplete: (narratorId: NarratorId) => void;
    onBack: () => void;
    initialNarrator?: string | null;
}

const NarratorSelect: React.FC<NarratorSelectProps> = ({ onComplete, onBack, initialNarrator }) => {
    const [selectedId, setSelectedId] = useState<string | null>(initialNarrator || null);

    useEffect(() => {
        const urls = NARRATOR_PROFILES.map(n => n.portraitImage);
        gameImagePreloader.enqueue(urls, { priority: true });
    }, []);

    const handleSelect = (id: NarratorId) => {
        setSelectedId(id);
    };

    const handleDoubleClick = (id: NarratorId) => {
        setSelectedId(id);
        onComplete(id);
    };

    const handleComplete = () => {
        if (selectedId) {
            onComplete(selectedId as NarratorId);
        }
    };

    return (
        <div
            className="narrator-select-overlay"
            style={selectedId ? getNarratorThemeVariables(selectedId) as React.CSSProperties : undefined}
        >
            <div className="narrator-select-scene-frame">
                <div className="narrator-select-stage" aria-hidden="true">
                    <img
                        className="narrator-select-stage-bg"
                        src="./assets/images/backgrounds/timeline_map_clock_room_4k.webp"
                        alt=""
                    />
                </div>
                <div className="narrator-select-scene-shade" aria-hidden="true" />
                <GoldParticles count={45} intensity="medium" />

                <header className="narrator-select-header-zone">
                    <h2 className="narrator-select-title-main">나레이터 선택</h2>
                    <p className="narrator-select-title-sub">당신의 이야기를 서술할 보이지 않는 눈을 선택하세요.</p>
                </header>

                <main className="narrator-select-card-table">
                    <motion.div
                        className="narrator-select-grid"
                        initial="hidden"
                        animate="show"
                        variants={{
                            hidden: {},
                            show: {
                                transition: {
                                    staggerChildren: 0.06,
                                    delayChildren: 0.05,
                                },
                            },
                        }}
                    >
                        {NARRATOR_PROFILES.map(narrator => {
                            const isSelected = selectedId === narrator.id;

                            return (
                                <motion.div
                                    key={narrator.id}
                                    className={`narrator-choice-item ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleSelect(narrator.id)}
                                    onDoubleClick={() => handleDoubleClick(narrator.id)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault();
                                            handleSelect(narrator.id);
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    aria-selected={isSelected}
                                    variants={{
                                        hidden: { opacity: 0, y: -30, scale: 0.97 },
                                        show: { opacity: 1, y: 0, scale: 1 },
                                    }}
                                    transition={{ duration: 0.35, ease: 'easeOut' }}
                                >
                                    <div className="narrator-image-container">
                                        <img
                                            src={narrator.portraitImage}
                                            alt={narrator.name}
                                            className="narrator-image"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </div>
                                    <div className="narrator-header">
                                        <h3 className="narrator-name">{narrator.name}</h3>
                                    </div>
                                    <p className="narrator-description">{narrator.description}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </main>

                <footer className="narrator-select-footer">
                    <button className="narrator-nav-button back" onClick={onBack}>
                        <ArrowLeft size={18} />
                        <span>이전</span>
                    </button>
                    <div className="narrator-select-footer-progress">
                        <div className="narrator-select-section-label">
                            <span>나레이터</span>
                            <strong>선택 완료</strong>
                        </div>
                    </div>
                    <button
                        className="narrator-nav-button next"
                        onClick={handleComplete}
                        disabled={!selectedId}
                    >
                        <span>완료</span>
                        <ArrowRight size={18} />
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default NarratorSelect;
