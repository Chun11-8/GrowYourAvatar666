import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';

const SizeComparison: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { score, round, maxRounds, isGameOver, recordSuccess, claimReward } = useGameSession(5, avatarId);
    const [targetType, setTargetType] = useState<'biggest' | 'smallest'>('biggest');
    const [options, setOptions] = useState<{ size: number, id: number }[]>([]);
    // const [score, setScore] = useState(0);
    const [message, setMessage] = useState('');

    const generateRound = () => {
        const type = Math.random() > 0.5 ? 'biggest' : 'smallest';
        setTargetType(type);
        const sizes = [40, 70, 110].sort(() => Math.random() - 0.5);
        setOptions(sizes.map((s, idx) => ({ size: s, id: idx })));
        setMessage(`Which one is the ${type}?`);
    };

    useEffect(() => {
        if (!isGameOver) {
            generateRound();
        }
    }, [isGameOver, round]);

    const handleSelect = (size: number) => {
        const sortedSizes = options.map(o => o.size).sort((a, b) => a - b);
        const isCorrect = targetType === 'biggest'
            ? size === sortedSizes[sortedSizes.length - 1]
            : size === sortedSizes[0];

        if (isCorrect) {
            setMessage('You got it! 🌟');
            recordSuccess();
        } else {
            setMessage('Try again! 😊');
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
            height: '100vh', width: '100vw', background: '#FFD6A5', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', padding: '15px', boxSizing: 'border-box'
        }}>
            <div className="clay-container" style={{
                background: '#fff', padding: 'clamp(12px, 3vw, 20px)', flex: 1,
                display: 'flex', flexDirection: 'column', borderRadius: '24px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', flexShrink: 0 }}>
                    <button className="clay-button secondary" onClick={() => navigate('/game-hub', { state: { avatarId } })}
                        style={{ padding: '8px 12px', fontSize: '0.8rem' }}>← BACK</button>
                    <h2 style={{ fontSize: 'clamp(1.1rem, 5vw, 1.6rem)', margin: 0, flex: 1, textAlign: 'center', fontWeight: 900, color: '#4A90E2' }}>SIZE MATCHER</h2>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#666' }}>Round {round}/{maxRounds}</div>
                </div>

                <div style={{ flexShrink: 0, textAlign: 'center', fontSize: '1.2rem', fontWeight: 800, color: '#333', marginBottom: '5px' }}>
                    Matches: {score}
                </div>

                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', margin: '5px 0'
                }}>
                    <p style={{ fontSize: 'clamp(1.2rem, 5vw, 1.8rem)', fontWeight: 800, color: '#4A90E2', marginBottom: '30px', textAlign: 'center' }}>{message}</p>

                    <div className="display-area" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 'clamp(15px, 4vw, 40px)',
                        minHeight: '200px',
                        width: '100%'
                    }}>
                        {options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => handleSelect(opt.size)}
                                style={{
                                    width: `clamp(${opt.size * 0.8}px, ${opt.size / 2}vw, ${opt.size * 1.2}px)`,
                                    height: `clamp(${opt.size * 0.8}px, ${opt.size / 2}vw, ${opt.size * 1.2}px)`,
                                    background: '#FFD6A5',
                                    borderRadius: '50%',
                                    border: '6px solid white',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: `clamp(${opt.size / 3}px, ${opt.size / 4}vw, ${opt.size / 2}px)`,
                                    padding: 0,
                                    transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                🐘
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SizeComparison;
