import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const AlphabetTap: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { score, round, maxRounds, isGameOver, recordSuccess, claimReward } = useGameSession(5, avatarId);

    const [targetLetter, setTargetLetter] = useState('A');
    const [options, setOptions] = useState<string[]>([]);
    // const [score, setScore] = useState(0); // Handled by hook
    const [message, setMessage] = useState('Tap the letter!');

    const generateRound = () => {
        const target = LETTERS[Math.floor(Math.random() * LETTERS.length)];
        setTargetLetter(target);

        const others = LETTERS.filter(l => l !== target)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        setOptions([target, ...others].sort(() => Math.random() - 0.5));
        setMessage(`Where is the letter ${target}?`);
    };

    useEffect(() => {
        if (!isGameOver) {
            generateRound();
        }
    }, [isGameOver, round]); // Regenerate when round changes

    const handleSelect = (letter: string) => {
        if (letter === targetLetter) {
            setMessage('Awesome! 🌟');
            recordSuccess(); // Increments score & round
        } else {
            setMessage('Try another one! ❤️');
            // recordFailure(); // Optional: if you want 'wrong' to advance round without points, uncomment.
            // But prompt says "match correctly plus 1 ,wrong , do nothing", so we do nothing here?
            // "match correctly plus 1 ,wrong , do nothing." -> So failed attempt doesn't end round?
            // "limit the rounds to only maximum of 5" -> usually implies 5 questions.
            // If wrong does nothing, they can just keep clicking.
            // Let's assume they keep trying until right, OR we can count attempts.
            // For now, let's Stick to: Right = +1 & Next Round. Wrong = Retry same round.
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
            height: '100vh', width: '100vw', background: '#FFADAD', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', padding: '15px', boxSizing: 'border-box'
        }}>
            <div className="clay-container" style={{
                background: '#fff', padding: 'clamp(12px, 3vw, 20px)', flex: 1,
                display: 'flex', flexDirection: 'column', borderRadius: '24px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', flexShrink: 0 }}>
                    <button className="clay-button secondary" onClick={() => navigate('/game-hub', { state: { avatarId } })}
                        style={{ padding: '8px 12px', fontSize: '0.8rem' }}>← BACK</button>
                    <h2 style={{ fontSize: 'clamp(1.1rem, 5vw, 1.6rem)', margin: 0, flex: 1, textAlign: 'center', fontWeight: 900, color: '#4A90E2' }}>ALPHABET TAP</h2>
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
                        padding: 'clamp(15px, 4vw, 25px)',
                        background: '#E2F0CB',
                        borderRadius: '24px',
                        width: 'min(70vw, 30vh)',
                        textAlign: 'center',
                        marginBottom: '20px',
                        flexShrink: 0
                    }}>
                        <h1 style={{ fontSize: 'clamp(3rem, 15vw, 6rem)', color: '#4A90E2', margin: 0 }}>{targetLetter}</h1>
                    </div>
                    <p style={{ fontWeight: 800, fontSize: 'clamp(1rem, 4vw, 1.3rem)', color: '#555', textAlign: 'center', marginBottom: '15px' }}>{message}</p>

                    <div className="options-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: 'clamp(10px, 3vw, 20px)',
                        width: 'min(90vw, 40vh)'
                    }}>
                        {options.map((letter, idx) => (
                            <button
                                key={idx}
                                className="clay-button"
                                style={{
                                    background: 'white',
                                    fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                                    padding: 'clamp(10px, 3vh, 20px)',
                                    color: '#FF6B6B',
                                    aspectRatio: '1/1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onClick={() => handleSelect(letter)}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlphabetTap;
