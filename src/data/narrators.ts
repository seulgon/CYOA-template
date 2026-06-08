export type NarratorId =
    | 'angel'
    | 'demon'
    | 'mountain_spirit'
    | 'vengeful_spirit'
    | 'ai_avatar';

export interface NarratorTheme {
    accent: string;
    accentHover: string;
    accentStrong: string;
    accentRgb: string;
    accentStrongRgb: string;
    ink: string;
    panelRgb: string;
}

export interface NarratorProfile {
    id: NarratorId;
    name: string;
    description: string;
    portraitImage: string;
    standingImage: string;
    tableImage: string;
    theme: NarratorTheme;
}

export const DEFAULT_NARRATOR_ID: NarratorId = 'angel';

export const NARRATOR_PROFILES: NarratorProfile[] = [
    {
        id: 'angel',
        name: '천사',
        description: '빛과 정의를 대변하는 천상계의 존재. 숭고하고 영광스러운 길로 당신을 이끕니다.',
        portraitImage: './assets/images/narrators/angel/angel.webp',
        standingImage: './assets/images/narrators/angel/angel_standing_clear.png',
        tableImage: './assets/images/stage/angel_marble_altar.png',
        theme: {
            accent: '#ebc050',
            accentHover: '#f9c74f',
            accentStrong: '#f7da91',
            accentRgb: '235, 192, 80',
            accentStrongRgb: '247, 218, 145',
            ink: '#050307',
            panelRgb: '12, 12, 18',
        },
    },
    {
        id: 'demon',
        name: '악마',
        description: '심연과 탐욕의 화신인 마계의 군주. 달콤한 파멸과 강력한 힘의 계약을 제안합니다.',
        portraitImage: './assets/images/narrators/demon/demon.webp',
        standingImage: './assets/images/narrators/demon/demon_standing_clear.png',
        tableImage: './assets/images/stage/red_silk_table.png',
        theme: {
            accent: '#9d1f2f',
            accentHover: '#dc143c',
            accentStrong: '#ff455f',
            accentRgb: '157, 31, 47',
            accentStrongRgb: '255, 69, 95',
            ink: '#070204',
            panelRgb: '18, 7, 9',
        },
    },
    {
        id: 'mountain_spirit',
        name: '산신령',
        description: '이 땅을 조용히 수호해 온 유구한 정령. 온화하고 지혜로운 충고로 갈 길을 일깨워 줍니다.',
        portraitImage: './assets/images/narrators/mountain_spirit/mountain_spirit.webp',
        standingImage: './assets/images/narrators/mountain_spirit/mountain_spirit_standing_clear.png',
        tableImage: './assets/images/stage/mountain_spirit_wood_table.png',
        theme: {
            accent: '#75c9a3',
            accentHover: '#4fae62',
            accentStrong: '#a8ead1',
            accentRgb: '117, 201, 163',
            accentStrongRgb: '168, 234, 209',
            ink: '#03100b',
            panelRgb: '8, 20, 13',
        },
    },
    {
        id: 'vengeful_spirit',
        name: '원령',
        description: '깊은 원한과 미련으로 뭉쳐진 고독한 혼백. 뒤틀린 인과와 피의 복수를 속삭입니다.',
        portraitImage: './assets/images/narrators/vengeful_spirit/vengeful_spirit.webp',
        standingImage: './assets/images/narrators/vengeful_spirit/vengeful_spirit_standing_clear.png',
        tableImage: './assets/images/stage/vengeful_spirit_black_slate_table.png',
        theme: {
            accent: '#003153',
            accentHover: '#191970',
            accentStrong: '#6fa8dc',
            accentRgb: '0, 49, 83',
            accentStrongRgb: '111, 168, 220',
            ink: '#010713',
            panelRgb: '4, 10, 24',
        },
    },
    {
        id: 'ai_avatar',
        name: '초지능 AI',
        description: '시공간의 잔재로 이루어진 인공지능 아바타. 냉철하고 객관적인 시선으로 당신의 여정을 기록합니다.',
        portraitImage: './assets/images/narrators/ai_avatar/ai_avatar.webp',
        standingImage: './assets/images/narrators/ai_avatar/ai_avatar_standing.png',
        tableImage: './assets/images/stage/super_ai_chrome_table.png',
        theme: {
            accent: '#00b3a4',
            accentHover: '#00d4ff',
            accentStrong: '#7efcff',
            accentRgb: '0, 179, 164',
            accentStrongRgb: '126, 252, 255',
            ink: '#011012',
            panelRgb: '2, 18, 22',
        },
    },
];

const narratorProfileMap = new Map<NarratorId, NarratorProfile>(
    NARRATOR_PROFILES.map(profile => [profile.id, profile])
);

export const getNarratorProfile = (id?: string | null): NarratorProfile => {
    if (!id) return narratorProfileMap.get(DEFAULT_NARRATOR_ID)!;
    return narratorProfileMap.get(id as NarratorId) ?? narratorProfileMap.get(DEFAULT_NARRATOR_ID)!;
};

export const getNarratorThemeVariables = (id?: string | null): Record<string, string> => {
    const theme = getNarratorProfile(id).theme;

    return {
        '--accent-color': theme.accent,
        '--accent-hover': theme.accentHover,
        '--narrator-accent': theme.accent,
        '--narrator-accent-hover': theme.accentHover,
        '--narrator-accent-strong': theme.accentStrong,
        '--narrator-accent-rgb': theme.accentRgb,
        '--narrator-accent-strong-rgb': theme.accentStrongRgb,
        '--narrator-ink': theme.ink,
        '--narrator-panel-rgb': theme.panelRgb,
    };
};

export const getNarratorImageUrls = (): string[] => (
    NARRATOR_PROFILES.flatMap(profile => [profile.portraitImage, profile.standingImage, profile.tableImage])
);
