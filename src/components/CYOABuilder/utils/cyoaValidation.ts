import { initialCYOAData } from '../../../data/cyoa';
import { getStatLabel } from '../../../utils/statUtils';

export const validateCyoaBuilder = (
    selectedChoices: Set<string>,
    currentPoints: number,
    currentStats: Record<string, number>,
) => {
    // 임시로 모든 유효성 검사 제한 조건을 비활성화합니다.
    return {
        isValid: true,
        errors: [],
    };
};
