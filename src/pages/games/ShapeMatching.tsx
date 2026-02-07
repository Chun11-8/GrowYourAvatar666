import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';

const SHAPES = [
    { type: 'square', emoji: '⬛', color: '#FFADAD' },
    { type: 'circle', emoji: '⚫', color: '#A0C4FF' },
    { type: 'triangle', emoji: '🔺', color: '#CAFFBF' },
    { type: 'star', emoji: '⭐', color: '#FDFFB6' },
];

const ShapeMatching: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { score, round, maxRounds, isGameOver, recordSuccess, claimReward } = useGameSession(5, avatarId);

    const [target, setTarget] = useState(SHAPES[0]);
    const [options, setOptions] = useState<typeof SHAPES>([]);

    const [message, setMessage] = useState('Match the shape!');

    const generateRound = () => {
        const newTarget = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        setTarget(newTarget);
        setOptions([...SHAPES].sort(() => Math.random() - 0.5));
        setMessage(`Find the ${newTarget.type}!`);
    };

    useEffect(() => {
        if (!isGameOver) {
            generateRound();
        }
    }, [isGameOver, round]);

    const handleSelect = (shape: typeof SHAPES[0]) => {
        if (shape.type === target.type) {
            setMessage('Great Job! ✨');
            recordSuccess();
        } else {
            setMessage('Try again! ❤️');
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
            height: '100vh', width: '100vw', background: '#A0C4FF', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', padding: '15px', boxSizing: 'border-box'
        }}>
            <div className="clay-container" style={{
                background: '#fff', padding: 'clamp(12px, 3vw, 20px)', flex: 1,
                display: 'flex', flexDirection: 'column', borderRadius: '24px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', flexShrink: 0 }}>
                    <button className="clay-button secondary" onClick={() => navigate('/game-hub', { state: { avatarId } })}
                        style={{ padding: '8px 12px', fontSize: '0.8rem' }}>← BACK</button>
                    <h2 style={{ fontSize: 'clamp(1.1rem, 5vw, 1.6rem)', margin: 0, flex: 1, textAlign: 'center', fontWeight: 900, color: '#4A90E2' }}>SHAPE MATCHER</h2>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#666' }}>Round {round}/{maxRounds}</div>
                </div>

                <div style={{ flexShrink: 0, textAlign: 'center', fontSize: '1.2rem', fontWeight: 800, color: '#333', marginBottom: '5px' }}>
                    Score: {score}
                </div>

                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', margin: '5px 0'
                }}>
                    <div className="target-area" style={{
                        padding: 'clamp(20px, 5vw, 40px)',
                        background: '#f8f9fa',
                        borderRadius: '24px',
                        width: 'min(70vw, 30vh)',
                        textAlign: 'center',
                        marginBottom: '20px',
                        border: '5px dashed #dee2e6',
                        flexShrink: 0
                    }}>
                        <div style={{ fontSize: 'clamp(4rem, 15vw, 6rem)', opacity: 0.2, margin: 0 }}>{target.emoji}</div>
                    </div>
                    <p style={{ fontWeight: 800, fontSize: 'clamp(1rem, 4vw, 1.3rem)', color: '#555', textAlign: 'center', marginBottom: '20px' }}>{message}</p>

                    <div className="options-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 'clamp(15px, 4vw, 25px)',
                        width: 'min(90vw, 45vh)'
                    }}>
                        {options.map((shape, idx) => (
                            <button
                                key={idx}
                                className="clay-button"
                                style={{
                                    background: 'white',
                                    fontSize: 'clamp(2.5rem, 10vw, 4rem)',
                                    padding: 'clamp(15px, 4vh, 30px)',
                                    aspectRatio: '1/1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onClick={() => handleSelect(shape)}
                            >
                                {shape.emoji}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShapeMatching;
