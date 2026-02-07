import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllAvatars, deleteAvatar, type AvatarData } from '../utils/storage';

const SelectAvatar: React.FC = () => {
    const [avatars, setAvatars] = useState<AvatarData[]>([]);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deadAlertName, setDeadAlertName] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const savedAvatars = getAllAvatars();
        setAvatars(savedAvatars);

        // Check for death alert from navigation state
        const state = location.state as { deathAlert?: string };
        if (state?.deathAlert) {
            setDeadAlertName(state.deathAlert);
            // Clear the state so it doesn't show again on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleSelect = (avatar: AvatarData) => {
        if (avatar.isDead) return;
        navigate('/avatar-view', { state: { avatarId: avatar.id } });
    };

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setDeletingId(id);
    };

    const confirmDelete = () => {
        if (deletingId) {
            deleteAvatar(deletingId);
            setAvatars(prev => prev.filter(a => a.id !== deletingId));
            setDeletingId(null);
        }
    };

    const cancelDelete = () => {
        setDeletingId(null);
    };

    return (
        <div className="select-avatar-container" style={{ width: '100%', maxWidth: '800px', padding: '20px' }}>
            <div className="clay-container">
                <button
                    className="clay-button secondary"
                    style={{ padding: '8px 16px', fontSize: '0.9rem', marginBottom: '2rem' }}
                    onClick={() => navigate('/')}
                >
                    ← Back
                </button>

                <h1 style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '0.5rem', color: '#4A90E2' }}>My Friends</h1>
                <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
                    Select your avatar to continue
                </p>

                {avatars.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🥚</div>
                        <h3>No friends yet!</h3>
                        <button
                            className="clay-button"
                            style={{ marginTop: '1rem' }}
                            onClick={() => navigate('/create-avatar')}
                        >
                            Create One!
                        </button>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '0.8rem',
                        width: '100%'
                    }}>
                        {avatars.map((avatar) => (
                            <div
                                key={avatar.id}
                                className="clay-card"
                                style={{
                                    cursor: avatar.isDead ? 'default' : 'pointer',
                                    textAlign: 'center',
                                    transition: 'transform 0.2s',
                                    padding: '0.6rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    background: 'white',
                                    filter: avatar.isDead ? 'grayscale(100%) opacity(0.8)' : 'none'
                                }}
                                onClick={() => handleSelect(avatar)}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <button
                                    onClick={(e) => handleDeleteClick(e, avatar.id)}
                                    style={{
                                        position: 'absolute',
                                        top: '5px',
                                        right: '5px',
                                        background: 'rgba(255,107,107,0.15)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        zIndex: 10,
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    title="Delete Avatar"
                                >
                                    🗑️
                                </button>
                                <div style={{
                                    width: 'clamp(50px, 15vw, 90px)',
                                    height: 'clamp(50px, 15vw, 90px)',
                                    borderRadius: '50%',
                                    background: 'var(--soft-blue)',
                                    margin: '0 auto 0.5rem auto',
                                    overflow: 'hidden',
                                    border: '3px solid white',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                }}>
                                    {avatar.isDead ? (
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '2.5rem',
                                            background: '#ddd'
                                        }}>
                                            🪦
                                        </div>
                                    ) : avatar.image ? (
                                        <img
                                            src={avatar.image}
                                            alt="Avatar"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '2rem'
                                        }}>
                                            🐕
                                        </div>
                                    )}
                                </div>
                                <h3 style={{
                                    color: avatar.isDead ? '#666' : '#4A90E2',
                                    fontSize: '0.75rem',
                                    marginBottom: '0.3rem',
                                    textDecoration: avatar.isDead ? 'line-through' : 'none',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    width: '100%'
                                }}>
                                    {avatar.name || avatar.style.charAt(0).toUpperCase() + avatar.style.slice(1)} {avatar.isDead && '(Gone)'}
                                </h3>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '5px',
                                    fontSize: '0.65rem',
                                    fontWeight: 700,
                                    color: avatar.isDead ? '#999' : '#555'
                                }}>
                                    <span>❤️ {avatar.stats.health}</span>
                                    <span>😊 {avatar.stats.mood}</span>
                                </div>
                            </div>
                        ))}

                        {/* New Avatar Card */}
                        <div
                            className="clay-card"
                            style={{
                                cursor: 'pointer',
                                textAlign: 'center',
                                border: '3px dashed var(--soft-blue)',
                                background: 'rgba(255,255,255,0.4)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '0.6rem',
                                minHeight: '100px'
                            }}
                            onClick={() => navigate('/create-avatar')}
                        >
                            <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>➕</div>
                            <p style={{ fontWeight: 700, color: 'var(--soft-blue)', fontSize: '0.7rem' }}>New</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Death Alert Modal */}
            {deadAlertName && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(255,107,107,0.3)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2000
                }}>
                    <div className="clay-container" style={{ maxWidth: '400px', animation: 'popIn 0.4s' }}>
                        <div className="clay-card" style={{ padding: '2.5rem', textAlign: 'center', border: '5px solid #ff6b6b' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🪦</div>
                            <h2 style={{ color: '#d63031', marginBottom: '1rem' }}>Rest in Peace</h2>
                            <p style={{ color: '#444', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                                We are so sorry. <strong>{deadAlertName}</strong> has passed away because their health hit 0.
                                <br />Remember to feed and care for your friends every day!
                            </p>
                            <button
                                className="clay-button"
                                style={{ width: '100%', backgroundColor: '#ff6b6b' }}
                                onClick={() => setDeadAlertName(null)}
                            >
                                I Understand
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {deletingId && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="clay-container" style={{ maxWidth: '350px', transform: 'scale(1)', animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                        <div className="clay-card" style={{ padding: '2rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😟</div>
                            <h3 style={{ marginBottom: '1rem', color: '#ff6b6b' }}>Delete Friend?</h3>
                            <p style={{ marginBottom: '2rem', fontSize: '0.9rem', color: '#666' }}>
                                Are you sure you want to say goodbye to {avatars.find(a => a.id === deletingId)?.name || 'this friend'}?
                                <br />This cannot be undone!
                            </p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <button className="clay-button secondary" onClick={cancelDelete} style={{ flex: 1 }}>
                                    Keep
                                </button>
                                <button className="clay-button" onClick={confirmDelete} style={{ flex: 1, backgroundColor: '#ff6b6b' }}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                @keyframes popIn {
                    from { transform: scale(0.8); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default SelectAvatar;
