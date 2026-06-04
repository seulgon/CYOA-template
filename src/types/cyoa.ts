export type StatModifier = {
    POW?: number; // Power (Strength + Agility) - 근력
    SEN?: number; // Sense (Perception + Evasion) - 감각
    INT?: number;
    CON?: number;
    WIL?: number; // Willpower - 의지
    CHA?: number;
    LUK?: number;
    [key: string]: number | undefined;
};

// Equipment combat stat scaling weights
export type ScalingWeights = Partial<Record<'POW' | 'SEN' | 'INT' | 'CON' | 'WIL' | 'CHA' | 'LUK', number>>;

export interface EquipmentStats {
    baseAtk?: number;      // 아이템 고유 공격력
    baseDef?: number;      // 아이템 고유 방어력
    scaling?: {
        atk?: ScalingWeights;  // 공격력에 대한 스탯별 가중치
        def?: ScalingWeights;  // 방어력에 대한 스탯별 가중치
    };
    atkMultiplier?: number;  // 장신구: 공격력 곱연산 (0.1 = +10%)
    defMultiplier?: number;  // 장신구: 방어력 곱연산
    grantTags?: string[];    // 장신구: 장착 시 부여할 태그
}

import type { ConsumableEffect } from './consumable';

export interface Choice {
    id: string;
    adjustableStat?: 'POW' | 'SEN' | 'INT' | 'CON' | 'WIL' | 'CHA' | 'LUK';
    name: string;
    description: string;
    comment?: string;
    cost: number; // 양수: 포인트 소모, 음수: 포인트 획득
    stats?: StatModifier;
    tags?: (string | { name: string; desc: string })[];
    prerequisites?: string[]; // 선택하기 위해 필요한 다른 Choice ID
    requiredTags?: string[];  // 필수 태그 (AND 조건)
    requiredAnyTag?: string[]; // 태그 중 하나라도 필요 (OR 조건)
    incompatible?: string[];  // 같이 선택할 수 없는 Choice ID

    group?: string; // 같은 섹션 내에서의 하위 그룹 (예: 신체 섹션 내 '머리색', '눈색' 등) 
    multiSelectGroup?: boolean; // 그룹 내 중복 선택 허용 여부 (기본값: false - 하나만 선택)
    secret?: boolean | 'partial'; // 조건 미달 시 화면에서 완전히 숨김 여부 (true: 충분조건, 'partial': 필요조건)
    freeWithTag?: string[]; // 이 태그 중 하나라도 보유하면 비용이 0이 됨
    discounts?: { tag: string; amount: number }[]; // 태그 보유 시 할인받을 금액 (예: { tag: "드워프", amount: 10 })
    grantsChoices?: string[]; // 선택 시 무료로 함께 선택되는 다른 선택지 ID들 (예: 종족 보너스)
    rewardItem?: string; // 선택 시 획득하는 아이템 이름
    rewardItemType?: 'equipment' | 'consumable'; // 아이템 종류
    image?: string; // 선택지 이미지 경로
    selectedImage?: string; // 선택 시 표시할 이미지 경로
    useFrame?: boolean; // 이미지를 카드 프레임 안에 렌더링할지 여부
    consumableEffect?: ConsumableEffect; // 소모품 효과 (모험 파트용)
    combatBonus?: {                 // 전투력 보너스 (ATK/DEF 가산)
        atk?: number;              // 공격력 고정 가산
        def?: number;              // 방어력 고정 가산
    };
    autoSelect?: boolean; // 조건 충족 시 자동 선택 여부
}

export interface Section {
    id: string;
    title: string;
    description?: string;
    choices: Choice[];
    type: 'single' | 'multi'; // single: 하나만 선택 (예: 출신), multi: 여러 개 선택 (예: 아이템)
    required?: boolean; // 필수 선택 여부
    requiredGroups?: string[]; // New: 섹션 내 필수 선택 그룹 목록 (예: ["성별", "나이"])
    groupTitles?: Record<string, string>; // 그룹 ID → 표시 이름 매핑 (예: { "alignment_axis1": "규범의 축" })
}

export interface CYOAData {
    title: string;
    initialPoints: number;
    sections: Section[];
}
