import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { initialCYOAData } from '../../data/cyoa';
import type { Choice } from '../../types/cyoa';
import CYOAHeader from '../CYOABuilder/CYOAHeader';
import ChoiceCard from '../CYOABuilder/ChoiceCard';
import CYOALivePreview from '../CYOABuilder/CYOALivePreview';
import CYOAModals from '../CYOABuilder/CYOAModals';
import { STAT_ADJUSTMENT_POINT_STEP, useCYOABuilder } from '../CYOABuilder/useCYOABuilder';
import type { CYOABuilderProps } from '../CYOABuilder/useCYOABuilder';
import '../CYOABuilder/CYOABuilder.css';
import './VioletDeckCYOA.css';
import GoldParticles from '../common/GoldParticles';
import { gameImagePreloader } from '../../utils/imagePreloader';
import { getNarratorCardAssets, getNarratorProfile, getNarratorStageBackground } from '../../data/narrators';

import DialogueBox from '../common/DialogueBox/DialogueBox';

interface VioletDeckCYOAProps extends CYOABuilderProps {
  onBack?: () => void;
  narratorId?: string | null;
}

const MotionDialogueBox = motion(DialogueBox);

const VioletDeckCYOA = ({ onBack, narratorId, ...builderProps }: VioletDeckCYOAProps) => {
  const cardTableRef = useRef<HTMLElement>(null);
  const [dialogueText, setDialogueText] = useState<string | null>(null);
  const [dialogueRequirements, setDialogueRequirements] = useState<string | null>(null);
  const narrator = getNarratorProfile(narratorId);
  const stageBackground = getNarratorStageBackground(narratorId, 'cyoa');
  const cardAssets = getNarratorCardAssets(narrator.id);
  const builder = useCYOABuilder(builderProps);

  const activeSection = builder.activeSection ?? initialCYOAData.sections[0];
  const displayedDialogue = dialogueText ?? activeSection?.description ?? '';
  const activeSectionIndex = initialCYOAData.sections.findIndex(section => section.id === activeSection.id);
  const prevSection = activeSectionIndex > 0 ? initialCYOAData.sections[activeSectionIndex - 1] : null;
  const nextSection = activeSectionIndex >= 0 && activeSectionIndex < initialCYOAData.sections.length - 1
    ? initialCYOAData.sections[activeSectionIndex + 1]
    : null;
  const isChoiceVisible = (choice: Choice) => {
    if (!choice.secret) return true;
    const { disabled, partiallyMet } = builder.getDisabledState(choice);
    if (!disabled) return true;
    if (choice.secret === 'partial' && partiallyMet) return true;
    return false;
  };

  useEffect(() => {
    const urls = [
      narrator.standingImage,
      narrator.tableImage,
      stageBackground,
      cardAssets.frameImage,
      cardAssets.backImage,
      ...activeSection.choices
      .flatMap(choice => [choice.image, choice.selectedImage])
      .filter((url): url is string => Boolean(url)),
    ];

    gameImagePreloader.enqueue(urls, { priority: true });
  }, [activeSection, narrator.standingImage, narrator.tableImage, stageBackground, cardAssets.frameImage, cardAssets.backImage]);

  const choiceGroups = (() => {
    const ungroupedChoices: Choice[] = [];
    const groupedChoices = new Map<string, Choice[]>();

    activeSection?.choices.forEach(choice => {
      if (!isChoiceVisible(choice)) return;

      if (!choice.group) {
        ungroupedChoices.push(choice);
        return;
      }

      const choices = groupedChoices.get(choice.group) ?? [];
      choices.push(choice);
      groupedChoices.set(choice.group, choices);
    });

    const groups = [
      ...(ungroupedChoices.length > 0
        ? [{ key: 'ungrouped', title: null as string | null, choices: ungroupedChoices }]
        : []),
      ...Array.from(groupedChoices.entries()).map(([groupName, choices]) => ({
        key: groupName,
        title: activeSection?.groupTitles?.[groupName] ?? groupName,
        choices,
      })),
    ];

    if (activeSection?.id !== 'alignment') return groups;

    return groups.sort((a, b) => {
      if (a.key === 'alignment_result') return 1;
      if (b.key === 'alignment_result') return -1;
      return 0;
    });
  })();

  const renderChoiceCard = (choice: Choice, index: number) => {
    const { disabled, reason, partiallyMet } = builder.getDisabledState(choice);
    if (choice.secret && disabled) {
      if (choice.secret === 'partial') {
        if (!partiallyMet) return null;
      } else {
        return null;
      }
    }

    return (
      <ChoiceCard
        key={choice.id}
        choice={choice}
        index={index}
        isSelected={builder.selectedChoices.has(choice.id) || (!!choice.adjustableStat && builder.statAdjustments[choice.adjustableStat] !== 0)}
        onSelect={() => {
          const isSelected = builder.selectedChoices.has(choice.id);
          setDialogueText(isSelected ? null : (choice.comment ?? choice.description));
          setDialogueRequirements(null);
          builder.handleSelect(activeSection.id, choice);
        }}
        disabled={disabled}
        disabledReason={reason}
        isFree={choice.freeWithTag?.some(tag => builder.currentTagsWithEquip.includes(tag)) || false}
        discountAmount={(() => {
          const discount = choice.discounts?.reduce((max, d) => {
            if (builder.currentTagsWithEquip.includes(d.tag)) return Math.max(max, d.amount);
            return max;
          }, 0) || 0;
          return Math.max(0, choice.cost - discount);
        })()}
        grantedChoiceNames={choice.grantsChoices?.map(id => builder.getChoiceName(id))}
        statAdjustment={choice.adjustableStat ? {
          value: builder.statAdjustments[choice.adjustableStat],
          pointDelta: -builder.statAdjustments[choice.adjustableStat] * STAT_ADJUSTMENT_POINT_STEP,
          onDecrease: () => builder.handleStatAdjustment(choice.adjustableStat!, -1),
          onIncrease: () => builder.handleStatAdjustment(choice.adjustableStat!, 1),
        } : undefined}
        variant={activeSection.id === 'world_setup' ? 'condensed' : 'default'}
        hideImage={activeSection.id === 'combat_skills' || activeSection.id === 'items'}
        isListView={false}
        playerStats={builder.finalStats}
        observerBlocked={false}
        dealFrom="top"
        narratorId={narrator.id}
      />
    );
  };

  const handleSectionChange = (sectionId: string) => {
    builder.playSfx('tabSwitch');
    setDialogueText(null);
    setDialogueRequirements(null);
    builder.setActiveTabId(sectionId);
  };

  const handleConfirmCharacter = () => {
    if (!builder.canComplete) {
      setDialogueText(null);
      setDialogueRequirements(builder.validation.errors.join(', '));
      builder.playSfx('skillFail');
      return;
    }

    builder.handleComplete();
  };

  return (
    <div className="violet-deck-cyoa">
      <div className="violet-scene-frame">
        <div className="violet-stage" aria-hidden="true">
          <img
            className="violet-stage-bg"
            src={stageBackground}
            alt=""
          />
          <img
            className="violet-stage-narrator"
            src={narrator.standingImage}
            alt=""
          />
          <img
            className="violet-stage-table"
            src={narrator.tableImage}
            alt=""
          />
        </div>
        <div className="violet-scene-shade" aria-hidden="true" />
        <GoldParticles count={55} intensity="high" />

        <motion.section
          ref={cardTableRef}
          key={activeSection.id}
          className="violet-card-table"
          aria-label={`${activeSection?.title ?? '선택지'} 카드`}
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.045,
                delayChildren: 0.08,
              },
            },
          }}
        >
          <MotionDialogueBox
            key={`dialogue-${activeSection.id}-${displayedDialogue}`}
            className="violet-dialogue-zone"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            name={narrator.name}
            text={displayedDialogue}
            requirements={dialogueRequirements ? `${dialogueRequirements}에 대한 선택을 더 해야해.` : null}
            glow={true}
          />

          {(() => {
            let cardIndex = 0;

            return choiceGroups.map(group => (
              <div className="violet-choice-group" key={group.key}>
                {group.title && (
                  <h3 className="violet-choice-group-title">{group.title}</h3>
                )}
                <div className="violet-choice-group-grid">
                  {group.choices.map(choice => renderChoiceCard(choice, cardIndex++))}
                </div>
              </div>
            ));
          })()}

          <div className="violet-card-section-nav">
            {prevSection ? (
              <button onClick={() => handleSectionChange(prevSection.id)}>
                ← {prevSection.title}
              </button>
            ) : <span />}

            {nextSection ? (
              <button onClick={() => handleSectionChange(nextSection.id)}>
                {nextSection.title} →
              </button>
            ) : <span />}
          </div>

          <div className="violet-card-section-tabs">
            {initialCYOAData.sections.map(section => (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className={section.id === activeSection.id ? 'active' : ''}
              >
                {section.title}
              </button>
            ))}
          </div>
        </motion.section>

        <div className="violet-status-footer">
          <CYOALivePreview builder={builder} />
          <div className="violet-footer-header-row">
            <CYOAHeader
              builder={builder}
              onBack={onBack}
              showBGMButton={false}
              leftContent={
                <div className="violet-header-points" aria-label={`남은 포인트 ${builder.currentPoints}`}>
                  <span>{builder.currentPoints}</span>
                  <b>P</b>
                </div>
              }
            />
            <button
              className={`violet-start-adventure-button ${builder.canComplete ? '' : 'disabled'}`}
              onClick={handleConfirmCharacter}
            >
              선택 완료
            </button>
          </div>
        </div>

        <div className="violet-scroll-buttons-container">
          <button
            className="violet-scroll-btn"
            onClick={() => cardTableRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            title="카드 영역 맨 위로 이동"
          >
            <ArrowUp size={22} />
          </button>
          <button
            className="violet-scroll-btn"
            onClick={() => {
              const table = cardTableRef.current;
              table?.scrollTo({ top: table.scrollHeight, behavior: 'smooth' });
            }}
            title="카드 영역 맨 아래로 이동"
          >
            <ArrowDown size={22} />
          </button>
        </div>

        <CYOAModals builder={builder} />
      </div>
    </div>
  );
};

export default VioletDeckCYOA;
