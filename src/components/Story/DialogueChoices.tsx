import React from 'react';
import { motion } from 'framer-motion';
import type { DialogueChoice } from '../../data/cutscenes/cutsceneData';
import './DialogueChoices.css';

interface DialogueChoicesProps {
    choices: DialogueChoice[];
    onSelect: (choice: DialogueChoice) => void;
    delay?: number; // 컨테이너 등장 딜레이(초), 기본값 0
}

const item = {
    hidden: { opacity: 0, y: 18 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.38, ease: 'easeOut' as const } },
};

const DialogueChoices: React.FC<DialogueChoicesProps> = ({ choices, onSelect, delay = 0 }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                delay,
                staggerChildren: 0.09,
                delayChildren: delay + 0.06,
            },
        },
    };

    return (
        <motion.div
            className="dialogue-choices-container"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            {choices.map((choice, index) => (
                <motion.button
                    key={index}
                    className="dialogue-choice-btn"
                    variants={item}
                    onClick={() => onSelect(choice)}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                >
                    <span className="dialogue-choice-arrow">▶</span>
                    <span className="dialogue-choice-label">{choice.label}</span>
                    {choice.tags && choice.tags.length > 0 && (
                        <span className="dialogue-choice-tags">
                            {choice.tags.map(tag => (
                                <span key={tag} className="dialogue-choice-tag">{tag}</span>
                            ))}
                        </span>
                    )}
                </motion.button>
            ))}
        </motion.div>
    );
};

export default DialogueChoices;
