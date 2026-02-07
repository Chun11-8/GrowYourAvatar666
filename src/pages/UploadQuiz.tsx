import { useNavigate, useLocation } from 'react-router-dom';

const UploadQuiz: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { avatarId } = (location.state as { avatarId?: string }) || {};

    const options = [
        {
            id: 'camera',
            title: 'Photo or Upload',
            desc: 'Upload from your gallery or by document',
            icon: '📸',
            color: '#FFADAD'
        },
        {
            id: 'manual',
            title: 'Manual Input',
            desc: 'Type in your own questions and answers',
            icon: '✍️',
            color: '#A0C4FF'
        },
        {
            id: 'ai',
            title: 'AI Generation',
            desc: 'Let the magic AI create questions for you',
            icon: '✨',
            color: '#CAFFBF'
        }
    ];

    const handleChoice = (id: string) => {
        const state = { avatarId };
        if (id === 'manual') {
            navigate('/manual-quiz', { state });
        } else if (id === 'camera') {
            navigate('/quiz-upload', { state });
        } else if (id === 'ai') {
            navigate('/quiz-generation', { state });
        } else {
            navigate('/game-hub', { state });
        }
    };

    return (
        <div className="page-fullscreen" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)'
        }}>
            <div className="clay-container" style={{
                position: 'relative',
                background: '#f8f9fa',
                width: '100%',
                maxWidth: '480px',
                minHeight: '82vh', // Increased min-height to fill tall screens
                height: 'auto',
                maxHeight: '92vh',
                display: 'flex',
                flexDirection: 'column',
                padding: '2.5rem 1.5rem',
                justifyContent: 'space-around', // Distribute content
                gap: '1rem',
                boxShadow: '0 15px 35px rgba(0,0,0,0.1), inset 0 0 20px rgba(255,255,255,0.5)'
            }}>
                <button
                    className="clay-button secondary"
                    onClick={() => navigate('/avatar-view', { state: { avatarId } })}
                    style={{
                        position: 'absolute',
                        top: '1.2rem',
                        left: '1.2rem',
                        padding: '8px 16px',
                        fontSize: '0.85rem',
                        zIndex: 10,
                        boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                    }}
                >
                    ← Back
                </button>

                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: 'clamp(2.5rem, 10vh, 4rem)', marginBottom: '0.5rem', filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.1))' }}>🧭</div>
                    <h1 style={{
                        fontSize: 'clamp(1.8rem, 6vh, 2.5rem)',
                        color: '#FF6B6B',
                        marginBottom: '0.5rem',
                        textShadow: '3px 3px 0px rgba(0,0,0,0.05)',
                        lineHeight: 1.1
                    }}>Prepare Your Quest!</h1>
                    <p style={{
                        fontSize: 'clamp(0.9rem, 2.5vh, 1.1rem)',
                        color: '#7f8c8d',
                        fontWeight: 500,
                        maxWidth: '280px',
                        margin: '0 auto'
                    }}>Choose how you want to create your game questions</p>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.2rem',
                    width: '100%',
                    flexGrow: 1,
                    justifyContent: 'center'
                }}>
                    {options.map((opt) => (
                        <div
                            key={opt.id}
                            className="clay-card"
                            onClick={() => handleChoice(opt.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '1.2rem',
                                gap: '1.2rem',
                                cursor: 'pointer',
                                background: `linear-gradient(135deg, ${opt.color} 0%, white 150%)`,
                                border: '3px solid white',
                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                boxShadow: '0 6px 15px rgba(0,0,0,0.06)',
                                flexShrink: 0,
                                borderRadius: '24px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.03) translateY(-3px)';
                                e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.12)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                                e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.06)';
                            }}
                        >
                            <div style={{
                                fontSize: '2.5rem',
                                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.15))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '60px'
                            }}>{opt.icon}</div>
                            <div style={{ textAlign: 'left', flex: 1 }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px', color: '#2c3e50', fontWeight: 800 }}>{opt.title}</h3>
                                <p style={{ fontSize: '0.8rem', color: '#555', fontWeight: 500, lineHeight: '1.3' }}>{opt.desc}</p>
                            </div>
                            <div style={{ fontSize: '1.5rem', opacity: 0.2, fontWeight: 'bold' }}>➜</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UploadQuiz;
