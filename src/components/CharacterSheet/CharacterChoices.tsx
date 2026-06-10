import type React from 'react';
import IconRenderer from '../common/IconRenderer';
import type { SelectedChoiceGroup } from './useCharacterSheet';
import { getNarratorCardAssets } from '../../data/narrators';

interface CharacterChoicesProps {
    selectedChoicesGrouped: SelectedChoiceGroup[];
    narratorId?: string | null;
}

const CharacterChoices: React.FC<CharacterChoicesProps> = ({ selectedChoicesGrouped, narratorId }) => {
    const cardAssets = getNarratorCardAssets(narratorId);

    return (
        <>
            {selectedChoicesGrouped.length > 0 && (
                <div className="char-sheet-section">
                    <h3>9. 선택한 특성</h3>
                    {selectedChoicesGrouped.map(group => (
                        <div key={group.sectionTitle} style={{ marginBottom: '1rem' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '0.5rem' }}>{group.sectionTitle}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
                                {group.choices.map(choice => {
                                    return (
                                        <div key={choice.id} style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}>
                                        {choice.image && choice.useFrame && (
                                            <div style={{
                                                width: '100%',
                                                position: 'relative',
                                                background: 'rgba(0,0,0,0.4)',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <img
                                                    src={choice.selectedImage || choice.image}
                                                    alt={choice.name}
                                                    style={{
                                                        position: 'absolute',
                                                        top: '6.5%',
                                                        left: '7.5%',
                                                        width: '85%',
                                                        height: '94%',
                                                        objectFit: 'cover',
                                                        objectPosition: 'center',
                                                        zIndex: 1
                                                    }}
                                                    loading="lazy"
                                                />
                                                <img
                                                    src={cardAssets.frameImage}
                                                    alt="frame"
                                                    style={{
                                                        position: 'relative',
                                                        width: '100%',
                                                        height: 'auto',
                                                        display: 'block',
                                                        zIndex: 2,
                                                        pointerEvents: 'none'
                                                    }}
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                        {choice.image && !choice.useFrame && (
                                            <div style={{
                                                width: '100%',
                                                background: 'rgba(0,0,0,0.4)',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                overflow: 'hidden'
                                            }}>
                                                <img
                                                    src={choice.selectedImage || choice.image}
                                                    alt={choice.name}
                                                    style={{
                                                        width: '100%',
                                                        height: 'auto',
                                                        display: 'block',
                                                    }}
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                        <div style={{ padding: '0.5rem 0.7rem', flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                                                <IconRenderer name={choice.icon} size={12} color="var(--accent-color)" />
                                                <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{choice.name}</span>
                                            </div>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{choice.description}</div>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default CharacterChoices;
