import { initialCYOAData } from '../../../data/cyoa';
import type { Choice } from '../../../types/cyoa';

export interface DisabledState {
    disabled: boolean;
    reason?: string;
    partiallyMet?: boolean;
    allReasons?: string[];
}

export const getChoiceNameById = (id: string): string => {
    for (const section of initialCYOAData.sections) {
        const found = section.choices.find(choice => choice.id === id);
        if (found) return found.name;
    }
    return id;
};

export const getDisabledStateForChoice = (
    choice: Choice,
    selectedChoices: Set<string>,
    currentTagsWithEquip: string[],
    getChoiceName: (id: string) => string,
): DisabledState => {
    const reasons: string[] = [];
    let metConditions = 0;

    if (choice.prerequisites && choice.prerequisites.length > 0) {
        const missingPrereq = choice.prerequisites.find(pre => !selectedChoices.has(pre));
        if (missingPrereq) {
            reasons.push(`선행 조건: '${getChoiceName(missingPrereq)}' 필요`);
        } else {
            metConditions++;
        }
    }

    if (choice.requiredTags && choice.requiredTags.length > 0) {
        const missingTags = choice.requiredTags.filter(tag => !currentTagsWithEquip.includes(tag));
        const metTags = choice.requiredTags.filter(tag => currentTagsWithEquip.includes(tag));
        metConditions += metTags.length;
        if (missingTags.length > 0) {
            reasons.push(`필요 태그: ${missingTags.map(tag => `#${tag}`).join(', ')}`);
        }
    }

    if (choice.requiredAnyTag && choice.requiredAnyTag.length > 0) {
        const hasAnyTag = choice.requiredAnyTag.some(tag => currentTagsWithEquip.includes(tag));
        if (!hasAnyTag) {
            reasons.push(`필요 태그: ${choice.requiredAnyTag.map(tag => `#${tag}`).join(' 또는 ')}`);
        } else {
            metConditions++;
        }
    }

    if (choice.incompatible && choice.incompatible.length > 0) {
        const conflict = choice.incompatible.find(incompatible => selectedChoices.has(incompatible));
        if (conflict) {
            reasons.push(`선택 불가: '${getChoiceName(conflict)}'과는 함께 선택할 수 없습니다.`);
        }
    }

    if (reasons.length > 0) {
        const partiallyMet = metConditions > 0;
        return { disabled: true, reason: reasons.join(' / '), partiallyMet, allReasons: reasons };
    }

    return { disabled: false };
};

const addSelectedTags = (selection: Set<string>, worldSetupTags: string[]) => {
    const tempTags = new Set(worldSetupTags);

    initialCYOAData.sections.forEach(section => {
        section.choices.forEach(choice => {
            if (selection.has(choice.id) && choice.tags) {
                choice.tags.forEach(tag => tempTags.add(typeof tag === 'string' ? tag : tag.name));
            }
        });
    });

    return Array.from(tempTags);
};

const findChoice = (choiceId: string): Choice | undefined => {
    for (const section of initialCYOAData.sections) {
        const selectedChoice = section.choices.find(choice => choice.id === choiceId);
        if (selectedChoice) return selectedChoice;
    }

    return undefined;
};

const isSelectionValid = (
    selectedChoice: Choice,
    selection: Set<string>,
    currentTags: string[],
) => {
    if (selectedChoice.prerequisites && selectedChoice.prerequisites.length > 0) {
        const missingPrereq = selectedChoice.prerequisites.find(pre => !selection.has(pre));
        if (missingPrereq) return false;
    }

    if (selectedChoice.requiredTags && selectedChoice.requiredTags.length > 0) {
        const missingTag = selectedChoice.requiredTags.find(tag => !currentTags.includes(tag));
        if (missingTag) return false;
    }

    if (selectedChoice.requiredAnyTag && selectedChoice.requiredAnyTag.length > 0) {
        const hasAnyTag = selectedChoice.requiredAnyTag.some(tag => currentTags.includes(tag));
        if (!hasAnyTag) return false;
    }

    if (selectedChoice.incompatible && selectedChoice.incompatible.length > 0) {
        const conflict = selectedChoice.incompatible.find(incompatible => selection.has(incompatible));
        if (conflict) return false;
    }

    return true;
};

const pruneInvalidSelections = (
    selection: Set<string>,
    worldSetupTags: string[],
) => {
    let changed = true;

    while (changed) {
        changed = false;
        const currentTags = addSelectedTags(selection, worldSetupTags);
        const currentSelectedIds = Array.from(selection);

        for (const selectedId of currentSelectedIds) {
            const selectedChoice = findChoice(selectedId);
            if (!selectedChoice) continue;

            if (!isSelectionValid(selectedChoice, selection, currentTags)) {
                selection.delete(selectedId);
                changed = true;
                selectedChoice.grantsChoices?.forEach(grantedId => selection.delete(grantedId));
            }
        }
    }

    return selection;
};

export const applyChoiceSelection = (
    selectedChoices: Set<string>,
    sectionId: string,
    choice: Choice,
    worldSetupTags: string[],
) => {
    const newSelection = new Set(selectedChoices);
    const section = initialCYOAData.sections.find(candidate => candidate.id === sectionId);
    const wasSelected = newSelection.has(choice.id);
    const newGranted: string[] = [];

    if (wasSelected) {
        newSelection.delete(choice.id);
        choice.grantsChoices?.forEach(grantedId => newSelection.delete(grantedId));
    } else {
        if (section?.type === 'single') {
            section.choices.forEach(candidate => {
                candidate.grantsChoices?.forEach(grantedId => newSelection.delete(grantedId));
                newSelection.delete(candidate.id);
            });
        } else if (choice.group && !choice.multiSelectGroup) {
            section?.choices.forEach(candidate => {
                if (candidate.group === choice.group && candidate.id !== choice.id) {
                    candidate.grantsChoices?.forEach(grantedId => newSelection.delete(grantedId));
                    newSelection.delete(candidate.id);
                }
            });
        }

        newSelection.add(choice.id);

        if (choice.grantsChoices) {
            newGranted.push(...choice.grantsChoices.filter(id => !selectedChoices.has(id)));
            choice.grantsChoices.forEach(grantedId => newSelection.add(grantedId));
        }
    }

    return {
        selection: pruneInvalidSelections(newSelection, worldSetupTags),
        wasSelected,
        newGranted,
    };
};

export const applyAutoSelectChoice = (
    selection: Set<string>,
    sectionChoices: Choice[],
    choice: Choice,
    sectionType?: string,
) => {
    if (sectionType === 'single') {
        sectionChoices.forEach(candidate => {
            if (selection.has(candidate.id)) {
                selection.delete(candidate.id);
                candidate.grantsChoices?.forEach(grantedId => selection.delete(grantedId));
            }
        });
    }

    selection.add(choice.id);
    choice.grantsChoices?.forEach(grantedId => selection.add(grantedId));
};
