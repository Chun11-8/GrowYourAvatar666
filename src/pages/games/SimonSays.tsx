import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';

const COLORS = ['#FFADAD', '#A0C4FF', '#CAFFBF', '#FDFFB6'];

const SimonSays: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { round, maxRounds, isGameOver, recordSuccess, recordFailure, claimReward } = useGameSession(5, avatarId);
    const [sequence, setSequence] = useState<number[]>([]);
    const [userIdx, setUserIdx] = useState(0);
    const [activeColor, setActiveColor] = useState<number | null>(null);
    const [isShowing, setIsShowing] = useState(false);
    // const [score, setScore] = useState(0);

    const nextRound = () => {
        const next = Math.floor(Math.random() * 4);
        setSequence(s => [...s, next]);
        setUserIdx(0);
        setIsShowing(true);
    };

    useEffect(() => {
        if (isShowing) {
            let i = 0;
            const interval = setInterval(() => {
                setActiveColor(sequence[i]);
                setTimeout(() => setActiveColor(null), 600);
                i++;
                if (i >= sequence.length) {
                    clearInterval(interval);
                    setIsShowing(false);
                }
            }, 1000);
        }
    }, [isShowing, sequence]);

    const handleTap = (idx: number) => {
        if (isShowing) return;
        setActiveColor(idx);
        setTimeout(() => setActiveColor(null), 300);

        if (idx === sequence[userIdx]) {
            if (userIdx + 1 === sequence.length) {
                recordSuccess();
                setTimeout(nextRound, 1000);
            } else {
                setUserIdx(userIdx + 1);
            }
        } else {
            alert('Game Over! Try again! ❤️');
            setSequence([]);
            // setScore(0);
            setTimeout(nextRound, 1000);
            recordFailure();
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
            height: '100vh', width: '100vw', background: '#9BF6FF', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', padding: '15px', boxSizing: 'border-box'
        }}>
            <div className="clay-container" style={{
                background: '#fff', padding: 'clamp(12px, 3vw, 20px)', flex: 1,
                display: 'flex', flexDirection: 'column', borderRadius: '24px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', flexShrink: 0 }}>
                    <button className="clay-button secondary" onClick={() => navigate('/game-hub', { state: { avatarId } })}
                        style={{ padding: '8px 12px', fontSize: '0.8rem' }}>← BACK</button>
                    <h2 style={{ fontSize: 'clamp(1.1rem, 5vw, 1.6rem)', margin: 0, flex: 1, textAlign: 'center', fontWeight: 900, color: '#4A90E2' }}>SIMON SAYS</h2>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#666' }}>Round {round}/{maxRounds}</div>
                </div>

                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', margin: '5px 0'
                }}>
                    <div className="simon-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 'clamp(10px, 3vw, 20px)',
                        width: 'min(85vw, 45vh)',
                        height: 'min(85vw, 45vh)',
                        margin: '0 auto'
                    }}>
                        {COLORS.map((c, i) => (
                            <button
                                key={i}
                                onClick={() => handleTap(i)}
                                className="clay-card"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    background: activeColor === i ? 'white' : c,
                                    opacity: activeColor === i ? 1 : 0.8,
                                    transform: activeColor === i ? 'scale(1.05)' : 'scale(1)',
                                    transition: 'all 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    cursor: 'pointer',
                                    border: '6px solid white',
                                    padding: 0
                                }}
                            ></button>
                        ))}
                    </div>
                </div>

                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }}>
                    {!sequence.length && (
                        <button className="clay-button" style={{ padding: '12px 40px' }} onClick={nextRound}>
                            START GAME 🎮
                        </button>
                    )}
                    <p style={{ marginTop: '10px', fontWeight: 800, fontSize: '1.2rem', color: '#555' }}>
                        {isShowing ? 'Watch closely! 👀' : 'Your turn! ✨'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SimonSays;
