import type React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import type { CYOABuilderViewModel } from './useCYOABuilder';

interface CYOAFooterProps {
    builder: CYOABuilderViewModel;
}

const CYOAFooter: React.FC<CYOAFooterProps> = ({ builder }) => {
    const {
        currentPoints,
        validation,
        canComplete,
        handleComplete
    } = builder;

    return (
        <>
            <footer className="cyoa-footer">
                <div style={{ maxWidth: '1000px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            fontSize: '1.4rem',
                            fontWeight: 'bold',
                            color: currentPoints >= 0 ? 'var(--accent-color)' : 'var(--danger-color)',
                            whiteSpace: 'nowrap',
                            textShadow: '0 0 10px rgba(0,0,0,0.3)'
                        }}>
                            <span style={{ fontSize: '1.6rem' }}>{currentPoints}</span> P
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
                        {validation.errors.length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                                {validation.errors.map((err, i) => (
                                    <span key={i} style={{ color: 'var(--danger-color)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                        {err}
                                    </span>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={handleComplete}
                            disabled={!canComplete}
                            className="cyoa-start-btn"
                            style={{
                                background: canComplete ? 'var(--accent-color)' : 'var(--bg-tertiary)',
                                color: canComplete ? '#000' : 'var(--text-secondary)',
                                cursor: canComplete ? 'pointer' : 'not-allowed',
                                opacity: canComplete ? 1 : 0.7,
                            }}
                        >
                            선택 완료
                        </button>
                    </div>
                </div>
            </footer>

            <div className="scroll-buttons-container">
                <button
                    className="scroll-btn"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    title="맨 위로 이동"
                >
                    <ArrowUp size={24} />
                </button>
                <button
                    className="scroll-btn"
                    onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })}
                    title="맨 아래로 이동"
                >
                    <ArrowDown size={24} />
                </button>
            </div>
        </>
    );
};

export default CYOAFooter;
