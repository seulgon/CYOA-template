import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Music } from 'lucide-react';
import BGMModal from './BGMModal';

interface BGMButtonProps {
    /** 버튼 스타일 커스터마이징 */
    style?: React.CSSProperties;
    /** 추가 className */
    className?: string;
    /** 버튼 크기 (기본값 40) */
    size?: number;
}

/**
 * BGM 관리 모달을 여는 버튼 컴포넌트.
 * 아무 곳에나 배치 가능.
 * Portal을 통해 항상 화면 중앙에 렌더링되도록 보장합니다.
 *
 * 사용 예:
 *   <BGMButton />
 *   <BGMButton size={36} style={{ position: 'absolute', bottom: '1rem', right: '1rem' }} />
 */
const BGMButton: React.FC<BGMButtonProps> = ({ style, className = '', size = 40 }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => {
                    setIsModalOpen(true);
                }}
                className={`bgm-float-btn ${className}`}
                title="배경음악 설정"
                style={{
                    width: size,
                    height: size,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    ...style
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
                }}
            >
                <Music size={Math.round(size * 0.48)} />
            </button>

            {createPortal(
                <BGMModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                    }}
                />,
                document.body
            )}
        </>
    );
};

export default BGMButton;
