import type React from 'react';
import type { Choice } from '../../types/cyoa';

const ExpandButton: React.FC<{ onClick: (e: React.MouseEvent) => void }> = ({ onClick }) => (
    <button
        onClick={onClick}
        title="크게 보기"
        style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.2)',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.85)',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            backdropFilter: 'blur(2px)',
            transition: 'all 0.2s ease',
            textShadow: '0 0 4px rgba(0,0,0,0.8)',
        }}
        onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = '#fff';
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.2)';
        }}
        onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255, 255, 255, 0.85)';
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0, 0, 0, 0.2)';
        }}
    >
        <span style={{ display: 'block', transform: 'translateY(-2px)' }}>+</span>
    </button>
);

interface ChoiceImageProps {
    choice: Choice;
    displayImage?: string;
    frameImage: string;
    isSelected: boolean;
    isInitial: boolean;
    randomDelay: string;
    randomDuration: string;
    hideImage: boolean;
    onOpenLightbox: (e: React.MouseEvent) => void;
}

const ChoiceImage: React.FC<ChoiceImageProps> = ({
    choice,
    displayImage,
    frameImage,
    isSelected,
    isInitial,
    randomDelay,
    randomDuration,
    hideImage,
    onOpenLightbox
}) => {
    if (hideImage) return null;

    if (displayImage && !choice.useFrame) {
        return (
            <div style={{
                position: 'relative',
                width: '100%',
                borderRadius: '6px',
                overflow: 'hidden',
                marginBottom: '1rem',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                padding: '1rem',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
                    {!isInitial && (
                        <div key={isSelected ? 'selected' : 'deselected'} className={`shine-overlay ${isSelected ? '' : 'shine-reverse'}`} />
                    )}
                    {isSelected && (
                        <div className="shine-overlay-idle" style={{ animationDelay: randomDelay, animationDuration: randomDuration }} />
                    )}
                    
                    {/* 실제 이미지: 투명 프레임 영역을 꽉 채움 */}
                    <img
                        src={displayImage}
                        alt={choice.name}
                        loading="lazy"
                        decoding="async"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            borderRadius: '4px',
                            objectFit: 'cover',
                            display: 'block',
                            zIndex: 1
                        }}
                        onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                        }}
                    />

                    {/* 레이아웃 가이드용 투명 프레임: 높이를 프레임 카드와 100% 일치시킴 */}
                    <img
                        src={frameImage}
                        alt="layout guide"
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            opacity: 0,
                            pointerEvents: 'none',
                            zIndex: 0
                        }}
                    />
                </div>
                <ExpandButton onClick={onOpenLightbox} />
            </div>
        );
    }

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            marginBottom: '1rem',
            borderRadius: '6px',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.2)',
            padding: '1rem',
            boxSizing: 'border-box'
        }}>
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', overflow: 'hidden', backgroundColor: '#050505' }}>
                {!isInitial && (
                    <div key={isSelected ? 'selected' : 'deselected'} className={`shine-overlay ${isSelected ? '' : 'shine-reverse'}`} />
                )}
                {isSelected && (
                    <div className="shine-overlay-idle" style={{ animationDelay: randomDelay, animationDuration: randomDuration }} />
                )}
                <div
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: '#050505',
                        zIndex: 0
                    }}
                />
                <img
                    src={choice.useFrame && displayImage ? displayImage : "./assets/images/intro/noimage.webp"}
                    alt={choice.useFrame && displayImage ? choice.name : "placeholder"}
                    loading="lazy"
                    decoding="async"
                    style={{
                        position: 'absolute',
                        top: '6.5%',
                        left: '7.5%',
                        width: '85%',
                        height: '94%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        zIndex: 1,
                        imageRendering: 'auto',
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)'
                    }}
                />
                <img
                    src={frameImage}
                    alt="frame"
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        zIndex: 2,
                        pointerEvents: 'none'
                    }}
                />
            </div>
            {/* Expand button only for framed images (not noimage placeholder) */}
            {choice.useFrame && displayImage && (
                <ExpandButton onClick={onOpenLightbox} />
            )}
        </div>
    );
};

export default ChoiceImage;
