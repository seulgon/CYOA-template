import type { TagInfo } from './types';

export const raceTags: Record<string, TagInfo> = {
    // ===== 종족 관련 태그 =====
    "인간": { description: "인간 종족입니다. 어디서나 환영받으며 다양한 직업에 적합합니다.", category: 'race' },
    "엘프": { description: "엘프 종족입니다. 숲과 마법에 친화적이지만 오만해 보일 수 있습니다.", category: 'race' },
    "드워프": { description: "드워프 종족입니다. 대지와 금속을 다루는 데 탁월합니다.", category: 'race' },
    "수인": { description: "수인 종족입니다. 동물적 특성을 지녀 빠르고 감각이 예민합니다.", category: 'race' },
    "오크": { description: "오크 종족입니다. 전투에 특화되었으나 지적 활동에는 서툽니다.", category: 'race' },
    "마인": { description: "마족의 피가 섞인 혼혈입니다. 강력하나 사회적으로 경계받습니다.", category: 'race' }
};
