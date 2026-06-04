import React, { useState, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { getTagInfo, categoryInfo } from '../../data/tags';
import IconRenderer from './IconRenderer';
import './TagTooltip.css';

interface TagTooltipProps {
    tag: string | { name: string; desc: string };
    className?: string;
}

const TagTooltip: React.FC<TagTooltipProps> = ({ tag, className = '' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState<'top' | 'bottom'>('bottom');
    const [style, setStyle] = useState<React.CSSProperties>({ opacity: 0 }); // 초기 투명도 0
    const tagRef = useRef<HTMLSpanElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const tagName = typeof tag === 'string' ? tag : tag.name;
    const customDesc = typeof tag === 'string' ? undefined : tag.desc;

    const tagInfo = getTagInfo(tagName);
    const catInfo = categoryInfo[tagInfo.category];
    const description = customDesc || tagInfo.description;

    const categoryIconName = catInfo.defaultIcon || 'Tag';

    useLayoutEffect(() => {
        if (isVisible && tagRef.current && tooltipRef.current) {
            const tagRect = tagRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const padding = 20;

            // 수직 위치 결정 (화면 하단 공간 확인)
            const tooltipHeight = tooltipRef.current.offsetHeight;
            // 태그 아래쪽 여유 공간이 부족하면 위로, 아니면 아래로(기본)
            const newPosition = (viewportHeight - tagRect.bottom) < (tooltipHeight + padding) ? 'top' : 'bottom';
            setPosition(newPosition);

            // 수평 위치 조정 (화면 밖으로 나가는지 확인)
            let leftOffset = 0;
            const tooltipWidth = tooltipRef.current.offsetWidth;
            const halfTooltip = tooltipWidth / 2;
            const tagCenter = tagRect.left + (tagRect.width / 2);

            if (tagCenter - halfTooltip < padding) {
                // 왼쪽으로 나가는 경우
                leftOffset = padding - (tagCenter - halfTooltip);
            } else if (tagCenter + halfTooltip > viewportWidth - padding) {
                // 오른쪽으로 나가는 경우
                leftOffset = (viewportWidth - padding) - (tagCenter + halfTooltip);
            }

            // Portal 사용을 위한 위치 계산
            const top = newPosition === 'bottom'
                ? tagRect.bottom + 10
                : tagRect.top - tooltipHeight - 10;

            const left = tagRect.left + (tagRect.width / 2);

            setStyle({
                position: 'fixed',
                top: `${top}px`,
                left: `${left}px`,
                transform: `translateX(calc(-50% + ${leftOffset}px))`,
                opacity: 1, // 위치 계산 완료 후 보이게 설정
                zIndex: 9999
            });
        } else {
            // 보이지 않을 때는 다시 초기화
            setStyle({ opacity: 0 });
        }
    }, [isVisible]);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // 부모 요소 클릭 이벤트 방지
        setIsVisible(!isVisible);
    };

    const handleMouseLeave = () => {
        setIsVisible(false);
    };

    return (
        <>
            <span
                ref={tagRef}
                className={`tag-with-tooltip ${className}`}
                onClick={handleClick}
                onMouseLeave={handleMouseLeave}
            >
                #{tagName}
            </span>
            {isVisible && createPortal(
                <div
                    ref={tooltipRef}
                    className={`tag-tooltip ${position}`}
                    style={style}
                >
                    <div className="tooltip-arrow"></div>
                    <div className="tooltip-content">
                        <div
                            className="tooltip-category"
                            style={{ backgroundColor: catInfo.color }}
                        >
                            <IconRenderer name={categoryIconName} size={12} />
                            <span>{catInfo.label}</span>
                        </div>
                        <span className="tooltip-tag-name" style={{ color: catInfo.color }}>
                            #{tagName}
                        </span>
                        <p className="tooltip-description">{description}</p>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default TagTooltip;
