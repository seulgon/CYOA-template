import type React from 'react';
import { Brain, Coins, Heart, Shield, Sword } from 'lucide-react';
import { getStatLabel } from '../../utils/statUtils';

interface CharacterStatsProps {
    stats: Record<string, number>;
    maxHP: number;
    maxMP: number;
    gold: number;
    setBreakdownStat: (stat: string) => void;
    enableGoldBreakdown?: boolean;
}

const CharacterStats: React.FC<CharacterStatsProps> = ({
    stats,
    maxHP,
    maxMP,
    gold,
    setBreakdownStat,
    enableGoldBreakdown = true
}) => (
    <>
        <div className="char-sheet-section">
            <h3>2. 기본 능력치</h3>
            <div className="char-sheet-stats-grid">
                {['POW', 'SEN', 'INT', 'CHA', 'CON', 'WIL', 'LUK'].map(key => {
                    const val = stats[key] || 0;
                    const finalVal = 10 + val;
                    const color = val > 0 ? 'var(--accent-color)' : (val < 0 ? 'var(--danger-color)' : 'var(--text-secondary)');
                    return (
                        <div
                            key={key}
                            className="stat-box"
                            onClick={() => setBreakdownStat(key)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{getStatLabel(key)}</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: color }}>{finalVal}</div>
                        </div>
                    );
                })}
            </div>
        </div>

        <div className="char-sheet-section">
            <h3>3. 상태 및 전투 정보</h3>
            <div style={{ display: 'flex', justifyContent: 'space-around', gap: '1rem', flexWrap: 'wrap' }}>
                <div
                    className="sheet-stat-item stat-hp"
                    onClick={() => setBreakdownStat('HP')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <Heart size={24} color="var(--danger-color)" />
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>체력</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{maxHP}</div>
                    </div>
                </div>
                <div
                    className="sheet-stat-item stat-sanity"
                    onClick={() => setBreakdownStat('Sanity')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <Brain size={24} color="#90caf9" />
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>정신력</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{maxMP}</div>
                    </div>
                </div>
                <div
                    className="sheet-stat-item stat-gold"
                    onClick={() => {
                        if (enableGoldBreakdown) setBreakdownStat('Gold');
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: enableGoldBreakdown ? 'pointer' : 'default', transition: 'all 0.2s' }}
                >
                    <Coins size={24} color="var(--accent-color)" />
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>소지금</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{gold} G</div>
                    </div>
                </div>

                <div className="mobile-break" style={{ width: '100%', flexBasis: '100%' }}></div>


            </div>
        </div>
    </>
);

export default CharacterStats;
