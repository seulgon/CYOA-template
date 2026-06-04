import type React from 'react';
import TagTooltip from '../common/TagTooltip';
import type { ClassEntry, SkillEntry } from './useCharacterSheet';

interface CharacterInventoryProps {
    selectedClassEntries: ClassEntry[];
    derivedSkillSet: string[];
    skillEntries: SkillEntry[];
    tags: string[];
}

const CharacterInventory: React.FC<CharacterInventoryProps> = ({
    selectedClassEntries,
    derivedSkillSet,
    skillEntries,
    tags,
}) => (
    <>
        {selectedClassEntries.length > 0 && (
            <div className="char-sheet-section">
                <h3>4. 직업 ({selectedClassEntries.length})</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedClassEntries.map((entry) => (
                        <div
                            key={entry.id}
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(197, 160, 89, 0.25)',
                                padding: '4px 10px',
                                borderRadius: '15px',
                                fontSize: '0.85rem',
                                color: '#c5a059',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                            }}
                            title={entry.description}
                        >
                            {entry.name}
                        </div>
                    ))}
                </div>
            </div>
        )}

        {derivedSkillSet.length > 0 && (
            <div className="char-sheet-section">
                <h3>5. 전투 스킬셋 ({derivedSkillSet.length})</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {skillEntries.map((entry) => {
                        return (
                            <div
                                key={entry.skillId}
                                title={entry.skill.description}
                                style={{
                                    background: 'rgba(255,255,255,0.02)',
                                    border: '1px solid rgba(148, 163, 184, 0.25)',
                                    padding: '4px 10px',
                                    borderRadius: '15px',
                                    fontSize: '0.85rem',
                                    color: '#94a3b8',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    opacity: 0.8,
                                    cursor: 'pointer',
                                    boxShadow: '0 0 6px rgba(148, 163, 184, 0.08)',
                                }}
                            >
                                {entry.skill.name}
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

        <div className="char-sheet-section">
            <h3>6. 활성화된 태그 ({tags.length})</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {tags.length > 0 ? tags.map((tag: string) => (
                    <TagTooltip key={tag} tag={tag} />
                )) : <span style={{ color: 'var(--text-secondary)' }}>없음</span>}
            </div>
        </div>
    </>
);

export default CharacterInventory;
