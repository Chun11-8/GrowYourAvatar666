import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';

const ANIMALS = [
    { name: 'Lion', sound: 'Roar', emoji: '🦁' },
    { name: 'Cow', sound: 'Moo', emoji: '🐮' },
    { name: 'Dog', sound: 'Woof', emoji: '🐶' },
    { name: 'Cat', sound: 'Meow', emoji: '🐱' },
    { name: 'Bee', sound: 'Buzz', emoji: '🐝' },
];

const SoundMatching: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { score, round, maxRounds, isGameOver, recordSuccess, claimReward } = useGameSession(5, avatarId);
    const [target, setTarget] = useState(ANIMALS[0]);
    const [options, setOptions] = useState<typeof ANIMALS>([]);
    // const [score, setScore] = useState(0);
    const [message, setMessage] = useState('Who makes this sound?');

    const speak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1.2;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    const generateRound = () => {
        const newTarget = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
        setTarget(newTarget);
        setOptions([...ANIMALS].sort(() => Math.random() - 0.5));
        setMessage(`Listen: "${newTarget.sound}!"`);
    };

    useEffect(() => {
        if (!isGameOver) {
            generateRound();
        }
    }, [isGameOver, round]);

    const handleSelect = (animal: typeof ANIMALS[0]) => {
        if (animal.name === target.name) {
            setMessage('Correct! 🌈');
            speak(animal.name);
            recordSuccess();
        } else {
            setMessage('Not that one, try again! 😊');
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
                    <h2 style={{ fontSize: 'clamp(1.1rem, 5vw, 1.6rem)', margin: 0, flex: 1, textAlign: 'center', fontWeight: 900, color: '#4A90E2' }}>ANIMAL SOUNDS</h2>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#666' }}>Round {round}/{maxRounds}</div>
                </div>

                <div style={{ flexShrink: 0, textAlign: 'center', fontSize: '1.2rem', fontWeight: 800, color: '#333', marginBottom: '5px' }}>
                    Correct: {score}
                </div>

                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', margin: '5px 0'
                }}>
                    <div className="sound-button-area" style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <button
                            className="clay-button"
                            style={{
                                fontSize: 'clamp(2rem, 8vw, 4rem)',
                                padding: 'clamp(20px, 4vw, 40px)',
                                background: '#FFD6A5',
                                width: 'min(70vw, 30vh)',
                                aspectRatio: '1/1',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}
                            onClick={() => speak(target.sound)}
                        >
                            <span>🔊</span>
                            <span style={{ fontSize: 'clamp(0.9rem, 3vw, 1.2rem)' }}>PLAY SOUND</span>
                        </button>
                    </div>

                    <p style={{ fontWeight: 900, fontSize: 'clamp(1.2rem, 5vw, 1.8rem)', color: '#4A90E2', textAlign: 'center', marginBottom: '25px' }}>{message}</p>

                    <div className="options-grid" style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: 'clamp(10px, 3vw, 20px)',
                        width: '100%'
                    }}>
                        {options.map((animal) => (
                            <button
                                key={animal.name}
                                className="clay-button"
                                style={{
                                    background: 'white',
                                    fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                                    minWidth: 'clamp(70px, 18vw, 100px)',
                                    aspectRatio: '1/1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 0
                                }}
                                onClick={() => handleSelect(animal)}
                            >
                                {animal.emoji}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SoundMatching;
