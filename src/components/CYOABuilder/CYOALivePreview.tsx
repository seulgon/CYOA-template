import type React from 'react';
import { Heart, Brain, Coins, Tag, Sparkles } from 'lucide-react';
import type { Choice } from '../../types/cyoa';
import { getStatLabel } from '../../utils/statUtils';
import TagTooltip from '../common/TagTooltip';
import type { CYOABuilderViewModel } from './useCYOABuilder';

interface CYOALivePreviewProps {
    builder: CYOABuilderViewModel;
}

const CYOALivePreview: React.FC<CYOALivePreviewProps> = ({ builder }) => {
    const {
        isStatusBarCollapsed,
        currentStats,
        currentTagsWithEquip,
        allSelectedSkills,
        isInfoOpen,
        setBreakdownStat,
        playSfx
    } = builder;

    return (
        <>
            <div className="cyoa-live-preview">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="cyoa-preview-content stat-group-container-flex" style={{ display: isStatusBarCollapsed ? 'none' : 'flex', flex: 1, justifyContent: 'space-between' }}>
                        <div className="stat-group-main-row" style={{ display: 'flex', gap: '0.4rem', borderRight: '1px solid var(--border-color)', paddingRight: '1rem', alignItems: 'center' }}>
                            {['POW', 'SEN', 'INT', 'CHA', 'CON', 'WIL', 'LUK'].map(key => {
                                const val = currentStats[key] || 0;
                                const finalVal = 10 + val;
                                const color = val > 0 ? 'var(--accent-color)' : (val < 0 ? 'var(--danger-color)' : 'var(--text-primary)');

                                return (
                                    <span
                                        key={key}
                                        className="stat-item-text"
                                        style={{ color: 'var(--text-secondary)', cursor: 'help', padding: '2px 4px', borderRadius: '4px', transition: 'background 0.2s' }}
                                        onClick={() => setBreakdownStat(key)}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        {getStatLabel(key)} <span className="stat-item-inner-value" style={{ color: color, fontWeight: 'bold' }}>{finalVal}</span>
                                    </span>
                                );
                            })}
                        </div>

                        <div className="stat-group-derived-row" style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                            <div
                                className="stat-item-clickable stat-item-text stat-hp"
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'help' }}
                                onClick={() => setBreakdownStat('HP')}
                            >
                                <Heart className="stat-icon-mini" size={18} color="var(--danger-color)" />
                                <span className="stat-item-inner-value" style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--text-primary)' }}>
                                    {100 + ((currentStats['CON'] || 0) * 10)}
                                </span>
                            </div>
                            <div
                                className="stat-item-clickable stat-item-text stat-sanity"
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'help' }}
                                onClick={() => setBreakdownStat('Sanity')}
                            >
                                <Brain className="stat-icon-mini" size={18} color="#90caf9" />
                                <span className="stat-item-inner-value" style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--text-primary)' }}>
                                    {100 + ((currentStats['WIL'] || 0) * 10)}
                                </span>
                            </div>
                            <div
                                className="stat-item-clickable stat-item-text stat-gold"
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'help' }}
                                onClick={() => setBreakdownStat('Gold')}
                            >
                                <Coins className="stat-icon-mini" size={18} color="var(--accent-color)" />
                                <span className="stat-item-inner-value" style={{ fontWeight: 'bold', fontSize: '1rem', color: 'var(--text-primary)' }}>
                                    {100 + (currentStats['Gold'] || 0)} G
                                </span>
                            </div>
                        </div>
                    </div>

                    {isStatusBarCollapsed && (
                        <div className="cyoa-preview-summary" style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flex: 1, justifyContent: 'flex-end' }}>
                            <div
                                className="cyoa-compact-stat stat-hp"
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'help' }}
                                onClick={() => setBreakdownStat('HP')}
                            >
                                <Heart size={16} color="var(--danger-color)" />
                                <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{100 + ((currentStats['CON'] || 0) * 10)}</span>
                            </div>
                            <div
                                className="cyoa-compact-stat stat-sanity"
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'help' }}
                                onClick={() => setBreakdownStat('Sanity')}
                            >
                                <Brain size={16} color="#90caf9" />
                                <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{100 + ((currentStats['WIL'] || 0) * 10)}</span>
                            </div>
                            <div
                                className="cyoa-compact-stat stat-gold"
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'help' }}
                                onClick={() => setBreakdownStat('Gold')}
                            >
                                <Coins size={16} color="var(--accent-color)" />
                                <span style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--text-primary)' }}>{100 + (currentStats['Gold'] || 0)}G</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isInfoOpen && (
                <div style={{
                    paddingTop: '0.8rem',
                    padding: '1rem',
                    borderTop: '1px solid var(--border-color)',
                    background: 'rgba(20, 20, 30, 0.4)',
                    backdropFilter: 'blur(15px)',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    animation: 'fadeIn 0.2s ease-out'
                }}>
                    {(() => {
                        if (allSelectedSkills.allSkills.length === 0) return null;
                        return (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    ✦ 스킬 ({allSelectedSkills.allSkills.length})
                                </span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {allSelectedSkills.allSkills.map((skill: Choice, idx: number) => {
                                        const isGranted = allSelectedSkills.grantedSkillIds.has(skill.id);

                                        return (
                                            <div
                                                key={idx}
                                                title={`${skill.description}${isGranted ? '\n(자동 부여)' : ''}`}
                                                style={{
                                                    background: 'rgba(0, 0, 0, 0.3)',
                                                    backdropFilter: 'blur(5px)',
                                                    border: '1px solid rgba(197, 160, 89, 0.35)',
                                                    boxShadow: 'none',
                                                    padding: '4px 10px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.8rem',
                                                    color: '#c5a059',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    opacity: isGranted ? 0.7 : 1,
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                {isGranted ? '↳ ' : ''}
                                                <Sparkles size={14} />
                                                {skill.name}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Tag size={14} /> 보유 특성 ({currentTagsWithEquip.length})
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {currentTagsWithEquip.length > 0 ? currentTagsWithEquip.map(tag => (
                                <TagTooltip key={tag} tag={tag} />
                            )) : <span style={{ color: '#666', fontStyle: 'italic', fontSize: '0.8rem' }}>보유한 태그가 없습니다.</span>}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CYOALivePreview;
