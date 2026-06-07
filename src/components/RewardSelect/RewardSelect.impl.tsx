import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './RewardSelect.css';
import TagTooltip from '../common/TagTooltip';
import ChoiceLightbox from '../CYOABuilder/ChoiceLightbox';
import GoldParticles from '../common/GoldParticles';
import { gameImagePreloader } from '../../utils/imagePreloader';

interface RewardChoice {
    id: string;
    name: string;
    description: string;
    bonusPoints?: number;
    tags?: string[];
    image?: string;
}

interface RewardSection {
    id: string;
    title: string;
    question: string;
    choices: RewardChoice[];
}

const rewardSelectData: RewardSection[] = [
    {
        id: "scenario",
        title: "시나리오",
        question: "이 단계는 다중 선택(Multi-select)이 가능하도록 구현된 UI 예시입니다. 아래에서 시나리오를 여러 개 선택하며 포인트 보너스를 테스트해 보세요.",
        choices: [
            { id: "scenario_nothing", name: "아무 일 없음", description: "추가적인 위기나 보너스가 없는 가장 기본적인 상태입니다. 템플릿의 기본 세팅을 점검하기 좋습니다.", image: "./assets/images/worldsetup/scenario_nothing.webp" },
            { id: "scenario_demon_king", name: "마왕 강림 임박", description: "다중 선택 카드를 누르면 포인트가 누적 가산됩니다. 선택 시 '+100P'가 추가되고, 태그가 실시간 반영됩니다.", bonusPoints: 100, image: "./assets/images/worldsetup/scenario_demon_king.webp", tags: ["마왕강림임박"] },
            { id: "scenario_emperor_death", name: "황제 사망", description: "여러 카드를 동시에 선택할 수 있으며, 이에 따라 상단에 추가되는 보너스 포인트 수치도 동적으로 합산됩니다.", bonusPoints: 100, image: "./assets/images/worldsetup/scenario_emperor_death.webp", tags: ["황제사망"] },
            { id: "scenario_academy_assassination", name: "아카데미 총장 암살", description: "각기 다른 가치의 보너스 포인트를 가진 시나리오들을 조합하여, 최종 캐릭터 시트에 어떻게 요약되는지 시험해 보세요.", bonusPoints: 200, image: "./assets/images/worldsetup/scenario_academy_assassination.webp", tags: ["총장암살사건"] }
        ]
    }
];

interface RewardSelectProps {
    onComplete: (data: { name: string; points: number; choices: string[]; tags: string[]; rawSelections: Record<string, string>; lastStep: number }) => void;
    initialData?: { name: string; selections: Record<string, string>; startStep: number };
}

