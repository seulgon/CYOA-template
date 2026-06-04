import type React from 'react';
import { BarChart2, Info, X } from 'lucide-react';
import { initialCYOAData } from '../../data/cyoa';
import type { StatModifier } from '../../types/cyoa';
import { getStatLabel } from '../../utils/statUtils';

type StatBreakdownVariant = 'builder' | 'sheet' | 'adventure' | 'ending';
type EquippedItems = {
    mainHand: string | null;
    offHand: string | null;
    armor: string | null;
    head: string | null;
    waist: string | null;
    feet: string | null;
    back: string | null;
    accessories: string[];
};

interface StatBreakdownModalProps {
    statKey: string;
    stats: StatModifier;
    equipped: EquippedItems;
    onClose: () => void;
    variant: StatBreakdownVariant;
    finalStats?: StatModifier;
    choiceIds?: string[];
    statAdjustments?: Partial<Record<string, number>>;
}

const MAIN_STATS = ['POW', 'SEN', 'INT', 'CON', 'WIL', 'CHA', 'LUK'];

const getFinalStatsFromDeltas = (stats: StatModifier): StatModifier => {
    const computedStats: StatModifier = { POW: 10, SEN: 10, INT: 10, CON: 10, WIL: 10, CHA: 10, LUK: 10 };
    Object.entries(stats).forEach(([key, value]) => {
        computedStats[key] = (computedStats[key] || 10) + (value || 0);
    });
    return computedStats;
};

