import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CircleHelp, X } from 'lucide-react';
import './Intro.css';
import { hasSavedCharacter, importCharacter } from '../../utils/saveUtils';
import type { SaveData } from '../../utils/saveUtils';
import Background from '../common/Background/Background';
import { useAudioStore } from '../../hooks/useAudioStore';
import {
    getMobileOptimizationEnabled,
    isMobileLikeDevice,
    MOBILE_OPTIMIZATION_QUERY,
    setMobileOptimizationEnabled,
} from '../../utils/mobileOptimization';

interface IntroProps {
    onStart: () => void;
    onLoad?: () => void;
    onImport?: (data: SaveData) => void;
    onDevNavigate?: (phase: string) => void;
}

const devDestinations = [
    { phase: 'INTRO_STORY', label: '인트로 스토리' },
    { phase: 'WORLD_SETUP', label: '월드 셋업' },
    { phase: 'CYOA_STORY', label: 'CYOA 스토리' },
    { phase: 'CYOA_BUILD', label: 'CYOA 선택' },
    { phase: 'REWARD_SELECT', label: '보상선택' },
    { phase: 'CHARACTER_SHEET', label: '캐릭터 시트' },
    { phase: 'LOCATION_CUTSCENE', label: '지역 컷신' },
];

const Intro: React.FC<IntroProps> = ({ onStart, onLoad, onImport, onDevNavigate }) => {
    const [showContent, setShowContent] = useState(false);
    const [hasSave, setHasSave] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const [isDevVisible, setIsDevVisible] = useState(false);
    const [isDevOpen, setIsDevOpen] = useState(false);
    const [isMobileOptimizationEnabled, setIsMobileOptimizationEnabled] = useState(getMobileOptimizationEnabled);
    const [showMobileOptimizationToggle, setShowMobileOptimizationToggle] = useState(isMobileLikeDevice);
    const [isMobileOptimizationInfoOpen, setIsMobileOptimizationInfoOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const playBGM = useAudioStore(state => state.playBGM);

    const handleAction = (action: () => void) => {
        playBGM('intro');
        setIsExiting(true);
        setTimeout(() => {
            action();
        }, 1500); // Match animation duration
    };

    const handleStart = () => handleAction(onStart);
    const handleLoad = () => onLoad && handleAction(onLoad);

    const handleMobileOptimizationToggle = () => {
        setIsMobileOptimizationEnabled(enabled => {
            const nextEnabled = !enabled;
            setMobileOptimizationEnabled(nextEnabled);
            return nextEnabled;
        });
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const data = await importCharacter(file);
            if (onImport) {
                handleAction(() => onImport(data));
            }
        } catch (error) {
            alert('파일을 불러오는데 실패했습니다.');
            console.error(error);
        }
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 500);
        // eslint-disable-next-line
        setHasSave(hasSavedCharacter());
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'F4') return;
            event.preventDefault();
            setIsDevVisible(visible => {
                const nextVisible = !visible;
                if (!nextVisible) setIsDevOpen(false);
                return nextVisible;
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
            return;
        }

        const mediaQuery = window.matchMedia(MOBILE_OPTIMIZATION_QUERY);
        const updateToggleVisibility = () => setShowMobileOptimizationToggle(isMobileLikeDevice());

        updateToggleVisibility();
        mediaQuery.addEventListener('change', updateToggleVisibility);

        return () => mediaQuery.removeEventListener('change', updateToggleVisibility);
    }, []);

    return (
        <div className={`intro-overlay ${isExiting ? 'exiting' : ''}`}>
            <Background showStars={false} />

            <div className="intro-curtain-closed" aria-hidden="true">
                <div className="intro-curtain-closed-panel intro-curtain-closed-panel-left" />
                <div className="intro-curtain-closed-panel intro-curtain-closed-panel-right" />
                <div className="intro-curtain-closed-seam" />
            </div>

            <div className={`intro-content ${showContent ? 'fade-in' : ''}`}>
                <div className="intro-title-container">
                    <h1 className="intro-title-sub">Authentic Fantasy CYOA</h1>
                    <h1 className="intro-title-main">정통 판타지 CYOA</h1>
                </div>

                <div className="intro-divider"></div>

                <p className="intro-description">
                    <span className="intro-emphasis">모종의 힘이 당신을 이세계로 인도합니다.</span><br />
                    <span className="intro-emphasis">수락하시겠습니까?</span>
                </p>

                <button className="intro-start-button primary" onClick={handleStart}>
                    <span className="button-text">수락하기</span>
                    <span className="button-glow"></span>
                </button>

                <div className="intro-secondary-actions">
                    {hasSave && onLoad && (
                        <button
                            className="intro-secondary-button continue"
                            onClick={handleLoad}
                        >
                            <span className="button-text">이어서 하기</span>
                        </button>
                    )}

                    {onImport && (
                        <>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept=".json"
                                onChange={handleFileChange}
                            />
                            <button
                                className="intro-secondary-button load"
                                onClick={handleImportClick}
                            >
                                <span className="button-text">불러오기</span>
                            </button>
                        </>
                    )}
                </div>

                {showMobileOptimizationToggle && (
                    <div
                        className={`intro-mobile-toggle ${isMobileOptimizationEnabled ? 'enabled' : 'disabled'}`}
                    >
                        <span className="intro-mobile-toggle-label">
                            <span className="intro-mobile-toggle-text">모바일 최적화</span>
                            <button
                                type="button"
                                className="intro-mobile-info-button"
                                aria-label="모바일 최적화 설명 보기"
                                onClick={() => setIsMobileOptimizationInfoOpen(true)}
                            >
                                <CircleHelp size={16} strokeWidth={2.2} />
                            </button>
                        </span>
                        <button
                            type="button"
                            className="intro-mobile-toggle-control"
                            aria-pressed={isMobileOptimizationEnabled}
                            onClick={handleMobileOptimizationToggle}
                        >
                            <span className="intro-mobile-toggle-switch" aria-hidden="true">
                                <span className="intro-mobile-toggle-knob" />
                            </span>
                            <span className="intro-mobile-toggle-status">
                                {isMobileOptimizationEnabled ? '켜짐' : '꺼짐'}
                            </span>
                        </button>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isMobileOptimizationInfoOpen && (
                    <motion.div
                        className="intro-mobile-info-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.16, ease: 'easeOut' }}
                        onClick={() => setIsMobileOptimizationInfoOpen(false)}
                    >
                        <motion.div
                            className="intro-mobile-info-modal"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="intro-mobile-info-title"
                            initial={{ opacity: 0, y: 12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            onClick={event => event.stopPropagation()}
                        >
                            <button
                                type="button"
                                className="intro-mobile-info-close"
                                aria-label="설명 닫기"
                                onClick={() => setIsMobileOptimizationInfoOpen(false)}
                            >
                                <X size={18} strokeWidth={2.2} />
                            </button>
                            <h2 id="intro-mobile-info-title">모바일 최적화</h2>
                            <p>
                                모바일에서 무거운 연출을 줄여 화면 전환과 카드 선택이 더 가볍게 동작하도록 합니다.
                            </p>
                            <ul>
                                <li>카드 등장 연출을 단순한 2D 애니메이션으로 바꿉니다.</li>
                                <li>배경의 금빛 파티클을 끕니다.</li>
                                <li>이미지는 현재 단계에 필요한 것부터 불러오고, 카드 화면에서는 나머지 이미지도 천천히 준비합니다.</li>
                            </ul>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isExiting && (
                    <div className="intro-curtain" aria-hidden="true">
                        <motion.div
                            className="intro-curtain-panel intro-curtain-panel-left"
                            initial={{ x: '0%' }}
                            animate={{ x: '-102%' }}
                            transition={{ duration: 1.15, ease: [0.7, 0, 0.3, 1] }}
                        />
                        <motion.div
                            className="intro-curtain-panel intro-curtain-panel-right"
                            initial={{ x: '0%' }}
                            animate={{ x: '102%' }}
                            transition={{ duration: 1.15, ease: [0.7, 0, 0.3, 1] }}
                        />
                        <motion.div
                            className="intro-curtain-seam-glow"
                            initial={{ opacity: 0.7, scaleY: 0.92 }}
                            animate={{ opacity: 0, scaleY: 1.08 }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                        />
                    </div>
                )}
            </AnimatePresence>

            {onDevNavigate && isDevVisible && (
                <div className="intro-dev-mode">
                    <AnimatePresence>
                        {isDevOpen && (
                            <motion.div
                                className="intro-dev-panel"
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                transition={{ duration: 0.18, ease: 'easeOut' }}
                            >
                                {devDestinations.map(destination => (
                                    <button
                                        key={destination.phase}
                                        type="button"
                                        className="intro-dev-link"
                                        onClick={() => onDevNavigate(destination.phase)}
                                    >
                                        {destination.label}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="button"
                        className="intro-dev-toggle"
                        onClick={() => setIsDevOpen(open => !open)}
                    >
                        개발자 모드
                    </button>
                </div>
            )}
            
            {/* Background handles vignette and particles too, but Intro.css might have specific styles. 
                Let's keep Intro specific styles if needed, but Background component already has them.
                If Intro.css defined .vignette and .particles, they might conflict or double up.
                Checking Intro.css... (I haven't viewed it, but Intro.tsx used them).
                Background.tsx has .background-vignette and .background-particles.
                Intro.tsx had .vignette and .particles. 
                So using Background component is cleaner. Removing manual divs.
            */}
        </div>
    );
};

export default Intro;
