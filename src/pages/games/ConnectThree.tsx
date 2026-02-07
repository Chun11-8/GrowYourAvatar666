import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';

const COLS = 5;
const ROWS = 4;

const ConnectThree: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { round, maxRounds, isGameOver, recordSuccess, recordFailure, claimReward } = useGameSession(5, avatarId);
    const [board, setBoard] = useState<(string | null)[][]>(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    const [isRedNext, setIsRedNext] = useState(true);
    const [winner, setWinner] = useState<string | null>(null);

    const checkWin = (b: (string | null)[][]) => {
        // Horizontal, Vertical, Diagonal checks
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const player = b[r][c];
                if (!player) continue;
                // Check right
                if (c <= COLS - 3 && player === b[r][c + 1] && player === b[r][c + 2]) return player;
                // Check down
                if (r <= ROWS - 3 && player === b[r + 1][c] && player === b[r + 2][c]) return player;
                // Check diag right
                if (r <= ROWS - 3 && c <= COLS - 3 && player === b[r + 1][c + 1] && player === b[r + 2][c + 2]) return player;
                // Check diag left
                if (r <= ROWS - 3 && c >= 2 && player === b[r + 1][c - 1] && player === b[r + 2][c - 2]) return player;
            }
        }
        return null;
    };

    const drop = (c: number) => {
        if (winner || isGameOver) return;
        const newBoard = board.map(row => [...row]);
        for (let r = ROWS - 1; r >= 0; r--) {
            if (!newBoard[r][c]) {
                newBoard[r][c] = isRedNext ? '🔴' : '🟡';
                setBoard(newBoard);
                setIsRedNext(!isRedNext);
                const win = checkWin(newBoard);
                if (win) {
                    setWinner(win);
                    if (win === '🔴') {
                        recordSuccess();
                    } else {
                        recordFailure();
                    }
                }
                break;
            }
        }
    };

    const handleNextRound = () => {
        setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
        setWinner(null);
        setIsRedNext(true);
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
                    <h2 style={{ fontSize: 'clamp(1.1rem, 5vw, 1.6rem)', margin: 0, flex: 1, textAlign: 'center', fontWeight: 900, color: '#4A90E2' }}>CONNECT-3</h2>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#666' }}>Round {round}/{maxRounds}</div>
                </div>

                <div style={{ flexShrink: 0, textAlign: 'center', fontSize: '1.2rem', fontWeight: 800, color: '#333', marginBottom: '5px' }}>
                    {winner ? `Winner: ${winner}! 🎉` : `Turn: ${isRedNext ? '🔴' : '🟡'}`}
                </div>

                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', margin: '5px 0'
                }}>
                    <div className="connect-grid" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 'clamp(5px, 1.5vw, 12px)',
                        background: '#A0C4FF',
                        padding: 'clamp(10px, 2vw, 15px)',
                        borderRadius: '24px',
                        width: 'fit-content',
                        margin: '0 auto',
                        boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.1)'
                    }}>
                        {Array.from({ length: COLS }).map((_, c) => (
                            <div key={c} onClick={() => drop(c)} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(5px, 1.5vw, 12px)', cursor: 'pointer' }}>
                                {Array.from({ length: ROWS }).map((_, r) => (
                                    <div key={r} style={{
                                        width: 'clamp(45px, 12vw, 65px)',
                                        height: 'clamp(45px, 12vw, 65px)',
                                        background: 'white',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
                                        boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.05)'
                                    }}>
                                        {board[r][c]}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ flexShrink: 0, textAlign: 'center', padding: '10px 0' }}>
                    {winner && (
                        <button className="clay-button" onClick={handleNextRound}
                            style={{ padding: '12px 30px', fontSize: '1.1rem' }}>NEXT ROUND 🚀</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConnectThree;
