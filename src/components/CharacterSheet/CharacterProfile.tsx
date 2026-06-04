import type React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CharacterProfileProps {
    characterName: string;
    epithet?: string;
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
    maxHP: number;
    maxMP: number;
    gold: number;
    setBreakdownStat: (stat: string) => void;
    showHeader?: boolean;
    sectionTitle?: string;
    profileMeta?: React.ReactNode;
    profileImage?: string | null;
    onProfileImageChange?: (file: File) => void;
}

const CharacterProfile: React.FC<CharacterProfileProps> = ({
    characterName,
    epithet,
    isCollapsed,
    setIsCollapsed,
    maxHP,
    maxMP,
    gold,
    setBreakdownStat,
    showHeader = true,
    sectionTitle = '1. 모험가 이름',
    profileMeta,
    profileImage,
    onProfileImageChange
}) => (
    <>
        {showHeader && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem', position: 'relative' }}>
                <h1 style={{ margin: 0, color: 'var(--accent-color)', fontSize: '1.8rem' }}>
                    {isCollapsed ? `${characterName || '캐릭터'} 정보` : '캐릭터 확인'}
                </h1>
                <button
                    className="capture-ignore"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    style={{
                        position: 'absolute', left: 0,
                        background: 'rgba(255, 255, 255, 0.1)', border: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)', borderRadius: '50%',
                        width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    title={isCollapsed ? "펼치기" : "접기"}
                >
                    {isCollapsed ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
                </button>
            </div>
        )}

        {isCollapsed && (
            <div className="char-sheet-summary animate-fade-in" style={{ marginBottom: '1rem', padding: '0 0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                    {profileImage && (
                        <div style={{
                            width: '45px',
                            height: '45px',
                            borderRadius: '50%',
                            border: '1px solid var(--accent-color)',
                            overflow: 'hidden',
                            boxShadow: '0 0 8px rgba(235, 192, 80, 0.35)',
                            flexShrink: 0
                        }}>
                            <img 
                                src={profileImage} 
                                alt="Profile Avatar" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    )}
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {characterName || '이름 없음'}
                    </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', gap: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        <span className="profile-stat-item stat-hp">HP <b>{maxHP}</b></span>
                        <span className="profile-stat-item stat-sanity">MP <b>{maxMP}</b></span>
                    </div>
                    <div style={{ height: '16px', width: '1px', background: 'var(--border-color)' }}></div>
                    <div className="profile-stat-item stat-gold" style={{ fontSize: '0.95rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>Gold {gold} G</div>
                </div>
            </div>
        )}

        {!isCollapsed && (
            <div className="char-sheet-section">
                <h3>{sectionTitle}</h3>
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    padding: '1.2rem 0.8rem 0.8rem 0.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)',
                    color: 'white', borderRadius: '4px'
                }}>
                    <div className="profile-image-upload-wrapper" style={{ marginBottom: '1rem', position: 'relative' }}>
                        <div 
                            className="profile-image-upload-container"
                            onClick={() => document.getElementById('profile-image-input')?.click()}
                            style={{
                                width: '240px',
                                height: '240px',
                                borderRadius: '50%',
                                border: profileImage ? '2px solid transparent' : '2px dashed var(--accent-color)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                position: 'relative',
                                background: 'rgba(0, 0, 0, 0.4)',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {profileImage ? (
                                <>
                                    <img 
                                        src={profileImage} 
                                        alt="Profile" 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div 
                                        className="profile-image-overlay"
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            background: 'rgba(0, 0, 0, 0.6)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            opacity: 0,
                                            transition: 'opacity 0.2s ease',
                                            color: 'var(--accent-color)',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        변경하기
                                    </div>
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '0.5rem' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-color)' }}>초상화 등록</div>
                                </div>
                            )}
                        </div>
                        <input 
                            type="file" 
                            id="profile-image-input" 
                            accept="image/*" 
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file && onProfileImageChange) {
                                    onProfileImageChange(file);
                                }
                            }}
                        />
                    </div>
                    <div className="char-name-display">
                        {characterName}
                    </div>
                    {profileMeta ?? <span className="char-role">{epithet || '선택받은 방랑자'}</span>}
                </div>
            </div>
        )}
    </>
);

export default CharacterProfile;
