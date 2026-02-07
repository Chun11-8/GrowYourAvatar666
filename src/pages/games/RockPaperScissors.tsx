import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';

const MOVES = [
    { name: 'Rock', emoji: '✊', beats: 'Scissors' },
    { name: 'Paper', emoji: '✋', beats: 'Rock' },
    { name: 'Scissors', emoji: '✌️', beats: 'Paper' },
];

const RockPaperScissors: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { score, round, maxRounds, isGameOver, recordSuccess, recordFailure, claimReward } = useGameSession(5, avatarId);
    const [userMove, setUserMove] = useState<any>(null);
    const [compMove, setCompMove] = useState<any>(null);
    const [result, setResult] = useState('');

    const play = (move: any) => {
        if (isGameOver) return;
        const computerMove = MOVES[Math.floor(Math.random() * MOVES.length)];
        setUserMove(move);
        setCompMove(computerMove);

        if (move.name === computerMove.name) {
            setResult("It's a Tie! 🤝");
            recordFailure();
        } else if (move.beats === computerMove.name) {
            setResult("You Win! 🏆");
            recordSuccess();
        } else {
            setResult("Computer Wins! 🤖");
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
                    <h2 style={{ fontSize: 'clamp(1.1rem, 5vw, 1.6rem)', margin: 0, flex: 1, textAlign: 'center', fontWeight: 900, color: '#4A90E2' }}>ROCK PAPER SCISSORS</h2>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#666' }}>Round {round}/{maxRounds}</div>
                </div>

                <div style={{ flexShrink: 0, textAlign: 'center', fontSize: '1.2rem', fontWeight: 800, color: '#333', marginBottom: '5px' }}>
                    Score: {score}
                </div>

                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', margin: '5px 0'
                }}>
                    <div className="battleground" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 'clamp(20px, 6vw, 50px)',
                        margin: '15px 0',
                        width: '100%'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontWeight: 800, fontSize: '1rem', color: '#666', margin: '0 0 5px 0' }}>YOU</p>
                            <div className="clay-card" style={{
                                width: 'clamp(80px, 20vw, 120px)',
                                height: 'clamp(80px, 20vw, 120px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                                background: '#f8f9fa'
                            }}>{userMove?.emoji || '❓'}</div>
                        </div>
                        <div style={{ fontSize: 'clamp(1.2rem, 4vw, 2rem)', fontWeight: 900, color: '#FF6B6B' }}>VS</div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontWeight: 800, fontSize: '1rem', color: '#666', margin: '0 0 5px 0' }}>CPU</p>
                            <div className="clay-card" style={{
                                width: 'clamp(80px, 20vw, 120px)',
                                height: 'clamp(80px, 20vw, 120px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 'clamp(2.5rem, 8vw, 4rem)',
                                background: '#f8f9fa'
                            }}>{compMove?.emoji || '❓'}</div>
                        </div>
                    </div>

                    <h3 style={{
                        fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
                        color: '#FF6B6B',
                        height: '1.2em',
                        margin: '10px 0',
                        fontWeight: 900
                    }}>{result}</h3>

                    <p style={{ marginBottom: '15px', fontWeight: 800, color: '#555', fontSize: 'clamp(0.9rem, 3vw, 1.1rem)' }}>Choose your move:</p>
                    <div className="options" style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(10px, 3vw, 20px)' }}>
                        {MOVES.map((m) => (
                            <button
                                key={m.name}
                                className="clay-button"
                                style={{
                                    background: 'white',
                                    fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                                    padding: 'clamp(10px, 2vh, 20px)',
                                    minWidth: 'clamp(70px, 18vw, 100px)',
                                    aspectRatio: '1/1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                                onClick={() => play(m)}
                            >
                                {m.emoji}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RockPaperScissors;
