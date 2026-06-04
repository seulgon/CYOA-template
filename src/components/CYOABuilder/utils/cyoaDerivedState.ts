import { initialCYOAData } from '../../../data/cyoa';
import type { Choice } from '../../../types/cyoa';
import {
    ADJUSTABLE_STATS,
    createBaseStats,
    STAT_ADJUSTMENT_POINT_STEP,
    type AdjustableStat,
} from './cyoaBuilderConstants';

export const calculateBuilderProgress = (
    selectedChoices: Set<string>,
    worldSetupBonus: number,
    worldSetupTags: string[],
    statAdjustments: Record<AdjustableStat, number>,
) => {
    let points = initialCYOAData.initialPoints + worldSetupBonus;
    const stats: Record<string, number> = {};
    const tags: Set<string> = new Set(worldSetupTags);

    initialCYOAData.sections.forEach(section => {
        section.choices.forEach(choice => {
            if (selectedChoices.has(choice.id) && choice.tags) {
                choice.tags.forEach(tag => tags.add(typeof tag === 'string' ? tag : tag.name));
            }
        });
    });

    initialCYOAData.sections.forEach(section => {
        section.choices.forEach(choice => {
            if (!selectedChoices.has(choice.id)) return;

            const isFree = choice.freeWithTag?.some(tag => tags.has(tag)) || false;
            const discount = choice.discounts?.reduce((max, discountInfo) => {
                if (tags.has(discountInfo.tag)) return Math.max(max, discountInfo.amount);
                return max;
            }, 0) || 0;
            const actualCost = isFree ? 0 : (choice.cost < 0 ? choice.cost : Math.max(0, choice.cost - discount));
            points -= actualCost;

            if (choice.stats) {
                Object.entries(choice.stats).forEach(([key, value]) => {
                    stats[key] = (stats[key] || 0) + (value || 0);
                });
            }
        });
    });

    ADJUSTABLE_STATS.forEach(stat => {
        const adjustment = statAdjustments[stat];
        stats[stat] = (stats[stat] || 0) + adjustment;
        points -= adjustment * STAT_ADJUSTMENT_POINT_STEP;
    });

    return { currentPoints: points, currentStats: stats, currentTags: Array.from(tags) };
};

export const calculateFinalBuilderStats = (currentStats: Record<string, number>) => {
    const stats: Record<string, number> = createBaseStats();
    Object.entries(currentStats).forEach(([key, value]) => {
        stats[key] = (stats[key] || 10) + (value || 0);
    });
    return stats;
};

export const getCurrentInventory = (_selectedChoices: Set<string>): string[] => {
    return [];
};

export const getCurrentTagsWithEquip = (currentTags: string[]) => {
    return currentTags;
};

export const getAllSelectedSkills = (_selectedChoices: Set<string>) => {
    const grantedSkillIds = new Set<string>();

    return {
        grantedSkillIds,
        allSkills: [] as Choice[],
    };
};

export const getSelectedSkillBonuses = (
    _selectedSkills: Choice[],
    _finalStats: Record<string, number>,
) => (
    []
);
