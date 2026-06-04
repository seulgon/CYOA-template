export type SfxKey =
    | 'uiClick'
    | 'uiBack'
    | 'uiOpen'
    | 'uiClose'
    | 'cardSelect'
    | 'cardDeselect'
    | 'tabSwitch'
    | 'statAdjust'
    | 'confirm'
    | 'storyNext'
    | 'storySkip'
    | 'transition'
    | 'diceRoll'
    | 'combatSequence'
    | 'combatSwing'
    | 'combatHit'
    | 'combatBlock'
    | 'skillSuccess'
    | 'skillFail'
    | 'itemPickup'
    | 'goldGain'
    | 'itemEquip'
    | 'itemUse'
    | 'death';

export interface SfxDefinition {
    srcs: string[];
    volume: number;
    cooldownMs?: number;
    interrupt?: boolean;
    layers?: SfxLayer[];
}

export interface SfxLayer {
    srcs: string[];
    delayMs?: number;
    volume?: number;
}

const SFX_ROOT = './assets/sound/sfx';

export const sfxRegistry: Record<SfxKey, SfxDefinition> = {
    uiClick: {
        srcs: [`${SFX_ROOT}/ui/click_1.wav`, `${SFX_ROOT}/ui/click_2.wav`],
        volume: 0.35,
        cooldownMs: 60,
    },
    uiBack: {
        srcs: [`${SFX_ROOT}/ui/back.wav`],
        volume: 0.3,
        cooldownMs: 80,
    },
    uiOpen: {
        srcs: [`${SFX_ROOT}/story/book_open.wav`],
        volume: 0.45,
        cooldownMs: 150,
    },
    uiClose: {
        srcs: [`${SFX_ROOT}/story/book_close.wav`],
        volume: 0.4,
        cooldownMs: 150,
    },
    cardSelect: {
        srcs: [`${SFX_ROOT}/cards/draw_1.wav`, `${SFX_ROOT}/cards/draw_2.wav`],
        volume: 0.4,
        cooldownMs: 100,
    },
    cardDeselect: {
        srcs: [`${SFX_ROOT}/cards/fan.wav`],
        volume: 0.35,
        cooldownMs: 120,
    },
    tabSwitch: {
        srcs: [`${SFX_ROOT}/ui/tab_switch.wav`],
        volume: 0.35,
        cooldownMs: 150,
    },
    statAdjust: {
        srcs: [`${SFX_ROOT}/ui/stat_tick.wav`],
        volume: 0.3,
        cooldownMs: 70,
    },
    confirm: {
        srcs: [`${SFX_ROOT}/ui/confirm.wav`],
        volume: 0.45,
        cooldownMs: 200,
    },
    storyNext: {
        srcs: [`${SFX_ROOT}/story/page_turn.wav`],
        volume: 0.4,
        cooldownMs: 150,
    },
    storySkip: {
        srcs: [`${SFX_ROOT}/ui/back.wav`],
        volume: 0.3,
        cooldownMs: 200,
    },
    transition: {
        srcs: [`${SFX_ROOT}/story/book_open.wav`],
        volume: 0.5,
        cooldownMs: 200,
    },
    diceRoll: {
        srcs: [`${SFX_ROOT}/dice/roll_1.wav`, `${SFX_ROOT}/dice/roll_2.wav`, `${SFX_ROOT}/dice/roll_3.wav`, `${SFX_ROOT}/dice/roll_4.wav`],
        volume: 0.5,
        cooldownMs: 400,
    },
    combatSequence: {
        srcs: [],
        volume: 0.4,
        cooldownMs: 2800,
        layers: [
            {
                srcs: [`${SFX_ROOT}/combat/sword_unsheath_1.ogg`, `${SFX_ROOT}/combat/sword_unsheath_2.ogg`, `${SFX_ROOT}/combat/sword_sharpen.wav`, `${SFX_ROOT}/combat/sword_slice.wav`],
                volume: 0.78,
            },
            {
                srcs: [`${SFX_ROOT}/combat/sword_attack_1.ogg`, `${SFX_ROOT}/combat/sword_attack_2.ogg`, `${SFX_ROOT}/combat/sword_attack_3.ogg`, `${SFX_ROOT}/combat/sword_blocked_2.ogg`, `${SFX_ROOT}/combat/sword_blocked_3.ogg`],
                delayMs: 820,
                volume: 0.86,
            },
            {
                srcs: [`${SFX_ROOT}/combat/sword_parry_1.ogg`, `${SFX_ROOT}/combat/sword_parry_2.ogg`, `${SFX_ROOT}/combat/sword_parry_3.ogg`, `${SFX_ROOT}/combat/sword_clash.wav`, `${SFX_ROOT}/combat/sword_clash_2.wav`],
                delayMs: 1120,
                volume: 1.05,
            },
            {
                srcs: [`${SFX_ROOT}/combat/sword_parry_1.ogg`, `${SFX_ROOT}/combat/sword_parry_2.ogg`, `${SFX_ROOT}/combat/sword_parry_3.ogg`, `${SFX_ROOT}/combat/sword_clash.wav`, `${SFX_ROOT}/combat/sword_clash_2.wav`],
                delayMs: 1420,
                volume: 1.05,
            },
            {
                srcs: [`${SFX_ROOT}/combat/sword_attack_1.ogg`, `${SFX_ROOT}/combat/sword_attack_2.ogg`, `${SFX_ROOT}/combat/sword_attack_3.ogg`, `${SFX_ROOT}/combat/sword_blocked_2.ogg`, `${SFX_ROOT}/combat/sword_blocked_3.ogg`],
                delayMs: 2100,
                volume: 0.86,
            },
            {
                srcs: [`${SFX_ROOT}/combat/sword_parry_1.ogg`, `${SFX_ROOT}/combat/sword_parry_2.ogg`, `${SFX_ROOT}/combat/sword_parry_3.ogg`, `${SFX_ROOT}/combat/sword_clash.wav`, `${SFX_ROOT}/combat/sword_clash_2.wav`],
                delayMs: 2500,
                volume: 1.05,
            },
            {
                srcs: [`${SFX_ROOT}/combat/sword_parry_1.ogg`, `${SFX_ROOT}/combat/sword_parry_2.ogg`, `${SFX_ROOT}/combat/sword_parry_3.ogg`, `${SFX_ROOT}/combat/sword_clash.wav`, `${SFX_ROOT}/combat/sword_clash_2.wav`],
                delayMs: 2920,
                volume: 1.05,
            },
        ],
    },
    combatSwing: {
        srcs: [`${SFX_ROOT}/combat/sword_attack_1.ogg`, `${SFX_ROOT}/combat/sword_attack_2.ogg`, `${SFX_ROOT}/combat/sword_attack_3.ogg`],
        volume: 0.24,
        cooldownMs: 220,
        layers: [
            {
                srcs: [`${SFX_ROOT}/combat/sword_unsheath_1.ogg`, `${SFX_ROOT}/combat/sword_unsheath_2.ogg`, `${SFX_ROOT}/combat/sword_sharpen.wav`, `${SFX_ROOT}/combat/sword_slice.wav`],
                volume: 0.7,
            },
            {
                srcs: [`${SFX_ROOT}/combat/sword_attack_1.ogg`, `${SFX_ROOT}/combat/sword_attack_2.ogg`, `${SFX_ROOT}/combat/sword_attack_3.ogg`],
                delayMs: 42,
            },
            {
                srcs: [`${SFX_ROOT}/combat/sword_attack_1.ogg`, `${SFX_ROOT}/combat/sword_attack_2.ogg`, `${SFX_ROOT}/combat/sword_attack_3.ogg`],
                delayMs: 92,
                volume: 0.65,
            },
        ],
    },
    combatHit: {
        srcs: [`${SFX_ROOT}/combat/sword_attack_1.ogg`, `${SFX_ROOT}/combat/sword_attack_2.ogg`, `${SFX_ROOT}/combat/sword_attack_3.ogg`, `${SFX_ROOT}/combat/sword_blocked_2.ogg`, `${SFX_ROOT}/combat/sword_blocked_3.ogg`],
        volume: 0.28,
        cooldownMs: 230,
        layers: [
            {
                srcs: [`${SFX_ROOT}/combat/sword_parry_1.ogg`, `${SFX_ROOT}/combat/sword_parry_2.ogg`, `${SFX_ROOT}/combat/sword_parry_3.ogg`, `${SFX_ROOT}/combat/sword_clash.wav`, `${SFX_ROOT}/combat/sword_clash_2.wav`],
                volume: 0.75,
            },
            {
                srcs: [`${SFX_ROOT}/combat/sword_attack_1.ogg`, `${SFX_ROOT}/combat/sword_attack_2.ogg`, `${SFX_ROOT}/combat/sword_attack_3.ogg`, `${SFX_ROOT}/combat/sword_blocked_2.ogg`, `${SFX_ROOT}/combat/sword_blocked_3.ogg`],
                delayMs: 36,
            },
            {
                srcs: [`${SFX_ROOT}/combat/sword_parry_1.ogg`, `${SFX_ROOT}/combat/sword_parry_2.ogg`, `${SFX_ROOT}/combat/sword_parry_3.ogg`, `${SFX_ROOT}/combat/sword_clash.wav`, `${SFX_ROOT}/combat/sword_clash_2.wav`],
                delayMs: 86,
                volume: 0.62,
            },
        ],
    },
    combatBlock: {
        srcs: [`${SFX_ROOT}/combat/sword_parry_1.ogg`, `${SFX_ROOT}/combat/sword_parry_2.ogg`, `${SFX_ROOT}/combat/sword_parry_3.ogg`, `${SFX_ROOT}/combat/sword_clash.wav`, `${SFX_ROOT}/combat/sword_clash_2.wav`],
        volume: 0.26,
        cooldownMs: 230,
        layers: [
            {
                srcs: [`${SFX_ROOT}/combat/sword_parry_1.ogg`, `${SFX_ROOT}/combat/sword_parry_2.ogg`, `${SFX_ROOT}/combat/sword_parry_3.ogg`, `${SFX_ROOT}/combat/sword_clash.wav`, `${SFX_ROOT}/combat/sword_clash_2.wav`],
            },
            {
                srcs: [`${SFX_ROOT}/combat/sword_parry_1.ogg`, `${SFX_ROOT}/combat/sword_parry_2.ogg`, `${SFX_ROOT}/combat/sword_parry_3.ogg`, `${SFX_ROOT}/combat/sword_clash.wav`, `${SFX_ROOT}/combat/sword_clash_2.wav`],
                delayMs: 44,
                volume: 0.72,
            },
            {
                srcs: [`${SFX_ROOT}/combat/sword_parry_1.ogg`, `${SFX_ROOT}/combat/sword_parry_2.ogg`, `${SFX_ROOT}/combat/sword_parry_3.ogg`, `${SFX_ROOT}/combat/sword_clash.wav`, `${SFX_ROOT}/combat/sword_clash_2.wav`],
                delayMs: 92,
                volume: 0.58,
            },
        ],
    },
    skillSuccess: {
        srcs: [`${SFX_ROOT}/ui/success.wav`],
        volume: 0.4,
        cooldownMs: 180,
    },
    skillFail: {
        srcs: [`${SFX_ROOT}/ui/failure.wav`],
        volume: 0.35,
        cooldownMs: 160,
    },
    itemPickup: {
        srcs: [`${SFX_ROOT}/ui/confirm.wav`],
        volume: 0.35,
        cooldownMs: 120,
    },
    goldGain: {
        srcs: [`${SFX_ROOT}/items/gold_gain.wav`],
        volume: 0.45,
        cooldownMs: 120,
    },
    itemEquip: {
        srcs: [`${SFX_ROOT}/items/item_equip.wav`],
        volume: 0.4,
        cooldownMs: 140,
    },
    itemUse: {
        srcs: [`${SFX_ROOT}/items/item_equip.wav`],
        volume: 0.35,
        cooldownMs: 160,
    },
    death: {
        srcs: [`${SFX_ROOT}/combat/sword_attack_1.ogg`, `${SFX_ROOT}/combat/sword_attack_2.ogg`, `${SFX_ROOT}/combat/sword_attack_3.ogg`, `${SFX_ROOT}/combat/sword_blocked_2.ogg`, `${SFX_ROOT}/combat/sword_blocked_3.ogg`],
        volume: 0.3,
        cooldownMs: 500,
    },
};
