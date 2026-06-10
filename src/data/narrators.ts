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

export type NarratorStagePart = 'worldSetup' | 'cyoa' | 'reward';

export interface NarratorStageBackgrounds {
    worldSetup: string;
    cyoa: string;
    reward: string;
}

export interface NarratorProfile {
    id: NarratorId;
    name: string;
    description: string;
    portraitImage: string;
    standingImage: string;
    tableImage: string;
    cardFrameImage: string;
    cardBackImage: string;
    stageBackgrounds?: NarratorStageBackgrounds;
    theme: NarratorTheme;
}

export const DEFAULT_NARRATOR_ID: NarratorId = 'angel';

export interface NarratorCardAssets {
    frameImage: string;
    backImage: string;
}

const DEFAULT_CARD_ASSETS: NarratorCardAssets = {
    frameImage: './assets/images/frame/card_frame.webp',
    backImage: './assets/images/frame/card_backimage.webp',
};

const DEFAULT_STAGE_BACKGROUNDS: NarratorStageBackgrounds = {
    worldSetup: './assets/images/backgrounds/timeline_map_clock_room_4k.webp',
    cyoa: './assets/images/backgrounds/boon_relic_library_4k.webp',
    reward: './assets/images/backgrounds/reward_crystal_treasure_room_4k.webp',
};

export const NARRATOR_PROFILES: NarratorProfile[] = [
    {
        id: 'angel',
        name: '천사',
        description: '빛과 정의를 대변하는 천상계의 존재. 숭고하고 영광스러운 길로 당신을 이끕니다.',
        portraitImage: './assets/images/narrators/angel/angel.webp',
        standingImage: './assets/images/narrators/angel/angel_standing_clear.png',
        tableImage: './assets/images/stage/angel_marble_altar.png',
        cardFrameImage: './assets/images/frame/card_frame_angel.webp',
        cardBackImage: './assets/images/frame/card_backimage_angel.png',
        stageBackgrounds: {
            worldSetup: './assets/images/backgrounds/angel/world_setup.png',
            cyoa: './assets/images/backgrounds/angel/cyoa.png',
            reward: './assets/images/backgrounds/angel/reward.png',
        },
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
        tableImage: './assets/images/stage/demon_altar.png',
        cardFrameImage: './assets/images/frame/card_frame_demon.webp',
        cardBackImage: './assets/images/frame/card_backimage_demon.png',
        stageBackgrounds: {
            worldSetup: './assets/images/backgrounds/demon/world_setup.png',
            cyoa: './assets/images/backgrounds/demon/cyoa.png',
            reward: './assets/images/backgrounds/demon/reward.png',
        },
        theme: {
            accent: '#8a1225',
            accentHover: '#a61d33',
            accentStrong: '#c73c52',
            accentRgb: '138, 18, 37',
            accentStrongRgb: '199, 60, 82',
            ink: '#080102',
            panelRgb: '16, 4, 6',
        },
    },
    {
        id: 'mountain_spirit',
        name: '산신령',
        description: '이 땅을 조용히 수호해 온 유구한 정령. 온화하고 지혜로운 충고로 갈 길을 일깨워 줍니다.',
        portraitImage: './assets/images/narrators/mountain_spirit/mountain_spirit.webp',
        standingImage: './assets/images/narrators/mountain_spirit/mountain_spirit_standing_clear.png',
        tableImage: './assets/images/stage/mountain_spirit_wood_table.png',
        cardFrameImage: './assets/images/frame/card_frame_mountain_spirit.webp',
        cardBackImage: './assets/images/frame/card_backimage_mountain_spirit.png',
        stageBackgrounds: {
            worldSetup: './assets/images/backgrounds/mountain_spirit/world_setup.png',
            cyoa: './assets/images/backgrounds/mountain_spirit/cyoa.png',
            reward: './assets/images/backgrounds/mountain_spirit/reward.png',
        },
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
        cardFrameImage: './assets/images/frame/card_frame_vengeful_spirit.webp',
        cardBackImage: './assets/images/frame/card_backimage_vengeful_spirit.png',
        stageBackgrounds: {
            worldSetup: './assets/images/backgrounds/vengeful_spirit/world_setup.png',
            cyoa: './assets/images/backgrounds/vengeful_spirit/cyoa.png',
            reward: './assets/images/backgrounds/vengeful_spirit/reward.png',
        },
        theme: {
            accent: '#82628c',
            accentHover: '#9e7da9',
            accentStrong: '#c4adc9',
            accentRgb: '130, 98, 140',
            accentStrongRgb: '196, 173, 201',
            ink: '#050207',
            panelRgb: '12, 10, 15',
        },
    },
    {
        id: 'ai_avatar',
        name: '초지능 AI',
        description: '시공간의 잔재로 이루어진 인공지능 아바타. 냉철하고 객관적인 시선으로 당신의 여정을 기록합니다.',
        portraitImage: './assets/images/narrators/ai_avatar/ai_avatar.webp',
        standingImage: './assets/images/narrators/ai_avatar/ai_avatar_standing.png',
        tableImage: './assets/images/stage/super_ai_chrome_table.png',
        cardFrameImage: './assets/images/frame/card_frame_ai_avatar.webp',
        cardBackImage: './assets/images/frame/card_backimage_ai_avatar.png',
        stageBackgrounds: {
            worldSetup: './assets/images/backgrounds/ai_avatar/world_setup.png',
            cyoa: './assets/images/backgrounds/ai_avatar/cyoa.png',
            reward: './assets/images/backgrounds/ai_avatar/reward.png',
        },
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
    NARRATOR_PROFILES.flatMap(profile => [
        profile.portraitImage,
        profile.standingImage,
        profile.tableImage,
        profile.cardFrameImage,
        profile.cardBackImage,
    ])
);

export const getNarratorStageBackground = (id: string | null | undefined, part: NarratorStagePart): string => {
    const profile = getNarratorProfile(id);
    return profile.stageBackgrounds?.[part] ?? DEFAULT_STAGE_BACKGROUNDS[part];
};

export const getNarratorCardAssets = (id?: string | null): NarratorCardAssets => {
    const profile = getNarratorProfile(id);

    return {
        frameImage: profile.cardFrameImage || DEFAULT_CARD_ASSETS.frameImage,
        backImage: profile.cardBackImage || DEFAULT_CARD_ASSETS.backImage,
    };
};

export const getNarratorCardAssetUrls = (): string[] => (
    Array.from(new Set([
        DEFAULT_CARD_ASSETS.frameImage,
        DEFAULT_CARD_ASSETS.backImage,
        ...NARRATOR_PROFILES.flatMap(profile => [profile.cardFrameImage, profile.cardBackImage]),
    ]))
);

export const getNarratorStageBackgroundUrls = (): string[] => (
    Array.from(new Set([
        ...Object.values(DEFAULT_STAGE_BACKGROUNDS),
        ...NARRATOR_PROFILES.flatMap(profile => (
            profile.stageBackgrounds ? Object.values(profile.stageBackgrounds) : []
        )),
    ]))
);
