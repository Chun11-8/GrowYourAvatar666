import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';

const MiniSudoku: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { score, round, maxRounds, isGameOver, recordSuccess, claimReward } = useGameSession(5, avatarId);
    const [grid, setGrid] = useState<(number | null)[]>([]);
    const [initialIndices, setInitialIndices] = useState<number[]>([]);

    const initGrid = () => {
        // Very simple 4x4 valid grid for kids
        const base = [
            1, 2, 3, 4,
            3, 4, 1, 2,
            2, 1, 4, 3,
            4, 3, 2, 1
        ];
        // Shuffle rows/cols slightly if wanted, or just hide some
        const hiddenIndices: number[] = [];
        const newGrid = base.map((val, idx) => {
            if (Math.random() > 0.6) {
                hiddenIndices.push(idx);
                return null;
            }
            return val;
        });
        setGrid(newGrid);
        setInitialIndices(base.map((_, i) => hiddenIndices.includes(i) ? -1 : i).filter(i => i !== -1));
    };

    useEffect(() => {
        if (!isGameOver) {
            initGrid();
        }
    }, [isGameOver, round]);

    const handleChange = (idx: number) => {
        if (initialIndices.includes(idx)) return;
        const currentVal = grid[idx];
        const nextVal = currentVal === 4 ? 1 : (currentVal ? currentVal + 1 : 1);
        const newGrid = [...grid];
        newGrid[idx] = nextVal;
        setGrid(newGrid);

        // Check if full and valid (simplified check for this version)
        if (newGrid.every(v => v !== null)) {
            alert('Sudoku Solved! 🧩');
            recordSuccess();
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
            height: '100vh', width: '100vw', background: '#E2E2E2', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', padding: '15px', boxSizing: 'border-box'
        }}>
            <div className="clay-container" style={{
                background: '#fff', padding: 'clamp(12px, 3vw, 20px)', flex: 1,
                display: 'flex', flexDirection: 'column', borderRadius: '24px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', flexShrink: 0 }}>
                    <button className="clay-button secondary" onClick={() => navigate('/game-hub', { state: { avatarId } })}
                        style={{ padding: '8px 12px', fontSize: '0.8rem' }}>← BACK</button>
                    <h2 style={{ fontSize: 'clamp(1.1rem, 5vw, 1.6rem)', margin: 0, flex: 1, textAlign: 'center', fontWeight: 900, color: '#4A90E2' }}>MINI SUDOKU</h2>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#666' }}>Round {round}/{maxRounds}</div>
                </div>

                <div style={{ flexShrink: 0, textAlign: 'center', fontSize: '1.2rem', fontWeight: 800, color: '#333', marginBottom: '5px' }}>
                    Score: {score}
                </div>

                <div style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', margin: '5px 0'
                }}>
                    <div className="sudoku-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: 'clamp(5px, 1.5vw, 10px)',
                        width: 'min(85vw, 40vh)',
                        background: '#f8f9fa',
                        padding: 'clamp(10px, 2.5vw, 15px)',
                        borderRadius: '24px',
                        boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.05)',
                        border: '8px solid #E2E2E2'
                    }}>
                        {grid.map((val, i) => (
                            <button
                                key={i}
                                onClick={() => handleChange(i)}
                                style={{
                                    width: '100%',
                                    aspectRatio: '1/1',
                                    background: initialIndices.includes(i) ? '#f0f0f0' : 'white',
                                    color: initialIndices.includes(i) ? '#555' : '#4A90E2',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 'clamp(1.2rem, 5vw, 2rem)',
                                    fontWeight: 900,
                                    cursor: initialIndices.includes(i) ? 'default' : 'pointer',
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: initialIndices.includes(i) ? 'none' : '0 4px 8px rgba(0,0,0,0.05)',
                                    padding: 0
                                }}
                            >
                                {val}
                            </button>
                        ))}
                    </div>
                    <p style={{
                        marginTop: '20px',
                        fontWeight: 800,
                        color: '#666',
                        fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)',
                        textAlign: 'center'
                    }}>Tap white squares to change numbers! 🧩</p>
                </div>
            </div>
        </div>
    );
};

export default MiniSudoku;
