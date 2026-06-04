import React from 'react';
import { motion } from 'framer-motion';
import {
    MOBILE_OPTIMIZATION_QUERY,
    shouldUseMobileOptimization,
    subscribeToMobileOptimization,
} from '../../utils/mobileOptimization';

interface Card3DWrapperProps {
    children: [React.ReactNode, React.ReactNode]; // [Front, Back]
    index: number;
    observerBlocked: boolean;
    onClick?: () => void;
    isListView?: boolean;
    isCondensed?: boolean;
    dealFrom?: 'default' | 'top';
}

const Card3DWrapper: React.FC<Card3DWrapperProps> = ({ 
    children, index, observerBlocked, onClick, isListView, isCondensed, dealFrom = 'default'
}) => {
    const [front, back] = children;
    const [hasAnimated, setHasAnimated] = React.useState(false);
    const [useMobileAnimation, setUseMobileAnimation] = React.useState(shouldUseMobileOptimization);

    React.useEffect(() => {
        if (observerBlocked) return;
        setHasAnimated(true);
    }, [observerBlocked]);

    React.useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
            return;
        }

        const mediaQuery = window.matchMedia(MOBILE_OPTIMIZATION_QUERY);
        const updateAnimationMode = () => setUseMobileAnimation(shouldUseMobileOptimization());

        updateAnimationMode();
        mediaQuery.addEventListener('change', updateAnimationMode);
        const unsubscribeOptimization = subscribeToMobileOptimization(updateAnimationMode);

        return () => {
            mediaQuery.removeEventListener('change', updateAnimationMode);
            unsubscribeOptimization();
        };
    }, []);

    const flyInDelay = index * 0.08;
    const flipStartDelay = flyInDelay + 0.5;
    const flyInInitial = dealFrom === 'top'
        ? {
            opacity: 0,
            y: -260,
            x: (index % 4 - 1.5) * 28,
            rotateZ: -8 + (index % 5) * 4,
            scale: 0.52
        }
        : {
            opacity: 0,
            y: 300,
            x: -100,
            rotateZ: -10,
            scale: 0.5
        };

    if (useMobileAnimation) {
        const slideDelay = Math.min(index * 0.025, 0.18);

        return (
            <div
                className="card-container card-container-2d"
                style={{
                    position: 'relative',
                    width: '100%',
                    marginTop: isListView ? '0.2rem' : (isCondensed ? '0.5rem' : '1rem'),
                    perspective: 'none'
                }}
            >
                <motion.div
                    className="card-motion-wrapper card-motion-wrapper-2d"
                    onClick={onClick}
                    initial={{ opacity: 0, y: 16 }}
                    animate={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                    transition={{
                        duration: 0.22,
                        delay: slideDelay,
                        ease: 'easeOut'
                    }}
                    style={{
                        width: '100%',
                        position: 'relative',
                        transformStyle: 'flat',
                        willChange: 'opacity, transform'
                    }}
                >
                    {front}
                </motion.div>
            </div>
        );
    }

    return (
        <div
            className="card-container"
            style={{
                position: 'relative',
                width: '100%',
                marginTop: isListView ? '0.2rem' : (isCondensed ? '0.5rem' : '1rem'),
                perspective: '1000px'
            }}
        >
            {/* Phase 1: 비행 (위치, 크기, 투명도, 회전Z) */}
            <motion.div
                initial={flyInInitial}
                animate={hasAnimated ? { 
                    opacity: 1, 
                    y: 0,         
                    x: 0, 
                    rotateZ: 0, 
                    scale: 1 
                } : { 
                    ...flyInInitial
                }}
                transition={{ 
                    duration: 0.6, 
                    delay: flyInDelay, 
                    type: 'spring', 
                    stiffness: 120, 
                    damping: 14 
                }}
            >
                {/* Phase 2: 뒤집기 (rotateY만 담당) */}
                <motion.div
                    className="card-motion-wrapper"
                    onClick={onClick}
                    initial={{ rotateY: 180 }}
                    animate={hasAnimated ? { rotateY: 0 } : { rotateY: 180 }}
                    transition={{ 
                        delay: flipStartDelay, 
                        type: 'spring', 
                        stiffness: 80, 
                        damping: 12 
                    }}
                    style={{
                        width: '100%',
                        position: 'relative',
                        transformStyle: 'preserve-3d'
                    }}
                >
                    {front}
                    {back}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Card3DWrapper;
