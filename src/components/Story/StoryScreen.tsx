import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CutsceneFrame, DialogueChoice } from '../../data/cutscenes/cutsceneData';
import './StoryScreen.css';
import StarField from '../common/Background/StarField';
import { useAudioStore } from '../../hooks/useAudioStore';
import DialogueBox from '../common/DialogueBox/DialogueBox';
import DialogueChoices from './DialogueChoices';

interface Dialogue {
    name: string;
    text: string;
    choices?: DialogueChoice[];
}

interface StoryScreenProps {
    onComplete: (result?: { value?: string; tags?: string[] }) => void;
    frames: CutsceneFrame[];
}

interface FlattenedDialogue extends Dialogue {
    backgroundImage: string;
}

const MotionDialogueBox = motion(DialogueBox);

const StoryScreen: React.FC<StoryScreenProps> = ({ onComplete, frames }) => {
    const dialogues = frames.flatMap((frame) =>
        frame.dialogues.map((dialogue) => ({
            ...dialogue,
            backgroundImage: frame.backgroundImage
        }))
    );
    const [step, setStep] = useState(0);
    const [isExiting, setIsExiting] = useState(false);
    const [isShowing, setIsShowing] = useState(false);
    // 스토리 전체에서 선택된 태그/값 누적
    const [collectedTags, setCollectedTags] = useState<string[]>([]);
    const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);

    const playSfx = useAudioStore(state => state.playSfx);
    const currentDialogue = (dialogues[step] || dialogues[0]) as FlattenedDialogue | undefined;
    const hasChoices = !!(currentDialogue?.choices && currentDialogue.choices.length > 0);

    useEffect(() => {
        const timer = setTimeout(() => setIsShowing(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const finishStory = (tags: string[], value?: string) => {
        playSfx('transition');
        setIsExiting(true);
        setTimeout(() => {
            const result = (tags.length > 0 || value !== undefined)
                ? { value, tags: tags.length > 0 ? tags : undefined }
                : undefined;
            onComplete(result);
        }, 1200);
    };

    const handleNext = () => {
        if (step < dialogues.length - 1) {
            playSfx('storyNext');
            setStep(prev => prev + 1);
        } else {
            finishStory(collectedTags, selectedValue);
        }
    };

    const handleChoiceSelect = (choice: DialogueChoice) => {
        playSfx('storyNext');
        // 태그 누적
        const newTags = choice.tags && choice.tags.length > 0
            ? [...collectedTags, ...choice.tags]
            : collectedTags;
        if (choice.tags && choice.tags.length > 0) {
            setCollectedTags(newTags);
        }
        // value 저장
        const newValue = choice.value !== undefined ? choice.value : selectedValue;
        if (choice.value !== undefined) {
            setSelectedValue(newValue);
        }

        // skipToEnd가 true면 다음 스텝 없이 즉시 종료
        if (choice.skipToEnd) {
            finishStory(newTags, newValue);
            return;
        }

        // 다음 스텝으로 이동
        if (step < dialogues.length - 1) {
            setStep(prev => prev + 1);
        } else {
            finishStory(newTags, newValue);
        }
    };

    const handleSkip = (e: React.MouseEvent) => {
        e.stopPropagation();
        playSfx('storySkip');
        finishStory(collectedTags, selectedValue);
    };

    if (!currentDialogue) {
        return null;
    }

    return (
        <div className={`story-container ${isShowing ? 'visible' : ''} ${isExiting ? 'exit' : ''}`}>
            <StarField />
            {/* Background Layer */}
            <div className="story-background-wrapper">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentDialogue.backgroundImage}
                        className="story-background"
                        style={{ backgroundImage: `url('${currentDialogue.backgroundImage}')` }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.55, ease: "easeOut" }}
                    />
                </AnimatePresence>
                <div className="story-vignette" />
            </div>
            
            {/* Dialogue UI Layer */}
            <div className="story-ui">
                {/* 선택지가 있을 때만 DialogueChoices 표시 */}
                <AnimatePresence mode="wait">
                    {hasChoices && (
                        <DialogueChoices
                            key={`choices-${step}`}
                            choices={currentDialogue.choices!}
                            onSelect={handleChoiceSelect}
                            delay={0.2}
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    <MotionDialogueBox 
                        key={step}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="story-dialogue-box"
                        onClick={hasChoices ? undefined : handleNext}
                        name={currentDialogue.name}
                        text={currentDialogue.text}
                        hasIndicator={!hasChoices}
                        glow={false}
                    />
                </AnimatePresence>
            </div>

            {/* Click to skip/proceed area (선택지가 없을 때만 활성화) */}
            {!isExiting && !hasChoices && <div className="story-click-overlay" onClick={handleNext} />}

            {/* Skip Button */}
            {!isExiting && (
                <button className="story-skip-btn" onClick={handleSkip}>
                    SKIP
                </button>
            )}
        </div>
    );
};

export default StoryScreen;
