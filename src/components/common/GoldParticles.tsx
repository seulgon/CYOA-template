import React, { useEffect, useMemo, useState } from 'react';
import './GoldParticles.css';
import {
    MOBILE_OPTIMIZATION_QUERY,
    shouldUseMobileOptimization,
    subscribeToMobileOptimization,
} from '../../utils/mobileOptimization';

interface GoldParticlesProps {
    count?: number;
    intensity?: 'low' | 'medium' | 'high';
}

const GoldParticles: React.FC<GoldParticlesProps> = ({ count = 45, intensity = 'medium' }) => {
    const [disableParticles, setDisableParticles] = useState(shouldUseMobileOptimization);

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
            return;
        }

        const mediaQuery = window.matchMedia(MOBILE_OPTIMIZATION_QUERY);
        const updateParticleMode = () => setDisableParticles(shouldUseMobileOptimization());

        updateParticleMode();
        mediaQuery.addEventListener('change', updateParticleMode);
        const unsubscribeOptimization = subscribeToMobileOptimization(updateParticleMode);

        return () => {
            mediaQuery.removeEventListener('change', updateParticleMode);
            unsubscribeOptimization();
        };
    }, []);

    const particles = useMemo(() => {
        if (disableParticles) {
            return [];
        }

        return Array.from({ length: count }).map((_, i) => {
            // 빈 공간(캐릭터 양옆)에 입자를 집중 배치하기 위해
            // 0~35% (좌측) 또는 65~100% (우측) 영역에 주로 분포
            const isLeft = Math.random() > 0.5;
            
            // 약간의 중앙 침범도 허용하여 자연스럽게 연출 (15% 확률로 중앙)
            let x;
            if (Math.random() > 0.85) {
                x = Math.random() * 100;
            } else {
                x = isLeft ? Math.random() * 32 : 68 + Math.random() * 32;
            }
            
            const y = Math.random() * 100;
            const size = Math.random() * 3.5 + 1.5; // 1.5px to 5px
            const delay = Math.random() * 6; // 0s to 6s delay
            const duration = Math.random() * 4 + 3; // 3s to 7s duration

            return (
                <div
                    key={i}
                    className="gold-particle"
                    style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        animationDelay: `${delay}s`,
                        animationDuration: `${duration}s`,
                        opacity: 0,
                    }}
                />
            );
        });
    }, [count, disableParticles]);

    if (disableParticles) {
        return null;
    }

    return (
        <div className={`gold-particles-container intensity-${intensity}`} aria-hidden="true">
            {particles}
        </div>
    );
};

export default GoldParticles;
