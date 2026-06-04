import type React from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, User } from 'lucide-react';
import BGMButton from '../common/BGMButton';
import { initialCYOAData } from '../../data/cyoa';
import type { CYOABuilderViewModel } from './useCYOABuilder';

interface CYOAHeaderProps {
    builder: CYOABuilderViewModel;
    leftContent?: React.ReactNode;
    showBGMButton?: boolean;
    onBack?: () => void;
}

const CYOAHeader: React.FC<CYOAHeaderProps> = ({ builder, leftContent, showBGMButton = true, onBack }) => {
    const {
        characterName,
        characterEpithet,
        isStatusBarCollapsed,
        setIsStatusBarCollapsed,
        isInfoOpen,
        setIsInfoOpen
    } = builder;

    return (
        <header className="cyoa-header">
            <div className="character-identity-header-top" style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
                {leftContent ?? (
                    <h2 style={{ margin: 0, color: 'var(--accent-color)', whiteSpace: 'normal', wordBreak: 'keep-all' }}>
                        {characterName ? (
                            <>
                                {characterName}
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 'normal', marginLeft: '0.4rem', whiteSpace: 'nowrap' }}>{characterEpithet}</span>
                            </>
                        ) : initialCYOAData.title}
                    </h2>
                )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
                {onBack && (
                    <button
                        onClick={onBack}
                        className="toggle-btn back-button-footer"
                        style={{
                            width: '32px',
                            height: '32px',
                            border: `1px solid var(--border-color)`,
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        title="세계관 설정으로 돌아가기"
                    >
                        <ArrowLeft size={18} />
                    </button>
                )}
                <button
                    onClick={() => setIsStatusBarCollapsed(!isStatusBarCollapsed)}
                    className="toggle-btn"
                    style={{
                        width: '32px',
                        height: '32px',
                        border: `1px solid ${isStatusBarCollapsed ? 'var(--border-color)' : 'var(--accent-color)'}`,
                        borderRadius: '8px',
                        color: isStatusBarCollapsed ? undefined : 'var(--accent-color)',
                        background: isStatusBarCollapsed ? undefined : 'rgba(235, 192, 80, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                    title={isStatusBarCollapsed ? "상태창 펼치기" : "상태창 접기"}
                >
                    {isStatusBarCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                </button>
                <button
                    onClick={() => setIsInfoOpen(!isInfoOpen)}
                    className="toggle-btn"
                    style={{
                        background: isInfoOpen ? 'rgba(235, 192, 80, 0.1)' : undefined,
                        border: `1px solid ${isInfoOpen ? 'var(--accent-color)' : 'var(--border-color)'}`,
                        borderRadius: '8px',
                        width: '32px',
                        height: '32px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isInfoOpen ? 'var(--accent-color)' : undefined,
                        transition: 'all 0.2s'
                    }}
                    title="정보/인벤토리"
                >
                    <User size={18} />
                </button>
                {showBGMButton && <BGMButton size={32} style={{ position: 'relative' }} />}
            </div>
        </header>
    );
};

export default CYOAHeader;
