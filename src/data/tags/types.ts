export type TagCategory =
    | 'race'
    | 'ability'
    | 'battle_skill'
    | 'job'
    | 'faith'
    | 'alignment'
    | 'sexuality'
    | 'fate'
    | 'body'
    | 'trait'
    | 'weapon'
    | 'armor_equip'
    | 'tool'
    | 'consumable'
    | 'region'
    | 'event'
    | 'other';

export interface TagInfo {
    description: string;
    category: TagCategory;
}
