import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQuizFromText } from '../services/gemini';

const QuizGeneration: React.FC = () => {
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError('');

        try {
            const questions = await generateQuizFromText(prompt);
            console.log("Generated Questions:", questions);
            // Navigate to ManualQuizInput but with pre-filled state
            // We assume ManualQuizInput can accept state `initialQuestions`
            // If not, we might need to modify it or store it in context/storage
            // For now, let's pass it via state
            navigate('/quiz-review', { state: { importedQuestions: questions } });
        } catch (err: any) {
            console.error(err);
            setError('Failed to generate quiz. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="avatar-view-container" style={{ width: '100%', maxWidth: '800px', padding: '20px' }}>
            <div className="clay-container" style={{ position: 'relative', background: '#f8f9fa', padding: '40px' }}>
                <button
                    className="clay-button secondary"
                    onClick={() => navigate(-1)}
                    style={{ position: 'absolute', top: '20px', left: '20px' }}
                >
                    ← Back
                </button>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '10px' }}>✨</div>
                    <h1 style={{ fontSize: '2.5rem', color: '#CAFFBF', textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>AI Quiz Creator</h1>
                    <p style={{ fontSize: '1.2rem', color: '#7f8c8d', marginBottom: '40px' }}>
                        Type a topic or paste text, and AI will create the questions for you!
                    </p>

                    <div className="clay-card" style={{ padding: '20px', background: 'white' }}>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Enter a topic (e.g., 'Solar System', 'Basic Math') or paste some text here..."
                            style={{
                                width: '100%',
                                minHeight: '200px',
                                padding: '15px',
                                border: '2px solid #eee',
                                borderRadius: '15px',
                                fontSize: '1.1rem',
                                resize: 'vertical',
                                outline: 'none',
                                marginBottom: '20px',
                                fontFamily: 'inherit'
                            }}
                        />

                        {error && <div style={{ color: '#ff6b6b', marginBottom: '15px' }}>{error}</div>}

                        <button
                            className="clay-button"
                            onClick={handleGenerate}
                            disabled={isLoading || !prompt.trim()}
                            style={{
                                width: '100%',
                                background: isLoading || !prompt.trim() ? '#ccc' : '#CAFFBF',
                                color: isLoading || !prompt.trim() ? '#666' : '#2d3436',
                                fontSize: '1.2rem',
                                padding: '15px'
                            }}
                        >
                            {isLoading ? 'Generating Logic...' : 'Generate Quiz 🪄'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizGeneration;
