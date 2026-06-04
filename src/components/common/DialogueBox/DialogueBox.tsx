import React from 'react';
import { motion } from 'framer-motion';
import './DialogueBox.css';

interface DialogueBoxProps {
    name: string;
    text: string;
    requirements?: string | null;
    hasIndicator?: boolean;
    onClick?: (e: React.MouseEvent) => void;
    glow?: boolean;
    borderWidth?: string;
    className?: string;
    style?: React.CSSProperties;
}

// Framer motion의 애니메이션 및 ref 연동을 위해 forwardRef 적용
export const DialogueBox = React.forwardRef<HTMLDivElement, DialogueBoxProps>(({
    name,
    text,
    requirements = null,
    hasIndicator = false,
    onClick,
    glow = true,
    borderWidth = '2px',
    className = '',
    style = {}
}, ref) => {
    const boxClassName = `common-dialogue-box ${glow ? 'has-glow' : ''} ${className}`.trim();

    return (
        <div
            ref={ref}
            className={boxClassName}
            onClick={onClick}
            style={{
                borderWidth: borderWidth,
                ...style
            }}
        >
            <div className="dialogue-box-copy">
                <div className="dialogue-box-header">
                    <span className="dialogue-box-name">{name}</span>
                    <div className="dialogue-box-name-underline"></div>
                </div>
                {requirements ? (
                    <div className="dialogue-box-content">
                        <span className="dialogue-box-requirements">{requirements}</span>
                    </div>
                ) : (
                    <div className="dialogue-box-content">
                        <p className="dialogue-box-text" onClick={(e) => e.stopPropagation()}>
                            {text}
                        </p>
                    </div>
                )}
            </div>

            {hasIndicator && (
                <motion.div 
                    className="dialogue-box-indicator"
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    ▼
                </motion.div>
            )}
        </div>
    );
});

DialogueBox.displayName = 'DialogueBox';

export default DialogueBox;
