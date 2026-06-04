export const STAT_LABELS: Record<string, string> = {
    POW: '근력',
    SEN: '감각',
    INT: '지능',
    CON: '건강',
    WIL: '의지',
    CHA: '매력',
    LUK: '행운',
    Gold: '소지금'
};

export const getStatLabel = (key: string): string => {
    return STAT_LABELS[key] || key;
};
