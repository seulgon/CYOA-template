import React, { useState, useRef } from 'react';
import { initialCYOAData } from '../../data/cyoa';
import type { Choice } from '../../types/cyoa';
import ChoiceCard from './ChoiceCard';
import type { CYOABuilderViewModel } from './useCYOABuilder';
import { STAT_ADJUSTMENT_POINT_STEP } from './useCYOABuilder';
import { LayoutGrid, List, ChevronUp, ChevronDown } from 'lucide-react';

interface CYOAChoiceSectionProps {
    builder: CYOABuilderViewModel;
    narratorId?: string | null;
}

const CYOAChoiceSection: React.FC<CYOAChoiceSectionProps> = ({ builder, narratorId }) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
    // 스크롤이 top에 도달할 때까지 Observer를 차단
    const [cardsBlocked, setCardsBlocked] = useState(false);
    const scrollListenerRef = useRef<(() => void) | null>(null);
    const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 카드 Observer 해제 함수
    const unblockCards = React.useCallback(() => {
        setCardsBlocked(false);
        if (scrollListenerRef.current) {
            window.removeEventListener('scroll', scrollListenerRef.current);
            scrollListenerRef.current = null;
        }
        if (fallbackTimerRef.current) {
            clearTimeout(fallbackTimerRef.current);
            fallbackTimerRef.current = null;
        }
    }, []);

    const toggleGroup = (groupName: string) => {
        setCollapsedGroups(prev => ({
            ...prev,
            [groupName]: !prev[groupName]
        }));
    };
    const {
        activeTabId,
        setActiveTabId,
        activeSection,
        playSfx,
        getDisabledState,
        selectedChoices,
        statAdjustments,
        handleSelect,
        currentTagsWithEquip,
        getChoiceName,
        handleStatAdjustment
    } = builder;

    const sections = initialCYOAData.sections;
    const currentIndex = sections.findIndex(s => s.id === activeTabId);
    const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
    const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

    const handleTabChange = (sectionId: string) => {
        if (activeTabId !== sectionId) playSfx('tabSwitch');
        setActiveTabId(sectionId);

        // 이미 top에 있는 경우: 렌더링 안정화만 기다림
        if (window.scrollY < 5) {
            setCardsBlocked(true);
            setTimeout(() => setCardsBlocked(false), 50);
            return;
        }

        // 스크롤 진행 중에는 새 카드들의 Observer 차단
        setCardsBlocked(true);

        // 스크롤 top 도달 감지 (scroll 이벤트 기반, 시간 하드코딩 없음)
        const onScroll = () => {
            if (window.scrollY < 5) unblockCards();
        };
        scrollListenerRef.current = onScroll;
        window.addEventListener('scroll', onScroll, { passive: true });

        // 안전망: 스크롤 이벤트가 하나도 안 오는 경우 (0.5초 내 스크롤 없음 등)
        fallbackTimerRef.current = setTimeout(unblockCards, 1500);

        // DOM 업데이트 후 smooth scroll 시작
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 10);
    };

    const renderChoiceCard = (choice: Choice, index: number) => {
        if (!activeSection) return null;

        const { disabled, reason, partiallyMet } = getDisabledState(choice);
        if (choice.secret && disabled) {
            if (choice.secret === 'partial') {
                if (!partiallyMet) return null;
            } else {
                return null;
            }
        }
        
        // 해금 가능한 상위 직업/기술 목록 계산 (UX 가이드)
        let unlockedChoiceNames: string[] | undefined = undefined;
        if (activeSection.id === 'classes' && choice.tags) {
            unlockedChoiceNames = [];
            
            // 전투기술 섹션에서 해금 조건을 가진 항목 검색
            sections.forEach(s => {
                if (s.id === 'combat_skills') {
                    s.choices.forEach(c => {
                        const allReqs = [...(c.requiredTags || []), ...(c.requiredAnyTag || [])];
                        if (allReqs.length === 0) return;

                        const hasMatch = choice.tags?.some(tag => {
                            const tagName = typeof tag === 'string' ? tag : tag.name;
                            return allReqs.includes(tagName);
                        });

                        if (hasMatch && c.id !== choice.id) {
                            unlockedChoiceNames?.push(c.name);
                        }
                    });
                }
            });
            
            // 중복 제거 및 유효성 검사
            if (unlockedChoiceNames.length > 0) {
                unlockedChoiceNames = [...new Set(unlockedChoiceNames)];
            } else {
                unlockedChoiceNames = undefined;
            }
        }

        return (
            <ChoiceCard
                key={choice.id}
                choice={choice}
                index={index}
                isSelected={selectedChoices.has(choice.id) || (!!choice.adjustableStat && statAdjustments[choice.adjustableStat] !== 0)}
                onSelect={() => handleSelect(activeSection.id, choice)}
                disabled={disabled}
                disabledReason={reason}
                isFree={choice.freeWithTag?.some(tag => currentTagsWithEquip.includes(tag)) || false}
                discountAmount={(() => {
                    const discount = choice.discounts?.reduce((max, d) => {
                        if (currentTagsWithEquip.includes(d.tag)) return Math.max(max, d.amount);
                        return max;
                    }, 0) || 0;
                    return Math.max(0, choice.cost - discount);
                })()}
                grantedChoiceNames={choice.grantsChoices?.map(id => getChoiceName(id))}
                statAdjustment={choice.adjustableStat ? {
                    value: statAdjustments[choice.adjustableStat],
                    pointDelta: -statAdjustments[choice.adjustableStat] * STAT_ADJUSTMENT_POINT_STEP,
                    onDecrease: () => handleStatAdjustment(choice.adjustableStat!, -1),
                    onIncrease: () => handleStatAdjustment(choice.adjustableStat!, 1)
                } : undefined}
                variant={activeSection.id === 'world_setup' ? 'condensed' : 'default'}
                hideImage={activeSection.id === 'combat_skills' || activeSection.id === 'items'}
                isListView={viewMode === 'list'}
                unlockedChoiceNames={unlockedChoiceNames}
                playerStats={builder.finalStats}
                observerBlocked={cardsBlocked}
                narratorId={narratorId}
            />
        );
    };

    return (
        <>
            <div className="cyoa-tabs">
                {initialCYOAData.sections.map(section => (
                    <button
                        key={section.id}
                        onClick={() => handleTabChange(section.id)}
                        style={{
                            padding: '0.6rem 1.2rem',
                            borderRadius: '20px',
                            border: `1px solid ${activeTabId === section.id ? 'var(--accent-color)' : 'var(--border-color)'} `,
                            background: activeTabId === section.id ? 'var(--accent-color)' : 'transparent',
                            color: activeTabId === section.id ? '#000' : 'var(--text-secondary)',
                            fontWeight: activeTabId === section.id ? 'bold' : 'normal',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s'
                        }}
                    >
                        {section.title}
                    </button>
                ))
                }
            </div >

            <main className="cyoa-main">
                {activeSection && (
                    <div className="section-content animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div>
                                <h3 style={{ marginBottom: '0.5rem' }}>{activeSection.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                                    {activeSection.description}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.3rem', borderRadius: '8px' }}>
                                <button 
                                    onClick={() => setViewMode('grid')}
                                    style={{ padding: '0.4rem', borderRadius: '4px', background: viewMode === 'grid' ? 'var(--accent-color)' : 'transparent', color: viewMode === 'grid' ? '#000' : 'var(--text-secondary)' }}
                                    title="그리드 뷰"
                                >
                                    <LayoutGrid size={18} />
                                </button>
                                <button 
                                    onClick={() => setViewMode('list')}
                                    style={{ padding: '0.4rem', borderRadius: '4px', background: viewMode === 'list' ? 'var(--accent-color)' : 'transparent', color: viewMode === 'list' ? '#000' : 'var(--text-secondary)' }}
                                    title="리스트 뷰"
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>

                        {(() => {
                            const groupedChoices: Record<string, Choice[]> = {};
                            const ungroupedChoices: Choice[] = [];

                            activeSection.choices.forEach(choice => {
                                if (choice.group) {
                                    if (!groupedChoices[choice.group]) {
                                        groupedChoices[choice.group] = [];
                                    }
                                    groupedChoices[choice.group].push(choice);
                                } else {
                                    ungroupedChoices.push(choice);
                                }
                            });

                            const gridStyle = {
                                display: 'grid',
                                gridTemplateColumns: viewMode === 'list' 
                                    ? '1fr' 
                                    : (activeSection.id === 'world_setup' ? 'repeat(auto-fill, minmax(700px, 1fr))' : 'repeat(auto-fill, minmax(300px, 1fr))'),
                                gap: '1rem'
                            };

                            // 실제로 렌더링될 카드만 필터링 (secret + disabled인 카드 제외)
                            const filterVisible = (choices: Choice[]) => {
                                return choices.filter(choice => {
                                    if (!choice.secret) return true;
                                    const { disabled, partiallyMet } = getDisabledState(choice);
                                    if (!disabled) return true;
                                    if (choice.secret === 'partial' && partiallyMet) return true;
                                    return false;
                                });
                            };

                            return (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    {ungroupedChoices.length > 0 && (
                                        <div style={gridStyle}>
                                            {filterVisible(ungroupedChoices).map((choice, i) => renderChoiceCard(choice, i))}
                                        </div>
                                    )}

                                    {Object.entries(groupedChoices).map(([groupName, choices]) => {
                                        const isCollapsed = collapsedGroups[groupName] || false;
                                        const visibleChoices = filterVisible(choices);
                                        if (visibleChoices.length === 0) return null;
                                        return (
                                        <div key={groupName}>
                                            <h4 
                                                onClick={() => toggleGroup(groupName)}
                                                style={{
                                                marginTop: 0,
                                                marginBottom: '1rem',
                                                color: 'var(--accent-color)',
                                                borderLeft: '3px solid var(--accent-color)',
                                                paddingLeft: '0.8rem',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                userSelect: 'none'
                                            }}>
                                                <span>{activeSection.groupTitles?.[groupName] ?? groupName}</span>
                                                {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                                            </h4>
                                            {!isCollapsed && (
                                                <div style={gridStyle}>
                                                    {visibleChoices.map((choice, i) => renderChoiceCard(choice, i))}
                                                </div>
                                            )}
                                        </div>
                                    )})}
                                </div>
                            );
                        })()}

                        {/* 하단 네비게이션 버튼 */}
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            marginTop: '3rem', 
                            paddingTop: '1.5rem', 
                            borderTop: '1px solid rgba(235, 192, 80, 0.2)' 
                        }}>
                            {prevSection ? (
                                <button
                                    onClick={() => handleTabChange(prevSection.id)}
                                    style={{
                                        padding: '0.8rem 1.5rem',
                                        background: 'rgba(0, 0, 0, 0.4)',
                                        border: '1px solid var(--accent-color)',
                                        borderRadius: '8px',
                                        color: 'var(--accent-color)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    ← {prevSection.title}
                                </button>
                            ) : <div />}

                            {nextSection && (
                                <button
                                    onClick={() => handleTabChange(nextSection.id)}
                                    style={{
                                        padding: '0.8rem 1.5rem',
                                        background: 'rgba(0, 0, 0, 0.4)',
                                        border: '1px solid var(--accent-color)',
                                        borderRadius: '8px',
                                        color: 'var(--accent-color)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    {nextSection.title} →
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </>
    );
};

export default CYOAChoiceSection;
