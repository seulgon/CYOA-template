import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './NarratorSelect.css';
import GoldParticles from '../common/GoldParticles';
import { gameImagePreloader } from '../../utils/imagePreloader';

interface NarratorChoice {
    id: string;
    name: string;
    description: string;
    image: string;
}

const NARRATORS: NarratorChoice[] = [
    {
        id: "angel",
        name: "천사",
        description: "빛과 정의를 대변하는 천상계의 존재. 숭고하고 영광스러운 길로 당신을 이끕니다.",
        image: "./assets/images/narrators/angel/angel.webp"
    },
    {
        id: "demon",
        name: "악마",
        description: "심연 and 탐욕의 화신인 마계의 군주. 달콤한 파멸과 강력한 힘의 계약을 제안합니다.",
        image: "./assets/images/narrators/demon/demon.webp"
    },
    {
        id: "mountain_spirit",
        name: "산신령",
        description: "이 땅을 조용히 수호해 온 유구한 정령. 온화하고 지혜로운 충고로 갈 길을 일깨워 줍니다.",
        image: "./assets/images/narrators/mountain_spirit/mountain_spirit.webp"
    },
    {
        id: "vengeful_spirit",
        name: "원령",
        description: "깊은 원한과 미련으로 뭉쳐진 고독한 혼백. 뒤틀린 인과와 피의 복수를 속삭입니다.",
        image: "./assets/images/narrators/vengeful_spirit/vengeful_spirit.webp"
    },
    {
        id: "ai_avatar",
        name: "초지능 AI",
        description: "시공간의 잔재로 이루어진 인공지능 아바타. 냉철하고 객관적인 시선으로 당신의 여정을 기록합니다.",
        image: "./assets/images/narrators/ai_avatar/ai_avatar.webp"
    }
];

interface NarratorSelectProps {
    onComplete: (narratorId: string) => void;
    onBack: () => void;
    initialNarrator?: string;
}

const NarratorSelect: React.FC<NarratorSelectProps> = ({ onComplete, onBack, initialNarrator }) => {
    const [selectedId, setSelectedId] = useState<string | null>(initialNarrator || null);

    useEffect(() => {
        const urls = NARRATORS.map(n => n.image);
        gameImagePreloader.enqueue(urls, { priority: true });
    }, []);

    const handleSelect = (id: string) => {
        setSelectedId(id);
    };

    const handleDoubleClick = (id: string) => {
        setSelectedId(id);
        onComplete(id);
    };

    const handleComplete = () => {
        if (selectedId) {
            onComplete(selectedId);
        }
    };

    return (
        <div className="narrator-select-overlay">
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
                        {NARRATORS.map(narrator => {
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
                                            src={narrator.image}
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
