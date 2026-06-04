import type React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface CharacterActionsProps {
    isCapturing: boolean;
    handleBack: () => void;
    handleConfirmBuild: () => void;
    handleSave: () => void;
    handleExport: () => void;
    handleCaptureSheet: () => void;
}

const CharacterActions: React.FC<CharacterActionsProps> = ({
    isCapturing,
    handleBack,
    handleConfirmBuild,
    handleSave,
    handleExport,
    handleCaptureSheet
}) => (
    <>
        <div className="char-sheet-actions capture-ignore">
            <button
                onClick={handleBack}
                style={{
                    flex: 0.8, padding: '1rem', cursor: 'pointer',
                    background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)',
                    borderRadius: '8px', fontSize: '1.1rem', transition: 'all 0.2s'
                }}
            >
                ⬅수정하기
            </button>
            <div style={{ flex: 2.2, display: 'flex', gap: '0.5rem' }}>
                <button
                    onClick={handleSave}
                    style={{
                        flex: 1, padding: '1rem', cursor: 'pointer',
                        background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)',
                        borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', transition: 'all 0.2s'
                    }}
                >
                    저장하기
                </button>
                <button
                    onClick={handleExport}
                    style={{
                        flex: 1, padding: '1rem', cursor: 'pointer',
                        background: 'transparent', border: '1px solid var(--text-secondary)', color: 'var(--text-primary)',
                        borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', transition: 'all 0.2s'
                    }}
                >
                    내보내기
                </button>
                <button
                    onClick={handleCaptureSheet}
                    disabled={isCapturing}
                    style={{
                        flex: 1, padding: '1rem', cursor: isCapturing ? 'wait' : 'pointer',
                        background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)',
                        borderRadius: '8px', fontSize: '1.1rem', fontWeight: 'bold', transition: 'all 0.2s',
                        opacity: isCapturing ? 0.65 : 1
                    }}
                >
                    {isCapturing ? '저장 중...' : '이미지'}
                </button>
            </div>
            <button
                onClick={handleConfirmBuild}
                style={{
                    flex: 1.2, padding: '1rem', cursor: 'pointer',
                    background: 'var(--accent-color)', border: 'none', color: '#000', fontWeight: 'bold',
                    borderRadius: '8px', fontSize: '1.2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    transition: 'all 0.2s'
                }}
            >
                타이틀로 돌아가기
            </button>
        </div>

        <div className="scroll-buttons-container capture-ignore">
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

export default CharacterActions;