const RewardSelect: React.FC<RewardSelectProps> = ({ onComplete, initialData }) => {
    const cardTableRef = useRef<HTMLElement>(null);
    const [selections, setSelections] = useState<Record<string, string>>(
        initialData?.selections ?? { scenario: 'scenario_nothing' }
    );
    const [dialogueText, setDialogueText] = useState<string | null>(null);
    const [lightboxChoice, setLightboxChoice] = useState<RewardChoice | null>(null);

    const currentStep = 0;
    const section = rewardSelectData[currentStep];
    const displayedDialogue = dialogueText ?? section.question;

    useEffect(() => {
        cardTableRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    }, []);

    useEffect(() => {
        const urls = section.choices
            .map(choice => choice.image)
            .filter((url): url is string => Boolean(url));

        gameImagePreloader.enqueue(urls, { priority: true });
    }, [section]);

    const handleSelect = (choiceId: string) => {
        const selectedChoice = section.choices.find(choice => choice.id === choiceId);
        const currentSelected = selections[section.id] ? selections[section.id].split(',') : [];
        const wasSelected = currentSelected.includes(choiceId);

        setDialogueText(wasSelected && choiceId !== 'scenario_nothing'
            ? null
            : selectedChoice?.description ?? null);

        let nextSelected: string[];
        if (choiceId === 'scenario_nothing') {
            nextSelected = ['scenario_nothing'];
        } else if (wasSelected) {
            nextSelected = currentSelected.filter(id => id !== choiceId);
            if (nextSelected.length === 0) nextSelected = ['scenario_nothing'];
        } else {
            nextSelected = [...currentSelected.filter(id => id !== 'scenario_nothing'), choiceId];
        }

        setSelections({
            ...selections,
            [section.id]: nextSelected.join(',')
        });
    };

    const handleComplete = () => {
        let totalBonus = 0;
        const allTags: string[] = [];
        const allChoices: string[] = [];

        const selectedIds = selections[section.id] ? selections[section.id].split(',') : [];
        selectedIds.forEach(selectedId => {
            const choice = section.choices.find(c => c.id === selectedId);
            if (!choice) return;

            totalBonus += choice.bonusPoints || 0;
            if (choice.tags) allTags.push(...choice.tags);
            allChoices.push(choice.id);
        });

        onComplete({
            name: initialData?.name ?? '쵸붕이',
            points: totalBonus,
            choices: allChoices,
            tags: allTags,
            rawSelections: selections,
            lastStep: currentStep
        });
    };

    return (
        <div className="world-setup-overlay">
            <ChoiceLightbox
                isOpen={!!lightboxChoice}
                onClose={() => setLightboxChoice(null)}
                image={lightboxChoice?.image}
                choiceId={lightboxChoice?.id ?? ''}
                choiceName={lightboxChoice?.name ?? ''}
            />

            <div className="world-setup-scene-frame">
                <div className="world-setup-stage" aria-hidden="true">
                    <img
                        className="world-setup-stage-bg"
                        src="./assets/images/backgrounds/reward_crystal_treasure_room_4k.webp"
                        alt=""
                    />
                    <img
                        className="world-setup-stage-narrator"
                        src="./assets/images/intro/violet_standing_dark_clear.png"
                        alt=""
                    />
                    <img
                        className="world-setup-stage-table"
                        src="./assets/images/stage/red_silk_table.png"
                        alt=""
                    />
                </div>
                <div className="world-setup-scene-shade" aria-hidden="true" />
                <GoldParticles count={55} intensity="high" />

                <section
                    ref={cardTableRef}
                    className="world-setup-card-table"
                    aria-label={`${section.title} 선택지`}
                >
                    <motion.div
                        key={`reward-select-dialogue-${displayedDialogue}`}
                        className="world-setup-dialogue-zone"
                        aria-label="보상 선택 대사"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                    >
                        <div className="world-setup-dialogue-copy">
                            <div className="world-setup-dialogue-header">
                                <span className="world-setup-dialogue-name">바이올렛</span>
                                <div className="world-setup-name-underline" />
                            </div>
                            <p>{displayedDialogue}</p>
                        </div>
                    </motion.div>

                    <motion.div
                        key={section.id}
                        className="world-setup-choice-grid"
                        initial="hidden"
                        animate="show"
                        variants={{
                            hidden: {},
                            show: {
                                transition: {
                                    staggerChildren: 0.05,
                                    delayChildren: 0.06,
                                },
                            },
                        }}
                    >
                        {section.choices.map(choice => {
                            const currentSelected = selections[section.id] ? selections[section.id].split(',') : [];
                            const isSelected = currentSelected.includes(choice.id);

                            return (
                                <motion.div
                                    key={choice.id}
                                    className={`choice-item ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleSelect(choice.id)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault();
                                            handleSelect(choice.id);
                                        }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    variants={{
                                        hidden: { opacity: 0, y: -42, scale: 0.96 },
                                        show: { opacity: 1, y: 0, scale: 1 },
                                    }}
                                    transition={{ duration: 0.42, ease: 'easeOut' }}
                                >
                                    {choice.image && (
                                        <div className="choice-image-container">
                                            <img src={choice.image} alt={choice.name} className="choice-image" loading="lazy" decoding="async" />
                                            <button
                                                type="button"
                                                className="world-setup-image-expand"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    setLightboxChoice(choice);
                                                }}
                                                aria-label={`${choice.name} 이미지 크게 보기`}
                                                title="크게 보기"
                                            >
                                                <span>+</span>
                                            </button>
                                        </div>
                                    )}
                                    <div className="choice-header">
                                        <h3 className="choice-name">{choice.name}</h3>
                                        {choice.bonusPoints && <span className="choice-bonus">+{choice.bonusPoints}P</span>}
                                    </div>
                                    <p className="choice-description">{choice.description}</p>

                                    {choice.tags && (
                                        <div className="choice-tags">
                                            {choice.tags.map(tag => <TagTooltip key={tag} tag={tag} />)}
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </section>

                <footer className="world-setup-footer">
                    <button className="nav-button back" disabled>
                        <ArrowLeft size={18} />
                        <span>이전</span>
                    </button>
                    <div className="world-setup-footer-progress">
                        <div className="world-setup-section-label">
                            <span>1 / 1</span>
                            <strong>{section.title}</strong>
                        </div>
                    </div>
                    <button className="nav-button next" onClick={handleComplete}>
                        <span>완료</span>
                        <ArrowRight size={18} />
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default RewardSelect;
