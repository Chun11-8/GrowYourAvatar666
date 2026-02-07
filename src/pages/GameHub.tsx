import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface GameInfo {
    id: string;
    title: string;
    emoji: string;
    skills: string[];
    path: string;
    color: string;
}

export const MINI_GAMES: GameInfo[] = [
    { id: 'shape-matching', title: 'Shape Match', emoji: '📐', skills: ['Shapes', 'Colors'], path: '/game/shape-matching', color: '#FFADAD' },
    { id: 'alphabet-tap', title: 'Alphabet', emoji: '🔤', skills: ['Letters', 'Phonics'], path: '/game/alphabet-tap', color: '#FFD6A5' },
    { id: 'counting', title: 'Counting', emoji: '🔢', skills: ['Counting', 'Numbers'], path: '/game/counting', color: '#FDFFB6' },
    { id: 'memory', title: 'Memory', emoji: '🧠', skills: ['Memory', 'Attention'], path: '/game/memory', color: '#CAFFBF' },
    { id: 'color-sorting', title: 'Colors', emoji: '🎨', skills: ['Classification', 'Colors'], path: '/game/color-sorting', color: '#9BFBC0' },
    { id: 'maze', title: 'Maze', emoji: '🌀', skills: ['Logic', 'Spatial'], path: '/game/maze', color: '#A0C4FF' },
    { id: 'sound-matching', title: 'Sounds', emoji: '🔊', skills: ['Listening', 'Language'], path: '/game/sound-matching', color: '#BDB2FF' },
    { id: 'patterns', title: 'Patterns', emoji: '🔄', skills: ['Logic', 'Sequencing'], path: '/game/patterns', color: '#FFC6FF' },
    { id: 'size-comp', title: 'Sizes', emoji: '⚖️', skills: ['Comparison', 'Reasoning'], path: '/game/size-comp', color: '#FFFFFC' },
    { id: 'number-order', title: 'Order', emoji: '📏', skills: ['Sequencing', 'Numbers'], path: '/game/number-order', color: '#FFD1DC' },
    { id: 'tic-tac-toe', title: 'Tic-Tac-Toe', emoji: '❌', skills: ['Logic', 'Turns'], path: '/game/tic-tac-toe', color: '#E2F0CB' },
    { id: 'rps', title: 'Rock Paper', emoji: '✊', skills: ['Rules', 'Decisions'], path: '/game/rps', color: '#C7CEEA' },
    { id: 'sudoku', title: 'Sudoku', emoji: '🧩', skills: ['Logic', 'Numbers'], path: '/game/sudoku', color: '#FF9AA2' },
    { id: 'connect', title: 'Connect 3', emoji: '🔴', skills: ['Strategy', 'Patterns'], path: '/game/connect', color: '#B5EAD7' },
    { id: 'simon', title: 'Simon', emoji: '🔔', skills: ['Memory', 'Sequencing'], path: '/game/simon', color: '#FFDAC1' },
];

