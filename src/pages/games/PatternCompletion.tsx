import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';

const ITEMS = ['🍎', '🍌', '🍇', '🍓', '🍊'];

const PatternCompletion: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { score, round, maxRounds, isGameOver, recordSuccess, claimReward } = useGameSession(5, avatarId);
    const [pattern, setPattern] = useState<string[]>([]);
    const [target, setTarget] = useState('');
    const [options, setOptions] = useState<string[]>([]);
    // const [score, setScore] = useState(0);
    const [message, setMessage] = useState('What comes next?');

    const generateRound = () => {
        const item1 = ITEMS[Math.floor(Math.random() * ITEMS.length)];
        const item2 = ITEMS.filter(i => i !== item1)[Math.floor(Math.random() * (ITEMS.length - 1))];

        // Pattern: A B A B ?
        const newPattern = [item1, item2, item1, item2];
        const next = item1;

        setPattern(newPattern);
        setTarget(next);
        setOptions(ITEMS.sort(() => Math.random() - 0.5));
        setMessage('Complete the pattern!');
    };

    useEffect(() => {
        if (!isGameOver) {
            generateRound();
        }
    }, [isGameOver, round]);

    const handleSelect = (item: string) => {
        if (item === target) {
            setMessage('Awesome! 🌟');
            recordSuccess();
        } else {
            setMessage('Not quite, try again! ❤️');
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
            height: '100vh', width: '100vw', background: '#CAFFBF', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', padding: '15px', boxSizing: 'border-box'
        }}>
            <div className="clay-container" style={{
                background: '#fff', padding: 'clamp(12px, 3vw, 20px)', flex: 1,
                display: 'flex', flexDirection: 'column', borderRadius: '24px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', flexShrink: 0 }}>
                    <button className="clay-button secondary" onClick={() => navigate('/game-hub', { state: { avatarId } })}
                        style={{ padding: '8px 12px', fontSize: '0.8rem' }}>← BACK</button>
                    <h2 style={{ fontSize: 'clamp(1.1rem, 5vw, 1.6rem)', margin: 0, flex: 1, textAlign: 'center', fontWeight: 900, color: '#4A90E2' }}>PATTERN POWER</h2>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#666' }}>Round {round}/{maxRounds}</div>
                </div>

                <div style={{ flexShrink: 0, textAlign: 'center', fontSize: '1.2rem', fontWeight: 800, color: '#333', marginBottom: '5px' }}>
                    Score: {score}
                </div>

                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', margin: '5px 0'
                }}>
                    <div className="pattern-display" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 'clamp(8px, 2vw, 15px)',
                        background: '#f9f9f9',
                        padding: 'clamp(15px, 4vw, 30px)',
                        borderRadius: '24px',
                        width: 'min(90vw, 40vh)',
                        marginBottom: '15px',
                        flexShrink: 0
                    }}>
                        {pattern.map((item, idx) => (
                            <div key={idx} style={{ fontSize: 'clamp(2.5rem, 10vw, 4rem)' }}>{item}</div>
                        ))}
                        <div style={{
                            fontSize: 'clamp(2.5rem, 10vw, 4rem)',
                            width: 'clamp(50px, 12vw, 80px)',
                            height: 'clamp(50px, 12vw, 80px)',
                            border: '4px dashed #ccc',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '15px'
                        }}>❓</div>
                    </div>
                    <p style={{ fontWeight: 800, fontSize: 'clamp(1rem, 4vw, 1.3rem)', color: '#555', textAlign: 'center', marginBottom: '20px' }}>{message}</p>

                    <div className="options-grid" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 'clamp(10px, 3vw, 20px)',
                        flexWrap: 'wrap',
                        width: '100%'
                    }}>
                        {options.map((item, idx) => (
                            <button
                                key={idx}
                                className="clay-button"
                                style={{
                                    background: 'white',
                                    fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                                    padding: 'clamp(10px, 3vh, 20px)',
                                    minWidth: 'clamp(80px, 20vw, 110px)',
                                    aspectRatio: '1/1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onClick={() => handleSelect(item)}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatternCompletion;
