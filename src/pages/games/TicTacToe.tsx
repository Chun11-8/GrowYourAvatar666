import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';

const TicTacToe: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { round, maxRounds, isGameOver, recordSuccess, recordFailure, claimReward } = useGameSession(5, avatarId);
    const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState<string | null>(null);

    const checkWinner = (squares: (string | null)[]) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const handleClick = (i: number) => {
        if (winner || board[i] || isGameOver) return;
        const newBoard = [...board];
        newBoard[i] = 'X';
        setBoard(newBoard);
        setIsXNext(false);
        const win = checkWinner(newBoard);
        if (win) {
            setWinner(win);
            if (win === 'X') {
                recordSuccess();
            } else {
                recordFailure();
            }
        } else if (newBoard.every(s => s !== null)) {
            setWinner('Draw');
            recordFailure();
        }
    };

    useEffect(() => {
        if (!isXNext && !winner) {
            const timer = setTimeout(() => {
                const emptyIndices = board.map((s, i) => s === null ? i : null).filter(i => i !== null) as number[];
                if (emptyIndices.length > 0) {
                    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
                    const newBoard = [...board];
                    newBoard[randomIndex] = 'O';
                    setBoard(newBoard);
                    setIsXNext(true);
                    const win = checkWinner(newBoard);
                    if (win) {
                        setWinner(win);
                        recordFailure();
                    } else if (newBoard.every(s => s !== null)) {
                        setWinner('Draw');
                        recordFailure();
                    }
                }
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isXNext, winner, board]);

    const reset = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
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
                    <h2 style={{ fontSize: 'clamp(1.2rem, 5vw, 1.8rem)', margin: 0, flex: 1, textAlign: 'center', fontWeight: 900, color: '#4A90E2' }}>TIC-TAC-TOE</h2>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#666' }}>Round {round}/{maxRounds}</div>
                </div>

                <div style={{
                    textAlign: 'center',
                    margin: '10px 0',
                    fontSize: 'clamp(1.1rem, 4.5vw, 1.5rem)',
                    fontWeight: 800,
                    color: '#2d3436',
                    flexShrink: 0
                }}>
                    {winner ? (winner === 'Draw' ? "It's a Tie! 🤝" : `${winner === 'X' ? 'You' : 'Computer'} Wins! 🏆`) : (isXNext ? 'Your Turn (X) ✨' : 'Computer thinking... 🤖')}
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <div className="ttt-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 'clamp(8px, 2vw, 15px)',
                        width: 'min(80vw, 45vh)',
                        height: 'min(80vw, 45vh)',
                        margin: '0 auto'
                    }}>
                        {board.map((val, i) => (
                            <button
                                key={i}
                                className="clay-card"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    background: 'white',
                                    fontSize: 'clamp(1.5rem, 8vw, 2.5rem)',
                                    color: val === 'X' ? '#FF6B6B' : '#4A90E2',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: 'none',
                                    padding: 0
                                }}
                                onClick={() => handleClick(i)}
                            >
                                {val}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ flexShrink: 0, marginTop: '20px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {winner && (
                        <button className="clay-button" style={{ padding: '12px 30px', background: '#CAFFBF' }} onClick={reset}>
                            Next Round ➞
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicTacToe;