const ProgressBar = () => {
    // Fun chunky progress bar
    const stepStyle: React.CSSProperties = {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: '4px solid white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        background: '#eee',
        position: 'relative',
        zIndex: 2,
        boxShadow: '0 4px 0 rgba(0,0,0,0.1)'
    };

    const activeStyle: React.CSSProperties = {
        ...stepStyle,
        background: 'var(--vibrant-yellow)',
        color: 'white',
        transform: 'scale(1.1)',
        boxShadow: '0 6px 0 rgba(0,0,0,0.1)'
    };

    const completedStyle: React.CSSProperties = {
        ...stepStyle,
        background: 'var(--vibrant-green)',
        color: 'white',
    };

    // Connecting line with stripes
    const lineStyle: React.CSSProperties = {
        position: 'absolute',
        top: '25px',
        left: '20px',
        right: '20px',
        height: '10px',
        background: 'linear-gradient(45deg, #ddd 25%, #ccc 25%, #ccc 50%, #ddd 50%, #ddd 75%, #ccc 75%, #ccc 100%)',
        backgroundSize: '20px 20px',
        borderRadius: '10px',
        zIndex: 1,
    };

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: '350px', margin: '0 auto 2rem auto', paddingTop: '10px' }}>
            <div style={lineStyle}>
                {/* Fill for completed steps */}
                <div style={{ width: '50%', height: '100%', background: 'var(--vibrant-green)', borderRadius: '10px', transition: 'width 0.5s' }}></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                {/* Step 1: Quiz (Done) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={completedStyle}>📝</div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '8px', color: 'var(--text-color)' }}>Quiz</span>
                </div>

                {/* Step 2: Game Hub (Active) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div className="animate-bounce" style={activeStyle}>🎮</div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '8px', color: 'var(--vibrant-blue)' }}>Games</span>
                </div>

                {/* Step 3: Flag (Pending) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={stepStyle}>🚩</div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '8px', color: '#aaa' }}>Goal</span>
                </div>
            </div>
        </div>
    );
};

const GameHub: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};

    return (
        <div className="game-hub-container" style={{
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            background: '#F0F4F8',
            padding: '10px'
        }}>
            {/* Header / Nav */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem', flexShrink: 0 }}>
                <button
                    className="clay-button secondary"
                    style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onClick={() => navigate('/avatar-view', { state: { avatarId } })}
                >
                    ⬅️
                </button>
                <div style={{ flex: 1, textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', margin: 0, color: 'var(--vibrant-purple)' }}>
                        Game Time!
                    </h1>
                </div>
                <div style={{ width: '40px' }}></div> {/* Spacer for symmetry */}
            </div>

            <div className="clay-container" style={{
                background: 'rgba(255,255,255,0.9)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                padding: 'clamp(10px, 3vw, 20px)'
            }}>

                <div style={{ flexShrink: 0 }}>
                    <ProgressBar />
                    <p style={{ textAlign: 'center', marginBottom: '1rem', fontSize: 'clamp(0.9rem, 3vw, 1.1rem)', color: '#666' }}>
                        Pick a game to earn treats! 🦴
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 'clamp(8px, 2vw, 20px)',
                    padding: '5px',
                    overflowY: 'auto',
                    flex: 1,
                    alignContent: 'start' // Ensures items don't stretch to fill height if few
                }}>
                    {MINI_GAMES.map((game) => (
                        <div
                            key={game.id}
                            className="clay-card"
                            style={{
                                cursor: 'pointer',
                                textAlign: 'center',
                                background: `linear-gradient(135deg, white 0%, ${game.color} 100%)`,
                                border: '2px solid white',
                                padding: 'clamp(8px, 2vw, 15px)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                aspectRatio: '1/1.1', // Maintain a nice aspect ratio
                                position: 'relative',
                                overflow: 'hidden',
                                borderRadius: '16px'
                            }}
                            onClick={() => navigate(game.path, { state: { avatarId } })}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px) scale(1.03)';
                                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '';
                            }}
                        >
                            <div style={{
                                fontSize: 'clamp(2rem, 8vw, 2.5rem)',
                                marginBottom: '5px',
                                filter: 'drop-shadow(0 4px 0 rgba(0,0,0,0.1))',
                                transition: 'transform 0.2s'
                            }}
                                className="emoji-icon"
                            >{game.emoji}</div>

                            <h3 style={{
                                fontSize: 'clamp(0.7rem, 2.5vw, 1rem)',
                                marginBottom: '2px',
                                color: '#444',
                                lineHeight: '1.2',
                                fontWeight: 800
                            }}>{game.title}</h3>

                            {/* Skill Tag - Optional on very small screens or make very small */}
                            <div style={{
                                fontSize: 'clamp(0.5rem, 2vw, 0.65rem)',
                                background: 'rgba(255,255,255,0.6)',
                                padding: '2px 6px',
                                borderRadius: '8px',
                                marginTop: '2px',
                                fontWeight: 700,
                                color: '#666'
                            }}>
                                {game.skills[0]}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    );
};

export default GameHub;
