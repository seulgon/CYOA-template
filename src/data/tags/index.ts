import type { TagCategory, TagInfo } from './types';
import { raceTags } from './raceTags';
import { fateTags } from './fateTags';
import { eventTags, regionTags } from './regionEventTags';

export * from './types';

export const categoryInfo: Record<TagCategory, { label: string; color: string; defaultIcon?: string }> = {
    race: { label: '종족', color: '#6a8a9a', defaultIcon: 'User' },
    ability: { label: '생활기술', color: '#7a9a7c', defaultIcon: 'Sparkles' },
    battle_skill: { label: '전투기술', color: '#b38b6d', defaultIcon: 'Swords' },
    job: { label: '직업', color: '#ebc050', defaultIcon: 'Briefcase' },
    faith: { label: '신앙', color: '#8a7a92', defaultIcon: 'Church' },
    alignment: { label: '성향', color: '#9b7a5a', defaultIcon: 'Compass' },
    fate: { label: '운명', color: '#9a7a85', defaultIcon: 'Dna' },
    body: { label: '신체', color: '#b36d80', defaultIcon: 'Heart' },
    sexuality: { label: '욕망', color: '#d94c73', defaultIcon: 'Flame' },
    trait: { label: '특징', color: '#5c7c8a', defaultIcon: 'Fingerprint' },
    weapon: { label: '무기', color: '#c0392b', defaultIcon: 'Sword' },
    armor_equip: { label: '방어구', color: '#2980b9', defaultIcon: 'Shield' },
    tool: { label: '도구', color: '#8e7cc3', defaultIcon: 'Wrench' },
    consumable: { label: '소모품', color: '#27ae60', defaultIcon: 'FlaskConical' },
    region: { label: '지역', color: '#4fa3a5', defaultIcon: 'MapPin' },
    event: { label: '이벤트', color: '#b7791f', defaultIcon: 'ScrollText' },
    other: { label: '기타', color: '#7a8488', defaultIcon: 'Tag' },
};

export const tagData: Record<string, TagInfo> = {
    ...raceTags,
    ...fateTags,
    ...regionTags,
    ...eventTags,
};

export const getTagInfo = (tag: string): TagInfo => {
    return tagData[tag] || {
        description: `#${tag} 태그입니다.`,
        category: 'other' as TagCategory,
    };
};

export const getTagDescription = (tag: string): string => {
    return tagData[tag]?.description || `#${tag} 태그입니다.`;
};
