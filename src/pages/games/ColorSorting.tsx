import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';

const COLORS = [
    { name: 'Red', hex: '#FFADAD', emoji: '🍎' },
    { name: 'Blue', hex: '#A0C4FF', emoji: '💎' },
    { name: 'Green', hex: '#CAFFBF', emoji: '🌳' },
];

const ColorSorting: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { score, round, maxRounds, isGameOver, recordSuccess, claimReward } = useGameSession(5, avatarId);

    const [currentItem, setCurrentItem] = useState(COLORS[0]);
    // const [score, setScore] = useState(0);

    const [message, setMessage] = useState('Put the item in the right basket!');

    const generateRound = () => {
        const item = COLORS[Math.floor(Math.random() * COLORS.length)];
        setCurrentItem(item);
    };

    useEffect(() => {
        if (!isGameOver) {
            generateRound();
        }
    }, [isGameOver, round]);

    const handleSort = (colorName: string) => {
        if (colorName === currentItem.name) {
            setMessage('Correct! 🌈');
            recordSuccess();
        } else {
            setMessage('Oops! Try again! ❤️');
        }
    };

    if (isGameOver) {
        return (
            <div className="game-container" style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1000, cursor: 'pointer'
            }} onClick={() => {
                claimReward();
                navigate('/avatar-view', { state: { avatarId } });
            }}>
                <div className="clay-container" style={{
                    background: '#fff', padding: 'clamp(20px, 5vw, 40px)', width: '90%', maxWidth: '450px',
                    textAlign: 'center', borderRadius: '24px'
                }}>
                    <img src={congratulations} alt="Congratulations" style={{ width: '100%', borderRadius: '15px', marginBottom: '15px', border: '4px solid #FFD1DC' }} />
                    <h2 style={{ color: '#FF6B6B', fontSize: 'clamp(1.5rem, 6vw, 2.2rem)', marginBottom: '10px' }}>Well Done! 🎉</h2>
                    <p style={{ fontSize: 'clamp(1rem, 4vw, 1.3rem)', color: '#555', marginBottom: '15px' }}>Mission completed! Here is your reward!</p>
                    <div style={{ fontSize: '4rem', marginBottom: '15px' }}>🍎</div>
                    <p style={{ fontSize: '0.9rem', color: '#888' }}>(Tap to collect)</p>
                </div>
            </div>
        );
    }

    return (
        <div className="game-container" style={{
            height: '100vh', width: '100vw', background: '#FDFFB6', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', padding: '15px', boxSizing: 'border-box'
        }}>
            <div className="clay-container" style={{
                background: '#fff', padding: 'clamp(12px, 3vw, 20px)', flex: 1,
                display: 'flex', flexDirection: 'column', borderRadius: '24px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', flexShrink: 0 }}>
                    <button className="clay-button secondary" onClick={() => navigate('/game-hub', { state: { avatarId } })}
                        style={{ padding: '8px 12px', fontSize: '0.8rem' }}>← BACK</button>
                    <h2 style={{ fontSize: 'clamp(1.1rem, 5vw, 1.6rem)', margin: 0, flex: 1, textAlign: 'center', fontWeight: 900, color: '#4A90E2' }}>COLOR SORTER</h2>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#666' }}>Round {round}/{maxRounds}</div>
                </div>

                <div style={{ flexShrink: 0, textAlign: 'center', fontSize: '1.2rem', fontWeight: 800, color: '#333', marginBottom: '5px' }}>
                    Items Sorted: {score}
                </div>

                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', margin: '5px 0'
                }}>
                    <div className="item-to-sort" style={{
                        marginBottom: '30px',
                        textAlign: 'center',
                        flexShrink: 0
                    }}>
                        <div style={{ fontSize: 'clamp(4rem, 15vw, 7rem)', animation: 'bounce 2s infinite' }}>{currentItem.emoji}</div>
                        <p style={{ fontWeight: 800, fontSize: 'clamp(1rem, 4vw, 1.3rem)', color: '#555', marginTop: '10px' }}>{message}</p>
                    </div>

                    <div className="baskets" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 'clamp(10px, 3vw, 30px)',
                        width: '100%',
                        flexWrap: 'wrap'
                    }}>
                        {COLORS.map((c) => (
                            <button
                                key={c.name}
                                onClick={() => handleSort(c.name)}
                                className="clay-card"
                                style={{
                                    background: c.hex,
                                    width: 'clamp(80px, 25vw, 120px)',
                                    height: 'clamp(70px, 20vw, 100px)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    border: '6px solid white',
                                    padding: 0
                                }}
                            >
                                <span style={{ fontWeight: 900, fontSize: 'clamp(0.9rem, 3.5vw, 1.2rem)', color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
                                    {c.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
            `}</style>
        </div>
    );
};

export default ColorSorting;
