import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';

const EMOJIS = ['🍎', '🐶', '🦄', '🌈', '🍦', '🧸', '🐝', '🏀'];

const Counting: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    //Actual Implementation
    //const { score, round, maxRounds, isGameOver, recordSuccess, resetGame } = useGameSession(5);
    const { score, round, maxRounds, isGameOver, recordSuccess, claimReward } = useGameSession(5, avatarId);

    const [count, setCount] = useState(3);
    const [emoji, setEmoji] = useState('🍎');
    const [options, setOptions] = useState<number[]>([]);

    const [message, setMessage] = useState('Count them!');

    const generateRound = () => {
        const newCount = Math.floor(Math.random() * 5) + 1; // 1 to 5 for small kids
        setCount(newCount);
        setEmoji(EMOJIS[Math.floor(Math.random() * EMOJIS.length)]);

        const others = [1, 2, 3, 4, 5, 6].filter(n => n !== newCount)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        setOptions([newCount, ...others].sort(() => Math.random() - 0.5));
        setMessage(`How many ${newCount > 1 ? 'objects' : 'object'}?`);
    };

    useEffect(() => {
        if (!isGameOver) {
            generateRound();
        }
    }, [isGameOver, round]);

    const handleSelect = (num: number) => {
        if (num === count) {
            setMessage('Perfect! 🦄');
            recordSuccess();
        } else {
            setMessage('Counting is fun, try again! 😊');
        }
    };


    // ... inside component ...

    if (isGameOver) {
        return (
            <div
                className="game-container"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    cursor: 'pointer'
                }}
                onClick={() => {
                    claimReward();
                    navigate('/avatar-view', { state: { avatarId } });
                }}
            >
                <div className="clay-container" style={{
                    background: '#fff',
                    padding: '30px',
                    maxWidth: '90%',
                    width: '500px',
                    textAlign: 'center',
                    borderRadius: '20px',
                    animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}>
                    <img
                        src={congratulations}
                        alt="Congratulations"
                        style={{
                            width: '100%',
                            borderRadius: '15px',
                            marginBottom: '20px',
                            border: '4px solid #FFD1DC'
                        }}
                    />

                    <h2 style={{ color: '#FF6B6B', fontSize: '2rem', marginBottom: '10px' }}>
                        Congratulation! 🎉
                    </h2>

                    <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '20px', lineHeight: '1.5' }}>
                        You have completed the mission and here is your rewards!
                    </p>

                    <div style={{ fontSize: '5rem', marginBottom: '20px', animation: 'bounce 2s infinite' }}>
                        🍎
                    </div>

                    <p style={{ fontSize: '1rem', color: '#888' }}>
                        (Tap anywhere to collect)
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="game-container" style={{ padding: '20px', textAlign: 'center' }}>
            <div className="clay-container" style={{ background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                    <button className="clay-button secondary" onClick={() => navigate('/game-hub')} style={{ marginRight: 'auto' }}>← Back</button>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', margin: 0, flex: 2, textAlign: 'center' }}>Counting Fun</h2>
                    <div style={{ flex: 1, textAlign: 'right', fontWeight: 'bold' }}>Round {round}/{maxRounds}</div>
                </div>

                <div className="score-board" style={{ fontSize: '1.5rem', margin: '1rem 0', fontWeight: 700 }}>
                    Score: {score}
                </div>

                <div className="display-area" style={{
                    padding: '2rem',
                    background: '#FFD1DC',
                    borderRadius: '20px',
                    margin: '2rem auto',
                    maxWidth: '500px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '1rem',
                    minHeight: '150px',
                    alignItems: 'center'
                }}>
                    {Array.from({ length: count }).map((_, i) => (
                        <div key={i} style={{ fontSize: '4rem' }}>{emoji}</div>
                    ))}
                </div>
                <p style={{ fontWeight: 800, color: '#666', marginBottom: '2rem' }}>{message}</p>

                <div className="options-grid" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1.5rem',
                    flexWrap: 'wrap'
                }}>
                    {options.map((num, idx) => (
                        <button
                            key={idx}
                            className="clay-button"
                            style={{ background: 'white', fontSize: '2.5rem', minWidth: '80px' }}
                            onClick={() => handleSelect(num)}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Counting;
