import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Question {
    id: string;
    question: string;
    options: string[];
    answer: string;
}

const ManualQuizInput: React.FC = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<Question[]>(
        Array.from({ length: 10 }, (_, i) => ({
            id: Math.random().toString(36).substr(2, 9),
            question: '',
            options: ['', '', '', ''],
            answer: ''
        }))
    );

    const handleQuestionTextChange = (id: string, value: string) => {
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, question: value } : q));
    };

    const handleOptionChange = (qId: string, optIndex: number, value: string) => {
        setQuestions(prev => prev.map(q => {
            if (q.id === qId) {
                const newOptions = [...q.options];
                newOptions[optIndex] = value;
                return { ...q, options: newOptions };
            }
            return q;
        }));
    };

    const handleAnswerSelect = (qId: string, optionValue: string) => {
        setQuestions(prev => prev.map(q => q.id === qId ? { ...q, answer: optionValue } : q));
    };

    const handleSubmit = () => {
        // Validation: No unfilled fields
        const isValid = questions.every(q =>
            q.question.trim() !== '' &&
            q.options.every(opt => opt.trim() !== '') &&
            q.answer.trim() !== ''
        );

        if (!isValid) {
            alert('Please fill in all 10 questions, options, and select a correct answer for each!');
            return;
        }

        // Navigate to QuizReview with the questions
        navigate('/quiz-review', { state: { importedQuestions: questions } });
    };

    return (
        <div className="quiz-input-container" style={{
            width: '100%',
            maxWidth: '600px',
            padding: '10px',
            margin: '0 auto',
            boxSizing: 'border-box',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div className="clay-container" style={{
                background: '#f8f9fa',
                padding: 'clamp(12px, 3vw, 20px)',
                width: '100%',
                boxSizing: 'border-box',
                borderRadius: '24px',
                flex: 1
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '15px'
                }}>
                    <button
                        className="clay-button secondary"
                        onClick={() => navigate('/upload-quiz')}
                        style={{ padding: '8px 12px', fontSize: '0.8rem', minWidth: 'auto' }}
                    >
                        ← BACK
                    </button>
                    <h1 style={{
                        fontSize: 'clamp(1.2rem, 4.5vw, 1.6rem)',
                        color: '#4A90E2',
                        margin: 0,
                        textAlign: 'center',
                        flex: 1,
                        fontWeight: 900
                    }}>Creating Your Quest! ✍️</h1>
                </div>

                <p style={{
                    textAlign: 'center',
                    marginBottom: '20px',
                    color: '#666',
                    fontWeight: 600,
                    fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                    lineHeight: 1.4
                }}>
                    Fill in <span style={{ color: '#4A90E2', fontSize: '1.2rem', fontWeight: 800 }}>10</span> fun questions for your adventure!<br />
                    <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(Complete all fields to proceed)</span>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {questions.map((q, index) => (
                        <div key={q.id} className="clay-card" style={{
                            background: 'white',
                            padding: 'clamp(12px, 3vw, 18px)',
                            borderLeft: '6px solid #FFD6A5',
                            position: 'relative',
                            width: '100%',
                            boxSizing: 'border-box',
                            borderRadius: '20px'
                        }}>
                            <h3 style={{ marginBottom: '10px', color: '#555', fontSize: '1rem', fontWeight: 800 }}>Question {index + 1}</h3>
                            <input
                                type="text"
                                placeholder="What is the question?"
                                value={q.question}
                                onChange={(e) => handleQuestionTextChange(q.id, e.target.value)}
                                className="clay-input"
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    marginBottom: '12px',
                                    borderRadius: '12px',
                                    border: '3px solid #E0E0E0',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    background: '#fff'
                                }}
                            />

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                gap: '8px'
                            }}>
                                {q.options.map((opt, optIdx) => (
                                    <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input
                                            type="text"
                                            placeholder={`Option ${optIdx + 1}`}
                                            value={opt}
                                            onChange={(e) => handleOptionChange(q.id, optIdx, e.target.value)}
                                            className="clay-input"
                                            style={{
                                                flex: 1,
                                                padding: '8px 12px',
                                                borderRadius: '10px',
                                                border: '3px solid',
                                                borderColor: q.answer === opt && opt !== '' ? '#4A90E2' : '#E0E0E0',
                                                fontSize: '0.85rem',
                                                outline: 'none',
                                                background: 'white',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                        <div
                                            onClick={() => opt.trim() !== '' && handleAnswerSelect(q.id, opt)}
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: '50%',
                                                border: '3px solid #E0E0E0',
                                                borderColor: q.answer === opt && opt !== '' ? '#4A90E2' : '#E0E0E0',
                                                background: q.answer === opt && opt !== '' ? '#4A90E2' : 'white',
                                                cursor: opt.trim() === '' ? 'not-allowed' : 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.7rem',
                                                color: 'white',
                                                flexShrink: 0,
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {q.answer === opt && opt !== '' ? '✓' : ''}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className="clay-button"
                    style={{
                        width: '100%',
                        marginTop: '25px',
                        padding: '15px',
                        fontSize: '1.2rem',
                        fontWeight: 900,
                        background: '#CAFFBF',
                        color: '#2d3436',
                        boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
                        borderRadius: '15px'
                    }}
                    onClick={handleSubmit}
                >
                    SAVE & PLAY! 🚀
                </button>
            </div>
            <style>{`
                .clay-input:focus {
                    border-color: #4A90E2 !important;
                    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
                }
                .clay-input {
                    transition: all 0.2s ease !important;
                }
                @media (min-width: 480px) {
                    .quiz-input-container {
                        padding: 20px;
                    }
                    .options-grid {
                        grid-template-columns: 1fr 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default ManualQuizInput;
