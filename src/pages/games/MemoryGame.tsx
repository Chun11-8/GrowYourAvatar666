import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSession } from '../../hooks/useGameSession';
import congratulations from '../../assets/congratulations.png';

const EMOJIS = ['🍎', '🐶', '🍕', '🚗', '🎈']; // 5 pairs for 5 rounds

interface Card {
    id: number;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean;
}

const MemoryGame: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};
    const { score, maxRounds, isGameOver, recordSuccess, claimReward } = useGameSession(5, avatarId); // 5 Pairs = 5 Points = Game Over
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    // const [score, setScore] = useState(0);

    const initGame = () => {
        const doubled = [...EMOJIS, ...EMOJIS]
            .sort(() => Math.random() - 0.5)
            .map((emoji, idx) => ({
                id: idx,
                emoji,
                isFlipped: false,
                isMatched: false,
            }));
        setCards(doubled);
        setFlippedIndices([]);
        // setScore(0);
    };

    useEffect(() => {
        initGame();
    }, []);

    const handleFlip = (idx: number) => {
        if (flippedIndices.length === 2 || cards[idx].isFlipped || cards[idx].isMatched) return;

        const newCards = [...cards];
        newCards[idx].isFlipped = true;
        setCards(newCards);

        const newFlipped = [...flippedIndices, idx];
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            const [first, second] = newFlipped;
            if (cards[first].emoji === cards[second].emoji) {
                setTimeout(() => {
                    const matchedCards = [...cards];
                    matchedCards[first].isMatched = true;
                    matchedCards[second].isMatched = true;
                    setCards(matchedCards);
                    setFlippedIndices([]);
                    recordSuccess();
                    if (matchedCards.every(c => c.isMatched)) {
                        alert('You found them all! 🎉');
                        // initGame(); // Don't auto-restart, let Game Over screen handle
                    }
                }, 500);
            } else {
                setTimeout(() => {
                    const resetCards = [...cards];
                    resetCards[first].isFlipped = false;
                    resetCards[second].isFlipped = false;
                    setCards(resetCards);
                    setFlippedIndices([]);
                }, 1000);
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

    return (
        <div className="game-container" style={{
            height: '100vh', width: '100vw', background: '#FFC8DD', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', padding: '15px', boxSizing: 'border-box'
        }}>
            <div className="clay-container" style={{
                background: '#fff', padding: 'clamp(12px, 3vw, 20px)', flex: 1,
                display: 'flex', flexDirection: 'column', borderRadius: '24px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', flexShrink: 0 }}>
                    <button className="clay-button secondary" onClick={() => navigate('/game-hub', { state: { avatarId } })}
                        style={{ padding: '8px 12px', fontSize: '0.8rem' }}>← BACK</button>
                    <h2 style={{ fontSize: 'clamp(1.2rem, 5vw, 1.8rem)', margin: 0, flex: 1, textAlign: 'center', fontWeight: 900, color: '#FF758F' }}>MEMORY MATCH</h2>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#666' }}>Pairs {score}/{maxRounds}</div>
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', margin: '10px 0' }}>
                    <div className="cards-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: 'clamp(6px, 1.5vw, 12px)',
                        width: 'min(90vw, 55vh)',
                        margin: '0 auto'
                    }}>
                        {cards.map((card, idx) => (
                            <div
                                key={card.id}
                                className="clay-card"
                                style={{
                                    aspectRatio: '1/1',
                                    background: card.isFlipped || card.isMatched ? 'white' : '#A2D2FF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'none',
                                    padding: 0
                                }}
                                onClick={() => handleFlip(idx)}
                            >
                                <div style={{ transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : 'none' }}>
                                    {card.isFlipped || card.isMatched ? card.emoji : '❓'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <button className="clay-button secondary" style={{ fontSize: '0.8rem', padding: '8px 20px' }} onClick={initGame}>
                        RESTART BOARD 🔄
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MemoryGame;
