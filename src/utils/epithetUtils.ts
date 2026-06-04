/**
 * 월드셋업 선택지를 기반으로 캐릭터 이명 생성
 * @param worldSetupChoices - 선택된 월드셋업 선택지 ID 배열
 * @returns 생성된 이명 (예: "소환된 전이자")
 */
export function generateEpithet(worldSetupChoices: string[]): string {
    if (!worldSetupChoices || worldSetupChoices.length === 0) return '선택받은 방랑자';

    // 초대자 선택지 ID 리스트
    const inviterIds = [
        'inviter_collision', 'inviter_wish', 'inviter_ritual',
        'inviter_pantheon', 'inviter_elder'
    ];

    // 기원 선택지 ID 리스트
    const originIds = [
        'transmigrator', 'reincarnator', 'possession',
        'experiment', 'contractor', 'dimension_wanderer'
    ];

    const inviterChoice = worldSetupChoices.find(id => inviterIds.includes(id));
    const originChoice = worldSetupChoices.find(id => originIds.includes(id));

    const prefix = INVITER_EPITHETS[inviterChoice || ''] || '알 수 없는';
    const title = ORIGIN_EPITHETS[originChoice || ''] || '방랑자';

    return `${prefix} ${title}`;
}

// 이명 매핑 데이터
const INVITER_EPITHETS: Record<string, string> = {
    'inviter_collision': '우연히 도착한',
    'inviter_wish': '소망받은',
    'inviter_ritual': '소환된',
    'inviter_pantheon': '초대받은',
    'inviter_elder': '부름받은'
};

const ORIGIN_EPITHETS: Record<string, string> = {
    'transmigrator': '전이자',
    'reincarnator': '환생자',
    'possession': '빙의자',
    'experiment': '실험체',
    'contractor': '계약자',
    'dimension_wanderer': '방랑자'
};
