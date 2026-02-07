import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';

const NumberOrder: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { score, round, maxRounds, isGameOver, recordSuccess, claimReward } = useGameSession(5, avatarId);
    const [numbers, setNumbers] = useState<number[]>([]);
    const [targetOrder, setTargetOrder] = useState<number[]>([]);
    const [currentOrder, setCurrentOrder] = useState<number[]>([]);
    // const [score, setScore] = useState(0);
    const [message, setMessage] = useState('Put them in order (1, 2, 3...)');

    const generateRound = () => {
        const start = Math.floor(Math.random() * 5) + 1;
        const nums = [start, start + 1, start + 2].sort(() => Math.random() - 0.5);
        setNumbers(nums);
        setTargetOrder([start, start + 1, start + 2]);
        setCurrentOrder([]);
        setMessage('Put the numbers in order!');
    };

    useEffect(() => {
        if (!isGameOver) {
            generateRound();
        }
    }, [isGameOver, round]);

    const handleSelect = (num: number) => {
        if (currentOrder.includes(num)) return;

        const nextInTarget = targetOrder[currentOrder.length];
        if (num === nextInTarget) {
            const newOrder = [...currentOrder, num];
            setCurrentOrder(newOrder);
            if (newOrder.length === targetOrder.length) {
                setMessage('Perfect Order! ✨');
                recordSuccess();
            } else {
                setMessage('Next number?');
            }
        } else {
            setMessage('Oops! Start with the smallest!');
            setCurrentOrder([]);
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
            height: '100vh', width: '100vw', background: '#F0F7FF', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', padding: '15px', boxSizing: 'border-box'
        }}>
            <div className="clay-container" style={{
                background: '#fff', padding: 'clamp(12px, 3vw, 20px)', flex: 1,
                display: 'flex', flexDirection: 'column', borderRadius: '24px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', flexShrink: 0 }}>
                    <button className="clay-button secondary" onClick={() => navigate('/game-hub', { state: { avatarId } })}
                        style={{ padding: '8px 12px', fontSize: '0.8rem' }}>← BACK</button>
                    <h2 style={{ fontSize: 'clamp(1.1rem, 5vw, 1.6rem)', margin: 0, flex: 1, textAlign: 'center', fontWeight: 900, color: '#4A90E2' }}>NUMBER ORDER</h2>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#666' }}>Round {round}/{maxRounds}</div>
                </div>

                <div style={{ flexShrink: 0, textAlign: 'center', fontSize: '1.2rem', fontWeight: 800, color: '#333', marginBottom: '5px' }}>
                    Score: {score}
                </div>

                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', margin: '5px 0'
                }}>
                    <div className="current-line" style={{
                        margin: '10px 0',
                        padding: 'clamp(10px, 3vw, 20px)',
                        background: '#f0f7ff',
                        minHeight: 'clamp(80px, 15vh, 120px)',
                        borderRadius: '24px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 'clamp(8px, 2vw, 15px)',
                        width: 'min(90vw, 40vh)',
                        flexShrink: 0
                    }}>
                        {currentOrder.map((n, i) => (
                            <div key={i} className="clay-card" style={{
                                background: '#A0C4FF',
                                color: 'white',
                                fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
                                width: 'clamp(50px, 12vw, 75px)',
                                height: 'clamp(50px, 12vw, 75px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: 0
                            }}>{n}</div>
                        ))}
                        {Array.from({ length: 3 - currentOrder.length }).map((_, i) => (
                            <div key={i} style={{
                                width: 'clamp(50px, 12vw, 75px)',
                                height: 'clamp(50px, 12vw, 75px)',
                                border: '3px dashed #ccc',
                                borderRadius: '15px'
                            }}></div>
                        ))}
                    </div>
                    <p style={{ fontWeight: 800, fontSize: 'clamp(0.9rem, 3.5vw, 1.3rem)', color: '#555', textAlign: 'center', marginBottom: '20px' }}>{message}</p>

                    <div className="options" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 'clamp(10px, 3vw, 20px)',
                        width: '100%'
                    }}>
                        {numbers.map((n) => (
                            <button
                                key={n}
                                className="clay-button"
                                style={{
                                    background: currentOrder.includes(n) ? '#eee' : 'white',
                                    opacity: currentOrder.includes(n) ? 0.3 : 1,
                                    fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
                                    minWidth: 'clamp(70px, 18vw, 100px)',
                                    aspectRatio: '1/1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 0
                                }}
                                onClick={() => handleSelect(n)}
                                disabled={currentOrder.includes(n)}
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NumberOrder;
