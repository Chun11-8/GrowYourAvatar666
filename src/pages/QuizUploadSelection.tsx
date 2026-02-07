import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQuizFromImage } from '../services/gemini';

const QuizUploadSelection: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError('');

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result as string;

            try {
                // Determine if image (simple check)

                //Actual Implementation line below
                //const isImage = file.type.startsWith('image/');

                // For now, simpler implementation: treat everything that FileReader reads as potential input for Vision
                // Gemini 1.5 Flash supports PDF via base64 as well in the prompt, or images
                // The service `generateQuizFromImage` handles base64.

                const questions = await generateQuizFromImage(base64String);
                console.log("Generated Questions from File:", questions);

                navigate('/quiz-review', { state: { importedQuestions: questions } });

            } catch (err: any) {
                console.error(err);
                setError('Failed to process file. Ensure it is a clear image or supported document.');
            } finally {
                setIsLoading(false);
            }
        };
        reader.onerror = () => {
            setError('Failed to read file.');
            setIsLoading(false);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="upload-quiz-container" style={{ width: '100%', maxWidth: '800px', padding: '20px' }}>
            <div className="clay-container" style={{ position: 'relative', background: '#f8f9fa' }}>
                <button
                    className="clay-button secondary"
                    onClick={() => navigate(-1)}
                    style={{ position: 'absolute', top: '20px', left: '20px' }}
                >
                    ← Back
                </button>

                <div style={{ textAlign: 'center', marginTop: '60px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '10px' }}>📸</div>
                    <h1 style={{ fontSize: '2.5rem', color: '#FFADAD', marginBottom: '10px' }}>Upload Material</h1>
                    <p style={{ fontSize: '1.2rem', color: '#7f8c8d', marginBottom: '40px' }}>
                        Upload a photo of a worksheet, book page, or a document file.
                    </p>

                    {isLoading ? (
                        <div style={{ padding: '40px', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚙️</div>
                            <h3>Analyzing Document...</h3>
                            <p>Extracting questions for you...</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px', margin: '0 auto' }}>
                            {error && <div style={{ color: '#ff6b6b', background: 'white', padding: '10px', borderRadius: '10px' }}>{error}</div>}

                            <label className="clay-button" style={{ background: '#FFADAD', color: 'white', cursor: 'pointer', display: 'block', padding: '20px' }}>
                                <span style={{ display: 'block', fontSize: '2rem', marginBottom: '5px' }}>🖼️</span>
                                <span style={{ fontSize: '1.2rem' }}>Pick Image from Gallery</span>
                                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                            </label>

                            <label className="clay-button" style={{ background: '#A0C4FF', color: 'white', cursor: 'pointer', display: 'block', padding: '20px' }}>
                                <span style={{ display: 'block', fontSize: '2rem', marginBottom: '5px' }}>📄</span>
                                <span style={{ fontSize: '1.2rem' }}>Upload Document (PDF/Text)</span>
                                <input type="file" accept=".pdf,.txt,.doc,.docx" onChange={handleFileUpload} style={{ display: 'none' }} />
                            </label>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizUploadSelection;
