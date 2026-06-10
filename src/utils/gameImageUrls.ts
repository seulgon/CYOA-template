import { CUTSCENE_DATA } from '../data/cutscenes/cutsceneData';
import { initialCYOAData } from '../data/cyoa';
import { getNarratorCardAssetUrls, getNarratorImageUrls, getNarratorStageBackgroundUrls } from '../data/narrators';
import { normalizeImageUrl } from './imagePreloader';

export const CRITICAL_IMAGE_URLS = [
  './assets/images/intro/1.webp',
  './assets/images/intro/noimage.webp',
  './assets/images/frame/card_frame.webp',
  './assets/images/frame/card_backimage.webp',
  './assets/images/intro/violet_intro.webp',
];

const STAGE_LAYER_URLS = [
  './assets/images/intro/violet_standing_dark_clear.png',
];

const uniqueUrls = (urls: Array<string | null | undefined>): string[] => (
  Array.from(new Set(urls.filter((url): url is string => !!url).map(normalizeImageUrl).filter(Boolean)))
);

export const getCutsceneImageUrls = (cutsceneId?: string): string[] => {
  const cutscenes = cutsceneId
    ? [CUTSCENE_DATA[cutsceneId]].filter(Boolean)
    : Object.values(CUTSCENE_DATA);

  return uniqueUrls(
    cutscenes.flatMap(cutscene => (
      cutscene.frames.map(frame => frame.backgroundImage)
    ))
  );
};

export const getCyoaImageUrls = (): string[] => (
  uniqueUrls(
    initialCYOAData.sections.flatMap(section => (
      section.choices.flatMap(choice => [choice.image, choice.selectedImage])
    ))
  )
);

export const getCyoaSectionImageUrls = (sectionId: string): string[] => {
  const section = initialCYOAData.sections.find(section => section.id === sectionId);
  if (!section) return [];

  return uniqueUrls(
    section.choices.flatMap(choice => [choice.image, choice.selectedImage])
  );
};

export const getFirstCyoaSectionImageUrls = (): string[] => {
  const firstSection = initialCYOAData.sections[0];
  return firstSection ? getCyoaSectionImageUrls(firstSection.id) : [];
};

export const getAllGameImageUrls = (): string[] => (
  uniqueUrls([
    ...CRITICAL_IMAGE_URLS,
    ...getNarratorCardAssetUrls(),
    ...getNarratorStageBackgroundUrls(),
    ...STAGE_LAYER_URLS,
    ...getNarratorImageUrls(),
    ...getCutsceneImageUrls(),
    ...getCyoaImageUrls(),
  ])
);

export const getPhaseImageUrls = (phase: string): string[] => {
  switch (phase) {
    case 'INTRO':
      return CRITICAL_IMAGE_URLS;
    case 'INTRO_STORY':
      return getCutsceneImageUrls('INTRO_STORY');
    case 'CYOA_STORY':
      return uniqueUrls([
        ...getCutsceneImageUrls('CYOA_STORY'),
        ...getFirstCyoaSectionImageUrls(),
      ]);
    case 'CYOA_BUILD':
      return uniqueUrls([
        ...getNarratorStageBackgroundUrls(),
        ...getNarratorCardAssetUrls(),
        ...STAGE_LAYER_URLS,
        ...getNarratorImageUrls(),
        ...getFirstCyoaSectionImageUrls(),
      ]);
    case 'WORLD_SETUP':
      return uniqueUrls([
        ...getNarratorStageBackgroundUrls(),
        ...STAGE_LAYER_URLS,
        ...getNarratorImageUrls(),
      ]);
    case 'LOCATION_CUTSCENE':
      return getCutsceneImageUrls('LOCATION_CUTSCENE');
    case 'REWARD_SELECT':
      return uniqueUrls([
        ...getNarratorStageBackgroundUrls(),
        ...STAGE_LAYER_URLS,
        ...getNarratorImageUrls(),
      ]);
    default:
      return [];
  }
};
