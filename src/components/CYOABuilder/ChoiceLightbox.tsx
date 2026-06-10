import type React from 'react';
import { createPortal } from 'react-dom';

interface ChoiceLightboxProps {
    isOpen: boolean;
    onClose: () => void;
    image?: string;
    frameImage?: string;
    useFrame?: boolean;
    choiceName: string;
}

const ChoiceLightbox: React.FC<ChoiceLightboxProps> = ({
    isOpen,
    onClose,
    image,
    frameImage = './assets/images/frame/card_frame.webp',
    useFrame,
    choiceName
}) => {
    if (!isOpen || !image) return null;

    const isFramed = !!(useFrame && image);
    const isPlain = !!(image && !useFrame);
    const isMobile = window.matchMedia('(max-width: 680px)').matches;

    return createPortal(
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.88)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative',
                    maxWidth: '80vw',
                    maxHeight: '90vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* Close button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    style={{
                        position: 'absolute',
                        top: '-24px',
                        right: '-24px',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '2rem',
                        cursor: 'pointer',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 1,
                        transition: 'all 0.2s ease',
                        textShadow: '0 0 8px rgba(0,0,0,0.8)',
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)';
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255, 255, 255, 0.6)';
                        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    }}
                >
                    ×
                </button>

                {/* Framed image in lightbox */}
                {isFramed && (
                    <div style={{
                        position: 'relative',
                        width: isMobile ? 'min(92vw, 82vh)' : 'min(60vmin, 600px)',
                        overflow: 'hidden',
                    }}>
                        <img
                            src={image}
                            alt={choiceName}
                            style={{
                                position: 'absolute',
                                top: '6.5%',
                                left: '7.5%',
                                width: '85%',
                                height: '94%',
                                objectFit: 'cover',
                                objectPosition: 'center',
                                zIndex: 1,
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
                            }}
                        />
                    </div>
                )}

                {/* Plain image in lightbox */}
                {isPlain && (
                    <img
                        src={image}
                        alt={choiceName}
                        style={{
                            maxWidth: '80vw',
                            maxHeight: isMobile ? '92vh' : '85vh',
                            width: isMobile ? '92vw' : undefined,
                            objectFit: 'contain',
                            borderRadius: '8px',
                            boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
                        }}
                    />
                )}
            </div>
        </div>,
        document.body
    );
};

export default ChoiceLightbox;
