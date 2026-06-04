import { useCallback, useEffect, useMemo, useState } from 'react';
import { initialCYOAData } from '../../data/cyoa';
import type { Choice } from '../../types/cyoa';
import { generateEpithet } from '../../utils/epithetUtils';
import { useAudioStore } from '../../hooks/useAudioStore';
import type { ToastType } from '../common/Toast';
import {
    type AdjustableStat,
} from './utils/cyoaBuilderConstants';
import {
    calculateBuilderProgress,
    calculateFinalBuilderStats,
    getAllSelectedSkills,
    getCurrentInventory,
    getCurrentTagsWithEquip,
} from './utils/cyoaDerivedState';
import {
    applyAutoSelectChoice,
    applyChoiceSelection,
    getChoiceNameById,
    getDisabledStateForChoice,
} from './utils/cyoaSelectionRules';
import { validateCyoaBuilder } from './utils/cyoaValidation';

export { ADJUSTABLE_STATS, STAT_ADJUSTMENT_POINT_STEP } from './utils/cyoaBuilderConstants';
export type { AdjustableStat } from './utils/cyoaBuilderConstants';

export interface CYOABuilderProps {
    onComplete: (finalData: any) => void;
    worldSetupBonus?: number;
    worldSetupTags?: string[];
    worldSetupChoices?: string[];
    characterName?: string;
    initialData?: any;
    showNotification: (message: string, type?: ToastType) => void;
}

export const useCYOABuilder = ({
    onComplete,
    worldSetupBonus = 0,
    worldSetupTags = [],
    worldSetupChoices = [],
    characterName = '',
    initialData,
    showNotification
}: CYOABuilderProps) => {
    const characterEpithet = useMemo(() => generateEpithet(worldSetupChoices), [worldSetupChoices]);
    const playSfx = useAudioStore(state => state.playSfx);
    const [activeTabId, setActiveTabId] = useState(initialCYOAData.sections[0].id);
    const [selectedChoices, setSelectedChoices] = useState<Set<string>>(new Set(initialData?.choices || []));
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [isStatusBarCollapsed, setIsStatusBarCollapsed] = useState(false);
    const [breakdownStat, setBreakdownStat] = useState<string | null>(null);
    const [statAdjustments, setStatAdjustments] = useState<Record<AdjustableStat, number>>({
        POW: 0,
        SEN: 0,
        INT: 0,
        CON: 0,
        WIL: 0,
        CHA: 0,
        LUK: 0
    });

    const { currentPoints, currentStats, currentTags } = useMemo(() => (
        calculateBuilderProgress(selectedChoices, worldSetupBonus, worldSetupTags, statAdjustments)
    ), [selectedChoices, worldSetupTags, worldSetupBonus, statAdjustments]);

    const finalStats = useMemo(() => calculateFinalBuilderStats(currentStats), [currentStats]);

    const currentInventory = useMemo(() => getCurrentInventory(selectedChoices), [selectedChoices]);

    const currentTagsWithEquip = useMemo(() => (
        getCurrentTagsWithEquip(currentTags)
    ), [currentTags]);

    const allSelectedSkills = useMemo(() => getAllSelectedSkills(selectedChoices), [selectedChoices]);

    const getChoiceName = useCallback((id: string): string => getChoiceNameById(id), []);

    const getDisabledState = useCallback((choice: Choice) => (
        getDisabledStateForChoice(choice, selectedChoices, currentTagsWithEquip, getChoiceName)
    ), [selectedChoices, currentTagsWithEquip, getChoiceName]);

    const handleSelect = (sectionId: string, choice: Choice) => {
        const { selection, wasSelected, newGranted } = applyChoiceSelection(
            selectedChoices,
            sectionId,
            choice,
            worldSetupTags,
        );
        playSfx(wasSelected ? 'cardDeselect' : 'cardSelect');

        if (!wasSelected && newGranted.length > 0) {
            const names = newGranted.map(id => getChoiceName(id)).join(', ');
            playSfx('itemPickup');
            showNotification(`보너스 획득: ${names}`, 'success');
        }

        setSelectedChoices(selection);
    };

    useEffect(() => {
        let changed = false;
        const newSelection = new Set(selectedChoices);

        initialCYOAData.sections.forEach(section => {
            section.choices.forEach(choice => {
                if (choice.autoSelect && !newSelection.has(choice.id)) {
                    const { disabled } = getDisabledState(choice);
                    if (!disabled) {
                        applyAutoSelectChoice(newSelection, section.choices, choice, section.type);
                        changed = true;
                        console.log(`Auto-selected: ${choice.name} (${choice.id})`);
                        playSfx('itemPickup');
                        showNotification(`자동 선택됨: ${choice.name}`, 'success');
                    }
                }
            });
        });

        if (changed) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedChoices(newSelection);
        }
    }, [currentTagsWithEquip, selectedChoices, getDisabledState, showNotification, playSfx]);

    const handleStatAdjustment = useCallback((stat: AdjustableStat, delta: number) => {
        setStatAdjustments(prev => {
            const newValue = prev[stat] + delta;
            playSfx('statAdjust');
            return {
                ...prev,
                [stat]: newValue
            };
        });
    }, [playSfx]);

    const validation = useMemo(() => (
        validateCyoaBuilder(selectedChoices, currentPoints, currentStats)
    ), [selectedChoices, currentPoints, currentStats]);
    const canComplete = validation.isValid;
    const activeSection = initialCYOAData.sections.find(s => s.id === activeTabId);

    const handleComplete = useCallback(() => {
        playSfx('confirm');
        onComplete({
            choices: Array.from(selectedChoices),
            points: currentPoints,
            stats: currentStats,
            tags: currentTagsWithEquip,
            items: currentInventory,
            skillSet: allSelectedSkills.allSkills.map((skill: Choice) => skill.id),
        });
    }, [allSelectedSkills, currentInventory, currentPoints, currentStats, currentTagsWithEquip, onComplete, playSfx, selectedChoices]);

    return {
        characterName,
        characterEpithet,
        activeTabId,
        setActiveTabId,
        selectedChoices,
        isInfoOpen,
        setIsInfoOpen,
        isStatusBarCollapsed,
        setIsStatusBarCollapsed,
        breakdownStat,
        setBreakdownStat,
        statAdjustments,
        currentPoints,
        currentStats,
        finalStats,
        currentInventory,
        currentTagsWithEquip,
        allSelectedSkills,
        getChoiceName,
        getDisabledState,
        handleSelect,
        handleStatAdjustment,
        validation,
        canComplete,
        activeSection,
        handleComplete,
        playSfx
    };
};

export type CYOABuilderViewModel = ReturnType<typeof useCYOABuilder>;
