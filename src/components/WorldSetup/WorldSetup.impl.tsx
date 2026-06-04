import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './WorldSetup.css';
import TagTooltip from '../common/TagTooltip';
import ChoiceLightbox from '../CYOABuilder/ChoiceLightbox';
import GoldParticles from '../common/GoldParticles';
import { gameImagePreloader } from '../../utils/imagePreloader';

interface WorldSetupChoice {
    id: string;
    name: string;
    description: string;
    comment?: string;
    bonusPoints?: number;
    tags?: string[];
    epithetPart?: string;
    image?: string;
}

interface WorldSetupSection {
    id: string;
    title: string;
    question: string;
    choices?: WorldSetupChoice[]; // choices is optional for name input
    isNameInput?: boolean;
}

const worldSetupData: WorldSetupSection[] = [
    {
        id: "name",
        title: "이름",
        question: "당신의 이름은 무엇입니까?",
        isNameInput: true
    },
    {
        id: "inviter",
        title: "초대자",
        question: "이 단계는 CYOA의 세계관 설정이나 기초 조율을 위한 단계입니다. 단일 선택(Single-select) 카드 UI의 예시를 아래에서 체험해 보세요.",
        choices: [
            { id: "inviter_collision", name: "차원 충돌", description: "이 카드는 단일 선택 카드의 대표적인 예시입니다. 선택 시 '차원충돌' 태그가 인벤토리에 실시간으로 추가됩니다.", comment: "이 카드는 단일 선택 카드의 대표적인 예시입니다. 선택 시 '차원충돌' 태그가 인벤토리에 실시간으로 추가됩니다.", tags: ["차원충돌"], epithetPart: "우연히 도착한", image: "./assets/images/worldsetup/inviter_collision.webp" },
            { id: "inviter_wish", name: "누군가의 소망", description: "카드를 클릭하면 바이올렛 대사창의 텍스트가 해당 카드의 세부 설명으로 실시간 변경되는 것을 볼 수 있습니다.", comment: "카드를 클릭하면 바이올렛 대사창의 텍스트가 해당 카드의 세부 설명으로 실시간 변경되는 것을 볼 수 있습니다.", tags: ["누군가의_소망"], epithetPart: "소망받은", image: "./assets/images/worldsetup/inviter_wish.webp" },
            { id: "inviter_ritual", name: "소환 의식", description: "선택된 카드는 금색 테두리와 체크 마크 효과가 적용되어 사용자에게 확실한 시각적 피드백을 전달합니다.", comment: "선택된 카드는 금색 테두리와 체크 마크 효과가 적용되어 사용자에게 확실한 시각적 피드백을 전달합니다.", tags: ["소환의식"], epithetPart: "소환된", image: "./assets/images/worldsetup/inviter_ritual.webp" },
            { id: "inviter_pantheon", name: "만신전", description: "각 카드는 이미지와 타이틀, 그리고 하단의 고유 태그들로 구조화되어 있어 정돈된 느낌을 줍니다.", comment: "각 카드는 이미지와 타이틀, 그리고 하단의 고유 태그들로 구조화되어 있어 정돈된 느낌을 줍니다.", tags: ["초대받은_자"], epithetPart: "초대받은", image: "./assets/images/worldsetup/inviter_pantheon.webp" },
            { id: "inviter_elder", name: "고대신 ▣▤◆▩", description: "오른쪽 하단의 '+' 아이콘을 누르면 이미지 라이트박스(확대) 모달이 띄워지는 애니메이션을 확인할 수 있습니다.", comment: "오른쪽 하단의 '+' 아이콘을 누르면 이미지 라이트박스(확대) 모달이 띄워지는 애니메이션을 확인할 수 있습니다.", tags: ["◆▩의_관심"], epithetPart: "부름받은", image: "./assets/images/worldsetup/inviter_elder.webp" }
        ]
    }
];
interface WorldSetupProps {
    onComplete: (data: { name: string; points: number; choices: string[]; tags: string[]; rawSelections: Record<string, string>; lastStep: number }) => void;
    initialData?: { name: string; selections: Record<string, string>; startStep: number };
}

