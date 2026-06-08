import React from 'react';
import { motion } from 'framer-motion';
import type { Choice } from '../../types/cyoa';
import { getStatLabel } from '../../utils/statUtils';
import TagTooltip from '../common/TagTooltip';
import { Sword, Shield } from 'lucide-react';
import ChoiceImage from './ChoiceImage';
import ChoiceLightbox from './ChoiceLightbox';
import StatAdjuster from './StatAdjuster';
import type { StatAdjustmentData } from './StatAdjuster';
import FormulaTooltip from '../common/FormulaTooltip';
import Card3DWrapper from './Card3DWrapper';
import './ChoiceCard.css';

const RevealBlock = ({ children, delay, triggered }: { children: React.ReactNode, delay: number, triggered: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={triggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
    transition={{ duration: 0.4, ease: 'easeOut', delay }}
  >
    {children}
  </motion.div>
);

// 등급 판정 함수
const getGrade = (value: number) => {
    if (value >= 10000) return 'SSS';
    if (value >= 6500) return 'SS';
    if (value >= 4000) return 'S';
    if (value >= 2200) return 'A';
    if (value >= 1200) return 'B';
    if (value >= 600) return 'C';
    if (value >= 250) return 'D';
    if (value > 0) return 'F';
    return null;
};

interface ChoiceCardProps {
    choice: Choice;
    isSelected: boolean;
    onSelect: () => void;
    disabled?: boolean;
    disabledReason?: string;
    isFree?: boolean;
    discountAmount?: number;
    grantedChoiceNames?: string[];
    statAdjustment?: StatAdjustmentData;
    variant?: 'default' | 'condensed';
    hideImage?: boolean;
    isListView?: boolean;
    unlockedChoiceNames?: string[];
    playerStats?: Record<string, number>;
    index?: number;
    observerBlocked?: boolean;
    dealFrom?: 'default' | 'top';
}

const ChoiceCard: React.FC<ChoiceCardProps> = ({ 
    choice, isSelected, onSelect, disabled, disabledReason, isFree, discountAmount, 
    grantedChoiceNames, statAdjustment, variant = 'default', hideImage = false, 
    isListView = false, unlockedChoiceNames, index = 0, observerBlocked = false,
    dealFrom = 'default'
}) => {
    const isCondensed = variant === 'condensed';
    const isStatAdjustmentCard = !!statAdjustment;
    const [isInitial, setIsInitial] = React.useState(true);
    const [lightboxOpen, setLightboxOpen] = React.useState(false);

    // 내부 애니메이션 타이밍을 위한 계산
    const flyInDelay = index * 0.08;
    const flipStartDelay = flyInDelay + 0.5;
    const expandDelay = flipStartDelay + 0.3;
    const contentDelay = expandDelay + 0.2;

    // 공격력/방어력 등급 계산
    const displayAtkCurrent = choice.combatBonus?.atk || 0;
    const displayDefCurrent = choice.combatBonus?.def || 0;
    
    const atkGrade = getGrade(displayAtkCurrent);
    const defGrade = getGrade(displayDefCurrent);

    const getFormulaString = (stats: any, type: 'atk' | 'def') => {
        if (!stats) return "고정 보너스";
        const baseVal = type === 'atk' ? (stats.baseAtk || 0) : (stats.baseDef || 0);
        const scaling = type === 'atk' ? stats.scaling?.atk : stats.scaling?.def;
        
        let formula = `고정값 ${baseVal}`;
        if (scaling) {
            Object.entries(scaling).forEach(([stat, weight]) => {
                if (weight && typeof weight === 'number' && weight > 0) {
                    formula += ` + (${getStatLabel(stat)} × ${weight})`;
                }
            });
        }
        return formula;
    };

    const [{ randomDelay, randomDuration }] = React.useState(() => ({
        randomDelay: (Math.random() * -6).toFixed(2) + 's',
        randomDuration: (4 + Math.random() * 2).toFixed(2) + 's'
    }));

    React.useEffect(() => {
        setIsInitial(false);
    }, []);

    const displayImage = (isSelected && choice.selectedImage) ? choice.selectedImage : choice.image;
    const openLightbox = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    return (
        <>
            <ChoiceLightbox
                isOpen={lightboxOpen}
                onClose={closeLightbox}
                image={displayImage}
                useFrame={choice.useFrame}
                choiceId={choice.id}
                choiceName={choice.name}
            />

            <Card3DWrapper 
                index={index} 
                observerBlocked={observerBlocked}
                onClick={!disabled && !isStatAdjustmentCard ? onSelect : undefined}
                isListView={isListView}
                isCondensed={isCondensed}
                dealFrom={dealFrom}
            >
                {/* Front Face */}
                <div
                    className={`choice-card card-face card-front ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                    style={{
                        border: isSelected
                            ? '2px solid rgba(var(--narrator-accent-rgb), 0.95)'
                            : '2px solid rgba(var(--narrator-accent-rgb), 0.4)',
                        borderRadius: '12px',
                        background: isSelected
                            ? 'linear-gradient(135deg, rgba(var(--narrator-accent-rgb), 0.12) 0%, rgba(var(--narrator-accent-strong-rgb), 0.08) 50%, rgba(var(--narrator-accent-rgb), 0.12) 100%)'
                            : 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: isSelected ? 'blur(14px)' : 'blur(8px)',
                        WebkitBackdropFilter: isSelected ? 'blur(14px)' : 'blur(8px)',
                        boxShadow: isSelected
                            ? '0 0 15px rgba(var(--narrator-accent-rgb), 0.5), 0 0 30px rgba(var(--narrator-accent-rgb), 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                            : '0 4px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                        cursor: disabled ? 'not-allowed' : (isStatAdjustmentCard ? 'default' : 'pointer'),
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        isolation: 'isolate',
                        opacity: disabled ? 0.5 : 1,
                        display: 'flex',
                        flexDirection: isListView ? 'row' : 'column',
                        alignItems: isListView ? 'center' : 'stretch',
                        justifyContent: isListView ? 'space-between' : 'flex-start',
                        transform: isSelected ? 'translateY(-2px)' : 'none',
                        overflow: 'hidden',
                    }}
                >
                    {!isListView && (
                        <ChoiceImage
                            choice={choice}
                            displayImage={displayImage}
                            isSelected={isSelected}
                            isInitial={isInitial}
                            randomDelay={randomDelay}
                            randomDuration={randomDuration}
                            hideImage={hideImage}
                            onOpenLightbox={openLightbox}
                        />
                    )}

                    <motion.div
                        initial={{ gridTemplateRows: '0fr' }}
                        animate={!observerBlocked ? { gridTemplateRows: '1fr' } : { gridTemplateRows: '0fr' }}
                        transition={{ duration: 0.4, delay: expandDelay, ease: 'easeInOut' }}
                        style={{ display: 'grid' }}
                    >
                        <div style={{ overflow: 'hidden', minHeight: 0 }}>
                            <div className="card-content-inner" style={{
                                padding: isListView ? '0.6rem 1rem' : (isCondensed ? '0.8rem 1.2rem' : '1.5rem'),
                                display: 'flex',
                                flexDirection: 'column',
                                flex: 1
                            }}>
                                <RevealBlock delay={contentDelay} triggered={!observerBlocked}>
                                    <div className="flex-center" style={{ 
                                        justifyContent: 'space-between', 
                                        marginBottom: isListView ? '0' : (isCondensed ? '0.2rem' : '0.5rem'),
                                        width: isListView ? '100%' : 'auto'
                                    }}>
                                        <h3 className="choice-card-title" style={{ margin: 0, fontSize: isListView ? '1rem' : '1.2rem', color: isSelected ? 'var(--accent-color)' : 'var(--text-primary)', display: 'flex', alignItems: 'center' }}>
                                            {choice.name} {isListView && disabled && disabledReason && <span style={{color: 'var(--danger-color)', fontSize: '0.8rem', marginLeft: '0.8rem', fontWeight: 'normal'}}>({disabledReason})</span>}
                                        </h3>
                                        <div className="choice-card-price" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {statAdjustment ? (
                                                <span style={{
                                                    color: statAdjustment.pointDelta > 0 ? 'var(--accent-color)' : statAdjustment.pointDelta < 0 ? 'var(--danger-color)' : 'var(--text-secondary)',
                                                    fontWeight: 'bold',
                                                    fontSize: isListView ? '0.9rem' : '1rem'
                                                }}>
                                                    {statAdjustment.pointDelta > 0 ? `+${statAdjustment.pointDelta} P` : `${statAdjustment.pointDelta} P`}
                                                </span>
                                            ) : isFree ? (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ textDecoration: 'line-through', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                        -{choice.cost} P
                                                    </span>
                                                    <span style={{ color: 'var(--accent-color)', fontWeight: 'bold', fontSize: isListView ? '0.9rem' : '1rem' }}>
                                                        무료
                                                    </span>
                                                </span>
                                            ) : discountAmount !== undefined && discountAmount < choice.cost ? (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ textDecoration: 'line-through', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                        -{choice.cost} P
                                                    </span>
                                                    <span style={{ color: 'var(--accent-color)', fontWeight: 'bold', fontSize: isListView ? '0.9rem' : '1rem' }}>
                                                        -{discountAmount} P
                                                    </span>
                                                </span>
                                            ) : (
                                                <span style={{
                                                    color: choice.cost > 0 ? 'var(--danger-color)' : 'var(--accent-color)',
                                                    fontWeight: 'bold',
                                                    fontSize: isListView ? '0.9rem' : '1rem'
                                                }}>
                                                    {choice.cost > 0 ? `-${choice.cost} P` : `+${Math.abs(choice.cost)} P`}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {!isListView && (
                                        <p className="choice-card-description" style={{
                                            fontSize: isCondensed ? '0.9rem' : '1rem',
                                            color: 'var(--text-secondary)',
                                            marginBottom: isCondensed ? '0.5rem' : '0.8rem',
                                            lineHeight: '1.5'
                                        }}>
                                            {choice.description}
                                        </p>
                                    )}
                                </RevealBlock>

                                {!isListView && (
                                    <>
                                        <RevealBlock delay={contentDelay + 0.1} triggered={!observerBlocked}>
                                            {(atkGrade || defGrade) && (
                                                <div style={{ display: 'flex', gap: '20px', marginBottom: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                                                    <FormulaTooltip formula={getFormulaString(undefined, 'atk')} color="#ef5350">
                                                        <div 
                                                            style={{
                                                                padding: '6px 14px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '10px',
                                                                background: 'rgba(255, 255, 255, 0.03)',
                                                                backdropFilter: 'blur(8px)',
                                                                WebkitBackdropFilter: 'blur(8px)',
                                                                border: '1px solid rgba(239, 83, 80, 0.2)',
                                                                borderRadius: '10px',
                                                                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05), 0 4px 15px rgba(0, 0, 0, 0.2)',
                                                                color: '#ef5350',
                                                                opacity: atkGrade ? 1 : 0.6
                                                            }}
                                                        >
                                                            <Sword size={18} strokeWidth={2.5} /> <span style={{ color: atkGrade ? '#fff' : 'rgba(255, 255, 255, 0.4)', fontSize: '1.2rem', textShadow: atkGrade ? '0 0 12px #ef5350' : 'none', fontWeight: '900', letterSpacing: '1px' }}>{atkGrade || '-'}</span>
                                                        </div>
                                                    </FormulaTooltip>
                                                    <FormulaTooltip formula={getFormulaString(undefined, 'def')} color="#42a5f5">
                                                        <div 
                                                            style={{
                                                                padding: '6px 14px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '10px',
                                                                background: 'rgba(255, 255, 255, 0.03)',
                                                                backdropFilter: 'blur(8px)',
                                                                WebkitBackdropFilter: 'blur(8px)',
                                                                border: '1px solid rgba(66, 165, 245, 0.2)',
                                                                borderRadius: '10px',
                                                                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05), 0 4px 15px rgba(0, 0, 0, 0.2)',
                                                                color: '#42a5f5',
                                                                opacity: defGrade ? 1 : 0.6
                                                            }}
                                                        >
                                                            <Shield size={18} strokeWidth={2.5} /> <span style={{ color: defGrade ? '#fff' : 'rgba(255, 255, 255, 0.4)', fontSize: '1.2rem', textShadow: defGrade ? '0 0 12px #42a5f5' : 'none', fontWeight: '900', letterSpacing: '1px' }}>{defGrade || '-'}</span>
                                                        </div>
                                                    </FormulaTooltip>
                                                </div>
                                            )}

                                            {choice.stats && Object.keys(choice.stats).length > 0 && (
                                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: 'auto', alignItems: 'center' }}>
                                                    {Object.entries(choice.stats).map(([stat, val]) => (
                                                        <span key={stat} style={{
                                                            fontSize: '0.75rem',
                                                            padding: '2px 6px',
                                                            borderRadius: '4px',
                                                            border: '1px solid var(--border-color)',
                                                            background: 'rgba(255, 255, 255, 0.05)',
                                                            color: typeof val === 'number' && val > 0 ? 'var(--accent-color)' : 'var(--danger-color)',
                                                            fontWeight: '500'
                                                        }}>
                                                            {typeof val === 'number' && val > 0 ? `+${val}` : val} {getStatLabel(stat)}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {statAdjustment && choice.adjustableStat && (
                                                <StatAdjuster statAdjustment={statAdjustment} />
                                            )}
                                        </RevealBlock>

                                        <RevealBlock delay={contentDelay + 0.2} triggered={!observerBlocked}>
                                            {choice.tags && choice.tags.length > 0 && (
                                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: (choice.stats && Object.keys(choice.stats).length > 0) ? '6px' : 'auto', alignItems: 'center' }}>
                                                    {choice.tags.map((tag, idx) => {
                                                        const tagName = typeof tag === 'string' ? tag : tag.name;
                                                        return <TagTooltip key={`${tagName}-${idx}`} tag={tag} />;
                                                    })}
                                                </div>
                                            )}

                                            {choice.grantsChoices && choice.grantsChoices.length > 0 && (
                                                <div style={{
                                                    marginTop: '0.8rem',
                                                    padding: '0.5rem',
                                                    background: 'rgba(var(--narrator-accent-rgb), 0.1)',
                                                    borderRadius: '4px',
                                                    borderLeft: '3px solid var(--accent-color)'
                                                }}>
                                                    <span style={{ color: 'var(--accent-color)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                                        ※ 보너스: {grantedChoiceNames ? grantedChoiceNames.join(', ') : '...'} 무료 획득
                                                    </span>
                                                </div>
                                            )}

                                            {unlockedChoiceNames && unlockedChoiceNames.length > 0 && (
                                                <div style={{
                                                    marginTop: '0.5rem',
                                                    padding: '0.5rem',
                                                    background: 'rgba(var(--narrator-accent-rgb), 0.05)',
                                                    borderRadius: '4px',
                                                    border: '1px solid rgba(var(--narrator-accent-rgb), 0.3)',
                                                    overflow: 'hidden'
                                                }}>
                                                    <div style={{ 
                                                        color: 'var(--accent-color)', 
                                                        fontSize: '0.82rem', 
                                                        fontWeight: '500',
                                                        lineHeight: '1.4'
                                                    }}>
                                                        ※ 연계 해금: {unlockedChoiceNames.join(', ')}
                                                    </div>
                                                </div>
                                            )}

                                            {disabled && disabledReason && (
                                                <div style={{
                                                    marginTop: '0.5rem',
                                                    color: 'var(--danger-color)',
                                                    fontSize: '0.85rem',
                                                    fontStyle: 'italic'
                                                }}>
                                                    * {disabledReason}
                                                </div>
                                            )}
                                        </RevealBlock>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Back Face */}
                <div 
                    className={`choice-card card-face card-back ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                    style={{
                        border: isSelected
                            ? '2px solid rgba(var(--narrator-accent-rgb), 0.95)'
                            : '2px solid rgba(var(--narrator-accent-rgb), 0.4)',
                        borderRadius: '12px',
                        background: isSelected
                            ? 'linear-gradient(135deg, rgba(var(--narrator-accent-rgb), 0.12) 0%, rgba(var(--narrator-accent-strong-rgb), 0.08) 50%, rgba(var(--narrator-accent-rgb), 0.12) 100%)'
                            : 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: isSelected ? 'blur(14px)' : 'blur(8px)',
                        WebkitBackdropFilter: isSelected ? 'blur(14px)' : 'blur(8px)',
                        boxShadow: isSelected
                            ? '0 0 15px rgba(var(--narrator-accent-rgb), 0.5), 0 0 30px rgba(var(--narrator-accent-rgb), 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                            : '0 4px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                        padding: '1rem',
                        boxSizing: 'border-box',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <img 
                        src="./assets/images/frame/card_backimage.webp" 
                        alt="Card Back" 
                        loading="lazy"
                        decoding="async"
                        style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'fill', 
                            display: 'block',
                            borderRadius: '0',
                            opacity: 0.9,
                            filter: 'sepia(0.2) contrast(1.1)'
                        }} 
                    />
                </div>
            </Card3DWrapper>
        </>
    );
};

export default ChoiceCard;
