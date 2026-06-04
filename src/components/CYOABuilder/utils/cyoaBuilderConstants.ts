export const ADJUSTABLE_STATS = ['POW', 'SEN', 'INT', 'CON', 'WIL', 'CHA', 'LUK'] as const;
export type AdjustableStat = typeof ADJUSTABLE_STATS[number];
export const STAT_ADJUSTMENT_POINT_STEP = 5;

export interface EquippedItems {
    mainHand: string | null;
    offHand: string | null;
    armor: string | null;
    head: string | null;
    waist: string | null;
    feet: string | null;
    back: string | null;
    accessories: string[];
}

export const createDefaultEquipped = (): EquippedItems => ({
    mainHand: null,
    offHand: null,
    armor: null,
    head: null,
    waist: null,
    feet: null,
    back: null,
    accessories: []
});

export const createBaseStats = () => ({
    POW: 10,
    SEN: 10,
    INT: 10,
    CON: 10,
    WIL: 10,
    CHA: 10,
    LUK: 10
});
