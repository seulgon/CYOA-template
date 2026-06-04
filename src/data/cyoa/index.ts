import type { CYOAData } from '../../types/cyoa';

import { raceSection } from './races';
import { faithSection } from './faiths';
import { bodySection } from './body';

export const initialCYOAData: CYOAData = {
    title: "템플릿 핵심 UI 및 기능 테스트",
    initialPoints: 100,
    sections: [
        raceSection,
        faithSection,
        bodySection
    ]
};
