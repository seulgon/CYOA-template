import type { TagInfo } from './types';

const REGION_TAGS = ['제국 북부', '제국 중앙', '제국 동부', '제국 남부', '제국 서부', '엘프 반도', '수인 섬', '마경', '마왕성'] as const;
const EVENT_TAGS = ['전투', '휴식', '이동', '마을', '조우', '특수', '상점', '퀘스트', '던전'] as const;

export const regionTags: Record<string, TagInfo> = Object.fromEntries(
  REGION_TAGS.map((tag) => [
    tag,
    {
      description: `${tag} 지역을 나타내는 태그입니다.`,
      category: 'region',
    },
  ])
);

export const eventTags: Record<string, TagInfo> = Object.fromEntries(
  EVENT_TAGS.map((tag) => [
    tag,
    {
      description: `${tag} 계열 이벤트를 나타내는 태그입니다.`,
      category: 'event',
    },
  ])
);
