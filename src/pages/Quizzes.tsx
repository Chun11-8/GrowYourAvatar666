import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAvatarById, saveAvatar } from '../utils/storage';

interface Question {
    id: string | number;
    question: string;
    options: string[];
    answer: string;
    timer?: number;
}

const Quizzes: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { questions = [], avatarId } = (location.state as { questions?: Question[], avatarId?: string }) || { questions: [] };

    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    // Initialize timer correctly for the first question immediately
    const [timeLeft, setTimeLeft] = useState(questions[0]?.timer || 20);
    const [gameState, setGameState] = useState<'playing' | 'feedback' | 'finished'>('playing');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    // Remove separate useEffect for timer initialization to avoid race conditions
    // The timer is now reset in nextQuestion explicitly

    // Timer countdown
    useEffect(() => {
        if (gameState !== 'playing') return;

        if (timeLeft <= 0) {
            handleTimeUp();
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft, gameState]);

    const handleTimeUp = () => {
        setFeedback('wrong');
        setGameState('feedback');
        setTimeout(nextQuestion, 2000);
    };

    const handleAnswer = (option: string) => {
        if (gameState !== 'playing') return;

        setSelectedOption(option);
        const isCorrect = option === questions[currentIndex].answer;

        if (isCorrect) {
            setScore(prev => prev + 1);
            setFeedback('correct');
        } else {
            setFeedback('wrong');
        }

        setGameState('feedback');
        setTimeout(nextQuestion, 2000);
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            const nextIdx = currentIndex + 1;
            setCurrentIndex(nextIdx);

            // Critical Fix: Reset timer BEFORE changing state back to playing
            // This prevents the countdown effect from seeing 0 and triggering timeUp again immediately
            setTimeLeft(questions[nextIdx].timer || 20);

            setGameState('playing');
            setSelectedOption(null);
            setFeedback(null);
        } else {
            // Quiz completed - Save to avatar data
            if (avatarId) {
                const avatar = getAvatarById(avatarId);
                if (avatar) {
                    saveAvatar({ ...avatar, quizCompleted: true });
                    console.log('Quiz completed recorded');
                }
            }
            setGameState('finished');
        }
    };

    // Colors for options (Kids style)
    const optionColors = ['#FFADAD', '#CAFFBF', '#FDFFB6', '#A0C4FF']; // Red, Green, Yellow, Blue pastel

    if (!questions || questions.length === 0) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>No quest found! <button onClick={() => navigate('/game-hub')}>Go Back</button></div>;
    }

    if (gameState === 'finished') {
        return (
            <div className="quiz-game-container" style={{
                background: '#FFD6A5',
                height: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                padding: '20px',
                boxSizing: 'border-box'
            }}>
                <div className="clay-container" style={{
                    textAlign: 'center',
                    padding: 'clamp(20px, 5vw, 40px)',
                    width: '100%',
                    maxWidth: '500px'
                }}>
                    <div style={{ fontSize: 'clamp(3rem, 15vw, 5rem)', marginBottom: '10px' }}>🏆</div>
                    <h1 style={{ color: '#2c3e50', fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', marginBottom: '10px' }}>Quest Complete!</h1>
                    <h2 style={{ color: '#4A90E2', fontSize: 'clamp(1rem, 4vw, 1.5rem)', marginBottom: '20px' }}>You Scored: {score} / {questions.length}</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {score >= 7 ? (
                            <button
                                className="clay-button"
                                onClick={() => navigate('/game-hub', { state: { avatarId } })}
                                style={{ fontSize: 'clamp(1rem, 4vw, 1.3rem)', padding: '12px 20px', background: '#CAFFBF', width: '100%' }}
                            >
                                Adventure Complete! 🏠
                            </button>
                        ) : (
                            <button
                                className="clay-button"
                                onClick={() => navigate('/avatar-view')}
                                style={{ fontSize: 'clamp(1rem, 4vw, 1.3rem)', padding: '12px 20px', background: '#CAFFBF', width: '100%' }}
                            >
                                Try Again 🏠
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];

    return (
        <div className="quiz-game-container" style={{
            background: '#FDCB6E',
            height: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            padding: '15px',
            boxSizing: 'border-box',
            overflow: 'hidden',
            fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif'
        }}>
            {/* Header/Progress */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                color: 'white',
                fontWeight: 800,
                fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)',
                textShadow: '1px 1px 0 rgba(0,0,0,0.1)',
                flexShrink: 0
            }}>
                <div>Question {currentIndex + 1}/{questions.length}</div>
                <div>Score: {score}</div>
            </div>

            {/* Timer Bar */}
            <div style={{
                width: '100%',
                height: 'clamp(12px, 3vh, 18px)',
                background: 'rgba(255,255,255,0.4)',
                borderRadius: '10px',
                marginBottom: '15px',
                overflow: 'hidden',
                flexShrink: 0
            }}>
                <div style={{
                    width: `${(timeLeft / (currentQ.timer || 20)) * 100}%`,
                    height: '100%',
                    background: timeLeft < 5 ? '#FF6B6B' : '#4CD137',
                    transition: 'width 1s linear'
                }}></div>
            </div>

            {/* Question Card */}
            <div className="clay-container" style={{
                background: 'white',
                padding: 'clamp(15px, 4vw, 25px)',
                flex: '0 1 auto',
                minHeight: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                marginBottom: '20px',
                position: 'relative',
                borderRadius: '20px'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '-30px',
                    background: '#54a0ff',
                    color: 'white',
                    width: 'clamp(50px, 12vw, 70px)',
                    height: 'clamp(50px, 12vw, 70px)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'clamp(1.5rem, 5vw, 2rem)',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                    border: '4px solid white'
                }}>
                    ?
                </div>
                <h2 style={{
                    fontSize: 'clamp(1.1rem, 4.5vw, 1.6rem)',
                    color: '#2d3436',
                    marginTop: '15px',
                    lineHeight: 1.3
                }}>
                    {currentQ.question}
                </h2>
            </div>

            {/* Feedback Message */}
            <div style={{
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px',
                flexShrink: 0
            }}>
                {gameState === 'feedback' && feedback && (
                    <div style={{ fontSize: 'clamp(1.1rem, 4vw, 1.4rem)', fontWeight: 'bold', color: feedback === 'correct' ? '#4CD137' : '#FF6B6B' }}>
                        {feedback === 'correct' ? '🎉 Correct!' : '😢 Oops!'}
                    </div>
                )}
            </div>

            {/* Options */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(8px, 2vh, 12px)',
                flex: 1,
                justifyContent: 'center'
            }}>
                {currentQ.options.map((opt, idx) => {
                    let bgColor = 'white';
                    let borderColor = 'transparent';

                    if (gameState === 'feedback') {
                        if (opt === currentQ.answer) {
                            bgColor = '#CAFFBF';
                            borderColor = '#4CD137';
                        } else if (opt === selectedOption) {
                            bgColor = '#FFADAD';
                            borderColor = '#FF6B6B';
                        }
                    }

                    return (
                        <button
                            key={idx}
                            disabled={gameState !== 'playing'}
                            onClick={() => handleAnswer(opt)}
                            className="clay-button"
                            style={{
                                background: bgColor,
                                color: '#333',
                                textAlign: 'left',
                                padding: 'clamp(10px, 2.5vh, 15px) 15px',
                                fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)',
                                display: 'flex',
                                alignItems: 'center',
                                border: gameState === 'feedback' && (opt === currentQ.answer || opt === selectedOption)
                                    ? `3px solid ${borderColor}`
                                    : '3px solid white',
                                transform: gameState !== 'playing' ? 'none' : undefined,
                                width: '100%',
                                boxSizing: 'border-box'
                            }}
                        >
                            <div style={{
                                background: optionColors[idx % 4],
                                width: 'clamp(30px, 8vw, 40px)',
                                height: 'clamp(30px, 8vw, 40px)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '12px',
                                fontWeight: 800,
                                fontSize: 'clamp(0.9rem, 3.5vw, 1.1rem)',
                                color: '#555',
                                flexShrink: 0
                            }}>
                                {['A', 'B', 'C', 'D'][idx]}
                            </div>
                            <span style={{
                                flex: 1,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {opt}
                            </span>
                            {gameState === 'feedback' && opt === currentQ.answer && <span style={{ marginLeft: '10px' }}>✅</span>}
                            {gameState === 'feedback' && opt === selectedOption && opt !== currentQ.answer && <span style={{ marginLeft: '10px' }}>❌</span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default Quizzes;
