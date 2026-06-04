import React, { useState, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calculator } from 'lucide-react';
import './FormulaTooltip.css';

interface FormulaTooltipProps {
    formula: string;
    children: React.ReactNode;
    color?: string;
}

const FormulaTooltip: React.FC<FormulaTooltipProps> = ({ formula, children, color = 'var(--accent-color)' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState<'top' | 'bottom'>('bottom');
    const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0 });
    const targetRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (isVisible && targetRef.current && tooltipRef.current) {
            const rect = targetRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const padding = 20;

            const tooltipHeight = tooltipRef.current.offsetHeight;
            const newPosition = (viewportHeight - rect.bottom) < (tooltipHeight + padding) ? 'top' : 'bottom';
            setPosition(newPosition);

            let leftOffset = 0;
            const tooltipWidth = tooltipRef.current.offsetWidth;
            const halfTooltip = tooltipWidth / 2;
            const targetCenter = rect.left + (rect.width / 2);

            if (targetCenter - halfTooltip < padding) {
                leftOffset = padding - (targetCenter - halfTooltip);
            } else if (targetCenter + halfTooltip > viewportWidth - padding) {
                leftOffset = (viewportWidth - padding) - (targetCenter + halfTooltip);
            }

            const top = newPosition === 'bottom'
                ? rect.bottom + 10
                : rect.top - tooltipHeight - 10;

            const left = rect.left + (rect.width / 2);

            setStyle({
                position: 'fixed',
                top: `${top}px`,
                left: `${left}px`,
                transform: `translateX(calc(-50% + ${leftOffset}px))`,
                opacity: 1,
                zIndex: 9999
            });
        } else {
            setStyle({ opacity: 0 });
        }
    }, [isVisible]);

    // 바깥 영역 클릭 시 닫기
    useLayoutEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isVisible &&
                targetRef.current &&
                !targetRef.current.contains(event.target as Node) &&
                tooltipRef.current &&
                !tooltipRef.current.contains(event.target as Node)
            ) {
                setIsVisible(false);
            }
        };

        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible]);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsVisible(!isVisible);
    };

    return (
        <>
            <div
                ref={targetRef}
                onClick={handleClick}
                style={{ cursor: 'pointer' }}
            >
                {children}
            </div>
            {isVisible && createPortal(
                <div
                    ref={tooltipRef}
                    className={`formula-tooltip ${position}`}
                    style={style}
                >
                    <div className="tooltip-arrow"></div>
                    <div className="tooltip-content" style={{ borderColor: color, boxShadow: `0 8px 24px rgba(0, 0, 0, 0.6), 0 0 15px ${color}40` }}>
                        <div className="tooltip-title" style={{ color: color }}>
                            <Calculator size={14} /> 산출 공식
                        </div>
                        <p className="tooltip-formula">{formula}</p>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default FormulaTooltip;
