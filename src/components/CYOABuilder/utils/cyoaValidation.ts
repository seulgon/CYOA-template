import { initialCYOAData } from '../../../data/cyoa';
import { getStatLabel } from '../../../utils/statUtils';

export const validateCyoaBuilder = (
    selectedChoices: Set<string>,
    currentPoints: number,
    currentStats: Record<string, number>,
) => {
    const errors: string[] = [];

    if (currentPoints < 0) {
        errors.push(`포인트 부족(${currentPoints}P)`);
    }

    const mainStats = ['POW', 'SEN', 'INT', 'CON', 'WIL', 'CHA', 'LUK'];
    const lowStats = mainStats.filter(stat => {
        const finalValue = 10 + (currentStats[stat] || 0);
        return finalValue <= 0;
    });

    if (lowStats.length > 0) {
        errors.push(`능력치 부족(0 이하): ${lowStats.map(getStatLabel).join(', ')}`);
    }

    const missingRequirements: string[] = [];

    initialCYOAData.sections.forEach(section => {
        if (section.required && !section.choices.some(choice => selectedChoices.has(choice.id))) {
            missingRequirements.push(section.title);
        }

        if (section.requiredGroups) {
            section.requiredGroups.forEach(groupName => {
                const groupChoices = section.choices.filter(choice => choice.group === groupName);
                const hasSelection = groupChoices.some(choice => selectedChoices.has(choice.id));
                if (!hasSelection) {
                    const displayName = section.groupTitles?.[groupName] ?? groupName;
                    missingRequirements.push(displayName);
                }
            });
        }
    });

    if (missingRequirements.length > 0) {
        errors.push(missingRequirements.join(', '));
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};
