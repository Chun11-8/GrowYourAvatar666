import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Question {
    id: string | number;
    question: string;
    options: string[];
    answer: string;
    timer?: number; // Optional per-question timer
}

const QuizReview: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Default empty state or load from navigation
    const [questions, setQuestions] = useState<Question[]>([]);
    const [globalTimer, setGlobalTimer] = useState(20); // Default 20s

    useEffect(() => {
        if (location.state?.importedQuestions) {
            // Map imported questions to include default timer
            const mapped = (location.state.importedQuestions as any[]).map(q => ({
                ...q,
                id: q.id || Math.random().toString(36).substr(2, 9),
                options: q.options || ['', '', '', ''],
                timer: q.timer || 20
            }));
            setQuestions(mapped);
        } else {
            // Fallback for manual testing or direct navigation
            setQuestions([
                { id: '1', question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], answer: '4', timer: 20 }
            ]);
        }
    }, [location.state]);

    const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
        const newQuestions = [...questions];
        const newOptions = [...newQuestions[qIndex].options];
        newOptions[optIndex] = value;
        newQuestions[qIndex].options = newOptions;

        // If the edited option was the answer, update the answer too (optional but good UX)
        // ideally we store answer index, but here we store answer text string from Gemini
        // simplified: user must manually ensure answer text matches one option if they change option logic entirely
        setQuestions(newQuestions);
    };

    const handleGlobalTimerChange = (val: number) => {
        // Clamp between 5 and 60
        const clamped = Math.min(60, Math.max(5, val));
        setGlobalTimer(clamped);
        // Update all existing
        setQuestions(prev => prev.map(q => ({ ...q, timer: clamped })));
    };

    const handleStartQuiz = () => {
        // Validate
        const isValid = questions.every(q =>
            q.question.trim() &&
            q.options.every(o => o.trim()) &&
            q.answer.trim()
        );

        if (!isValid) {
            alert("Please ensure all fields are filled!");
            return;
        }

        navigate('/quizzes', { state: { questions } });
    };

    return (
        <div className="quiz-review-container" style={{ width: '100%', maxWidth: '800px', padding: '20px', margin: '0 auto' }}>
            <div className="clay-container" style={{ background: '#f8f9fa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <button className="clay-button secondary" onClick={() => navigate(-1)}>← Back</button>
                    <h2 style={{ color: '#2c3e50', margin: 0 }}>Review Your Quest 🛡️</h2>
                </div>

                <div className="clay-card" style={{ marginBottom: '20px', padding: '15px', background: 'white' }}>
                    <label style={{ fontWeight: 700, color: '#555', marginRight: '10px' }}>⏳ Time per question (max 60s):</label>
                    <input
                        type="number"
                        value={globalTimer}
                        onChange={(e) => handleGlobalTimerChange(parseInt(e.target.value) || 0)}
                        style={{ width: '70px', padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}
                        max={60}
                        min={5}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {questions.map((q, qIndex) => (
                        <div key={q.id} className="clay-card" style={{ background: 'white', borderLeft: '5px solid #A0C4FF' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontWeight: 700 }}>Question {qIndex + 1}</span>
                                <div style={{ fontSize: '0.9rem', color: '#888' }}>
                                    Timer: <input
                                        type="number"
                                        value={q.timer}
                                        onChange={(e) => handleQuestionChange(qIndex, 'timer', parseInt(e.target.value))}
                                        style={{ width: '50px', marginLeft: '5px' }}
                                        max={60}
                                    />s
                                </div>
                            </div>

                            <input
                                type="text"
                                value={q.question}
                                onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                                placeholder="Enter question..."
                                style={{ width: '100%', padding: '10px', marginBottom: '15px', borderRadius: '8px', border: '2px solid #eee' }}
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                {q.options.map((opt, optIndex) => (
                                    <div key={optIndex} style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            value={opt}
                                            onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                                            placeholder={`Option ${optIndex + 1}`}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '8px',
                                                border: q.answer === opt && opt !== '' ? '2px solid #48dbfb' : '2px solid #eee',
                                                background: q.answer === opt && opt !== '' ? '#e3f2fd' : 'white'
                                            }}
                                        />
                                        <div
                                            onClick={() => handleQuestionChange(qIndex, 'answer', opt)}
                                            style={{
                                                cursor: 'pointer',
                                                fontSize: '0.8rem',
                                                marginTop: '4px',
                                                color: q.answer === opt ? '#48dbfb' : '#ccc',
                                                textAlign: 'right'
                                            }}
                                        >
                                            {q.answer === opt ? '✅ Correct Answer' : '⭕ Set as Correct'}
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
                        marginTop: '30px',
                        padding: '15px',
                        fontSize: '1.4rem',
                        fontWeight: 800,
                        background: '#CAFFBF',
                        color: '#2c3e50',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }}
                    onClick={handleStartQuiz}
                >
                    Start Adventure! 🚀
                </button>
            </div>
        </div>
    );
};

export default QuizReview;
