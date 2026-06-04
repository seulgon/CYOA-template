export type StatKey = 'HP' | 'Sanity' | 'POW' | 'SEN' | 'INT' | 'CON' | 'WIL' | 'CHA' | 'LUK';

export interface StatModifier {
    stat: StatKey;
    value: number;      // 고정값: +20, -10
    percent?: number;   // 퍼센트: +10%
    max?: number;       // 최대값 제한
    min?: number;       // 최소값 제한
}

export interface ConsumableEffect {
    type: 'stat_modifier' | 'cure' | 'buff' | 'debuff';
    modifiers: StatModifier[];
    duration?: number;   // 버프/디버프 지속시간 (턴)
    message?: string;    // 사용 시 메시지
}
