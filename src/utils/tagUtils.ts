import { initialCYOAData } from '../data/cyoa';

// 태그 설명 캐시 (메모이제이션)
let tagDescriptionCache: Record<string, string> | null = null;

/**
 * 모든 섹션을 순회하며 태그 설명을 수집하여 맵을 생성합니다.
 */
const buildTagDescriptionMap = (): Record<string, string> => {
    const map: Record<string, string> = {};

    initialCYOAData.sections.forEach(section => {
        section.choices.forEach(choice => {
            // 1. Choice 자체가 태그로 사용되는 경우 (예: 종족명, 신앙명)
            if (!map[choice.name]) {
                map[choice.name] = choice.description;
            }

            // 2. tags 배열 순회
            if (choice.tags) {
                choice.tags.forEach(tag => {
                    if (typeof tag === 'string') {
                        // 문자열 태그인 경우 (예: "무신론자")
                        // 해당 태그에 아직 설명이 없다면 Choice의 설명을 할당
                        if (!map[tag]) {
                            map[tag] = choice.description;
                        }
                    } else {
                        // 객체형 태그 ({ name, desc })인 경우 - 가장 우선순위 높음
                        map[tag.name] = tag.desc;
                    }
                });
            }
        });
    });

    return map;
};

/**
 * 태그 이름을 입력받아 설명을 반환합니다.
 * 설명이 없으면 null을 반환합니다.
 * @param tagName 태그 이름
 */
export const getTagDescription = (tagName: string): string | null => {
    if (!tagDescriptionCache) {
        tagDescriptionCache = buildTagDescriptionMap();
    }
    return tagDescriptionCache[tagName] || null;
};