const WorldSetup: React.FC<WorldSetupProps> = ({ onComplete, initialData }) => {
    const cardTableRef = useRef<HTMLElement>(null);
    const [currentStep, setCurrentStep] = useState(initialData?.startStep ?? 0);
    const [selections, setSelections] = useState<Record<string, string>>(
        initialData?.selections ?? {}
    );
    const [characterName, setCharacterName] = useState(initialData?.name ?? '쵸붕이');
    const [dialogueText, setDialogueText] = useState<string | null>(null);
    const [lightboxChoice, setLightboxChoice] = useState<WorldSetupChoice | null>(null);

    useEffect(() => {
        cardTableRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    }, [currentStep]);

    const handleSelect = (choiceId: string) => {
        const currentSection = worldSetupData[currentStep];
        const sectionId = currentSection.id;
        const selectedChoice = currentSection.choices?.find(choice => choice.id === choiceId);

        setDialogueText(selectedChoice?.description ?? null);
        setSelections({ ...selections, [sectionId]: choiceId });
    };

    const handleNext = () => {
        if (currentStep < worldSetupData.length - 1) {
            const nextStep = currentStep + 1;
            setDialogueText(null);

            setCurrentStep(nextStep);
        } else {
            // Calculate final data
            let totalBonus = 0;
            const allTags: string[] = [];
            const allChoices: string[] = [];

            worldSetupData.forEach(section => {
                const selectedIds = selections[section.id] ? selections[section.id].split(',') : [];
                if (section.choices && selectedIds.length > 0) {
                    selectedIds.forEach(selectedId => {
                        const choice = section.choices!.find(c => c.id === selectedId);
                        if (choice) {
                            totalBonus += choice.bonusPoints || 0;
                            if (choice.tags) allTags.push(...choice.tags);
                            allChoices.push(choice.id);
                        }
                    });
                }
            });

            onComplete({ name: characterName, points: totalBonus, choices: allChoices, tags: allTags, rawSelections: selections, lastStep: currentStep });
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setDialogueText(null);
            setCurrentStep(currentStep - 1);
        }
    };

    const section = worldSetupData[currentStep];
    const displayedDialogue = dialogueText ?? section.question;
    const canContinue = section.isNameInput
        ? characterName.trim().length >= 2
        : selections[section.id] !== undefined;

    useEffect(() => {
        const urls = section.choices
            ?.map(choice => choice.image)
            .filter((url): url is string => Boolean(url)) ?? [];

        gameImagePreloader.enqueue(urls, { priority: true });
    }, [section]);

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
                <picture>
                    <source
                        media="(max-width: 768px), (pointer: coarse)"
                        srcSet="./assets/images/intro/violet_intro_wide.webp"
                    />
                    <img
                        className="world-setup-scene-image"
                        src="./assets/images/intro/violet_intro_wide_more.webp"
                        alt=""
                        aria-hidden="true"
                    />
                </picture>
                <div className="world-setup-scene-shade" aria-hidden="true" />
                <GoldParticles count={55} intensity="high" />

                <section
                    ref={cardTableRef}
                    className="world-setup-card-table"
                    aria-label={`${section.title} 선택지`}
                >
                    <motion.div
                        key={`world-setup-dialogue-${section.id}-${displayedDialogue}`}
                        className="world-setup-dialogue-zone"
                        aria-label="월드 셋업 대사"
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

                    {section.isNameInput ? (
                        <motion.div
                            key="world-setup-name"
                            className="world-setup-name-panel"
                            initial={{ opacity: 0, y: -28, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.38, ease: 'easeOut' }}
                        >
                            <div className="name-input-container">
                                <input
                                    type="text"
                                    className="world-setup-name-input"
                                    placeholder="이름을 입력하세요 (2~12자)"
                                    value={characterName}
                                    onChange={(e) => setCharacterName(e.target.value.slice(0, 12))}
                                    autoFocus
                                />
                                <p className="name-input-hint">입력하신 이름은 모험 중에 사용됩니다.</p>
                            </div>
                        </motion.div>
                    ) : (
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
                            {section.choices?.map(choice => {
                                const currentSelected = selections[section.id] ? selections[section.id].split(',') : [];
                                const isSelected = currentSelected.includes(choice.id);
                                const isDisabled = false;

                                return (
                                    <motion.div
                                        key={choice.id}
                                        className={`choice-item ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                                        onClick={() => !isDisabled && handleSelect(choice.id)}
                                        onKeyDown={(event) => {
                                            if (isDisabled) return;
                                            if (event.key === 'Enter' || event.key === ' ') {
                                                event.preventDefault();
                                                handleSelect(choice.id);
                                            }
                                        }}
                                        role="button"
                                        tabIndex={isDisabled ? -1 : 0}
                                        aria-disabled={isDisabled}
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
                    )}
                </section>

                <footer className="world-setup-footer">
                    <button
                        className="nav-button back"
                        onClick={handleBack}
                        disabled={currentStep === 0}
                    >
                        <ArrowLeft size={18} />
                        <span>이전</span>
                    </button>
                    <div className="world-setup-footer-progress">
                        <div className="world-setup-section-label">
                            <span>{currentStep + 1} / {worldSetupData.length}</span>
                            <strong>{section.title}</strong>
                        </div>
                    </div>
                    <button
                        className="nav-button next"
                        onClick={handleNext}
                        disabled={!canContinue}
                    >
                        <span>{currentStep === worldSetupData.length - 1 ? '완료' : '다음'}</span>
                        <ArrowRight size={18} />
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default WorldSetup;