const StatBreakdownModal: React.FC<StatBreakdownModalProps> = ({
    statKey,
    stats,
    onClose,
    variant,
    finalStats,
    choiceIds = [],
    statAdjustments = {}
}) => {
    let title = "";
    let base = 0;
    const additions: { label: string; value: number }[] = [];
    let total = 0;
    const isMainStat = MAIN_STATS.includes(statKey);
    const HeaderIcon = variant === 'adventure' ? BarChart2 : Info;

    if (variant === 'adventure') {
        if (isMainStat) {
            title = `${getStatLabel(statKey)} 상세 내역`;
            base = 10;
            total = stats[statKey] || 10;
            const bonus = total - 10;
            if (bonus !== 0) {
                additions.push({ label: '초기 선택 보너스', value: bonus });
            }
        } else if (statKey === 'HP') {
            title = "최대 생명력(HP) 상세 내역";
            const con = stats.CON || 10;
            base = 0;
            additions.push({ label: `건강(${con}) x 10`, value: con * 10 });
            total = con * 10;
        } else if (statKey === 'Sanity') {
            title = "최대 정신력(Sanity) 상세 내역";
            const wil = stats.WIL || 10;
            base = 0;
            additions.push({ label: `의지(${wil}) x 10`, value: wil * 10 });
            total = wil * 10;
        }
    } else {
        const isBuilder = variant === 'builder';
        const isEnding = variant === 'ending';
        const combatStats = finalStats ?? getFinalStatsFromDeltas(stats);

        if (isMainStat) {
            title = `${getStatLabel(statKey)} 상세 내역`;
            base = 10;
            if (isEnding) {
                const bonus = stats[statKey] || 0;
                total = base + bonus;
                if (bonus !== 0) {
                    additions.push({ label: "선택지/보너스 합계", value: bonus });
                }
            } else {
                total = base;
                initialCYOAData.sections.forEach(section => {
                    section.choices.forEach(choice => {
                        if (choiceIds.includes(choice.id) && choice.stats?.[statKey]) {
                            additions.push({ label: choice.name, value: choice.stats[statKey]! });
                            total += choice.stats[statKey]!;
                        }
                    });
                });
                if (isBuilder) {
                    const adjustment = statAdjustments[statKey] || 0;
                    if (adjustment !== 0) {
                        additions.push({ label: "능력치 조정", value: adjustment });
                        total += adjustment;
                    }
                }
            }
        } else if (statKey === 'HP') {
            title = "최대 생명력(HP) 상세 내역";
            if (isEnding) {
                base = 100;
                const con = combatStats.CON || 10;
                const conBonus = con * 10;
                additions.push({ label: `건강(CON) 보정 (${con} x 10)`, value: conBonus });
                total = base + conBonus;
            } else {
                base = 0;
                const conBonus = (10 + (stats['CON'] || 0)) * 10;
                additions.push({ label: `건강(${10 + (stats['CON'] || 0)}) x 10`, value: conBonus });
                total = conBonus;
            }
        } else if (statKey === 'Sanity') {
            title = "최대 정신력(Sanity) 상세 내역";
            if (isEnding) {
                base = 100;
                const wil = combatStats.WIL || 10;
                const wilBonus = wil * 10;
                additions.push({ label: `정신(WIL) 보정 (${wil} x 10)`, value: wilBonus });
                total = base + wilBonus;
            } else {
                base = 0;
                const wilBonus = (10 + (stats['WIL'] || 0)) * 10;
                additions.push({ label: `의지(${10 + (stats['WIL'] || 0)}) x 10`, value: wilBonus });
                total = wilBonus;
            }
        } else if (statKey === 'Gold') {
            title = "보유 금전(Gold) 상세 내역";
            base = 100;
            total = base;
            initialCYOAData.sections.forEach(section => {
                section.choices.forEach(choice => {
                    if (choiceIds.includes(choice.id) && choice.stats?.['Gold']) {
                        additions.push({ label: choice.name, value: choice.stats['Gold']! });
                        total += choice.stats['Gold']!;
                    }
                });
            });
        }
    }

    const isKnownSheetStat = isMainStat || ['HP', 'Sanity', 'Gold'].includes(statKey);

    return (
        <div className="stat-modal-overlay" onClick={onClose}>
            <div className="stat-modal-content" onClick={e => e.stopPropagation()}>
                <div className="stat-modal-header">
                    <h3><HeaderIcon size={variant === 'adventure' ? 18 : 20} /> {variant === 'adventure' ? (title || statKey) : title}</h3>
                    <button className="stat-modal-close" onClick={onClose}><X size={20} /></button>
                </div>
                <div className="stat-modal-body">
                    {variant === 'adventure' ? (
                        <>
                            {isKnownSheetStat && (
                                <>
                                    {(base !== 0 || !['HP', 'Sanity'].includes(statKey)) && (
                                        <div className="stat-line base">
                                            <span>기본 수치</span>
                                            <span>{base}</span>
                                        </div>
                                    )}
                                    {additions.map((add, idx) => (
                                        <div key={idx} className={`stat-line ${add.value >= 0 ? 'plus' : 'minus'}`}>
                                            <span>{add.label}</span>
                                            <span>{add.value >= 0 ? '+' : ''}{add.value}</span>
                                        </div>
                                    ))}
                                </>
                            )}

                            {!isKnownSheetStat && (
                                <div style={{ color: '#ccc', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
                                    상세 계산식 표시는 아직 구현되지 않았습니다.<br />
                                    (현재 값: {total})
                                </div>
                            )}
                            <div className="stat-line total">
                                <span>최종 합계</span>
                                <span>{total}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            {(base !== 0 || !['HP', 'Sanity'].includes(statKey)) && (
                                <div className="stat-line base">
                                    <span>기본값</span>
                                    <span>{base}</span>
                                </div>
                            )}
                            {additions.map((adj, i) => (
                                <div key={i} className={`stat-line ${adj.value >= 0 ? 'plus' : 'minus'}`}>
                                    <span>{adj.label}</span>
                                    <span>{adj.value >= 0 ? `+${adj.value}` : adj.value}</span>
                                </div>
                            ))}
                            <div className="stat-line total">
                                <span>최종 수치</span>
                                <span>{total}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatBreakdownModal;
