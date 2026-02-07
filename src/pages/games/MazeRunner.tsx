import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';



const MazeRunner: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { round, maxRounds, isGameOver, recordSuccess, claimReward } = useGameSession(5, avatarId);

    // Dynamic grid size: starts at 5, increases with round
    const gridSize = 4 + round;

    const [maze, setMaze] = useState<number[][]>([]);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [target, setTarget] = useState({ x: gridSize - 1, y: gridSize - 1 });

    // Randomized Maze Generation (Simple DFS)
    const generateRandomMaze = (size: number) => {
        const newMaze = Array(size).fill(0).map(() => Array(size).fill(1));

        const walk = (x: number, y: number) => {
            newMaze[y][x] = 0;
            const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]].sort(() => Math.random() - 0.5);

            for (const [dx, dy] of dirs) {
                const nx = x + dx * 2, ny = y + dy * 2;
                if (nx >= 0 && nx < size && ny >= 0 && ny < size && newMaze[ny][nx] === 1) {
                    newMaze[y + dy][x + dx] = 0;
                    walk(nx, ny);
                }
            }
        };

        walk(0, 0);

        // Ensure the path to target is clear if the walk missed it
        newMaze[size - 1][size - 1] = 0;
        if (newMaze[size - 2][size - 1] === 1 && newMaze[size - 1][size - 2] === 1) {
            newMaze[size - 2][size - 1] = 0;
        }

        // Add some random "openness" for kids
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (Math.random() > 0.8) newMaze[i][j] = 0;
            }
        }

        return newMaze;
    };

    // Update maze when round changes
    React.useEffect(() => {
        const newSize = 4 + round;
        setMaze(generateRandomMaze(newSize));
        setPos({ x: 0, y: 0 });
        setTarget({ x: newSize - 1, y: newSize - 1 });
    }, [round]);

    const move = (dx: number, dy: number) => {
        const nx = pos.x + dx;
        const ny = pos.y + dy;

        if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize && maze[ny][nx] === 0) {
            setPos({ x: nx, y: ny });
            if (nx === target.x && ny === target.y) {
                setTimeout(() => {
                    recordSuccess();
                }, 100);
            }
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

    if (maze.length === 0) return null;

    return (
        <div className="game-container" style={{
            height: '100vh', width: '100vw', background: '#FDCB6E', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', padding: '15px', boxSizing: 'border-box'
        }}>
            <div className="clay-container" style={{
                background: '#fff', padding: 'clamp(12px, 3vw, 20px)', flex: 1,
                display: 'flex', flexDirection: 'column', borderRadius: '24px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', flexShrink: 0 }}>
                    <button className="clay-button secondary" onClick={() => navigate('/game-hub', { state: { avatarId } })}
                        style={{ padding: '8px 12px', fontSize: '0.8rem' }}>← BACK</button>
                    <h2 style={{ fontSize: 'clamp(1.2rem, 5vw, 1.8rem)', margin: 0, flex: 1, textAlign: 'center', fontWeight: 900, color: '#4A90E2' }}>MAZE QUEST</h2>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#666' }}>Round {round}/{maxRounds}</div>
                </div>

                <div style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', width: '100%', margin: '10px 0'
                }}>
                    <div className="maze-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                        gap: '4px',
                        width: 'min(85vw, 65vh)',
                        height: 'min(85vw, 65vh)',
                        background: '#f0f0f0',
                        padding: '8px',
                        borderRadius: '15px',
                        boxSizing: 'border-box'
                    }}>
                        {maze.map((row, y) => row.map((cell, x) => (
                            <div key={`${x}-${y}`} style={{
                                width: '100%',
                                height: '100%',
                                background: cell === 1 ? '#4A4A4A' : 'white',
                                borderRadius: '4px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}>
                                {(pos.x === x && pos.y === y) || (target.x === x && target.y === y) ? (
                                    <span style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        fontSize: `calc(min(85vw, 65vh) / ${gridSize} * 0.7)`,
                                        lineHeight: 1
                                    }}>
                                        {pos.x === x && pos.y === y ? '🐥' : '⭐'}
                                    </span>
                                ) : null}
                            </div>
                        )))}
                    </div>
                </div>

                <div className="controls-section" style={{ flexShrink: 0 }}>
                    <div className="controls" style={{
                        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px',
                        width: '180px', margin: '0 auto'
                    }}>
                        <div></div>
                        <button className="clay-button" style={{ padding: '12px' }} onClick={() => move(0, -1)}>▲</button>
                        <div></div>
                        <button className="clay-button" style={{ padding: '12px' }} onClick={() => move(-1, 0)}>◀</button>
                        <button className="clay-button" style={{ padding: '12px' }} onClick={() => move(0, 1)}>▼</button>
                        <button className="clay-button" style={{ padding: '12px' }} onClick={() => move(1, 0)}>▶</button>
                    </div>
                    <p style={{ marginTop: '10px', fontWeight: 700, fontSize: '0.85rem', textAlign: 'center', color: '#666' }}>
                        Help the chick find the star! ✨
                    </p>
                </div>
            </div>
            <style>{`
                @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
};

export default MazeRunner;
