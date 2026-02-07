import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAvatar: React.FC = () => {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [avatarName, setAvatarName] = useState<string>('');

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <div className="create-avatar-container" style={{ width: '100%', maxWidth: '600px', padding: '20px' }}>
            <div className="clay-container">
                <button
                    className="clay-button secondary"
                    style={{ padding: '8px 16px', fontSize: '0.9rem', marginBottom: '1rem' }}
                    onClick={() => navigate('/')}
                >
                    ← Back
                </button>

                <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#4A90E2', textAlign: 'center' }}>Create Your Avatar</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Top Section: Upload */}
                    <div className="clay-card" style={{ textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '1rem' }}>1. Upload Your Photo</h3>
                        <div
                            style={{
                                width: '100%',
                                height: '220px',
                                background: '#f8fafc',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                border: '3px dashed var(--soft-blue)',
                                marginBottom: '1.5rem',
                                position: 'relative'
                            }}
                        >
                            {selectedImage ? (
                                <img src={selectedImage} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ textAlign: 'center', color: '#64748b' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📸</div>
                                    <p>Click "Select Image" to begin</p>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            id="avatar-upload"
                            style={{ display: 'none' }}
                            onChange={handleImageUpload}
                        />
                        <label htmlFor="avatar-upload" className="clay-button" style={{ display: 'inline-block', fontSize: '1.1rem' }}>
                            Select Image
                        </label>
                    </div>

                    {/* Bottom Section: Avatar Name Input */}
                    <div className="clay-card">
                        <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>2. Avatar Name</h3>
                        <div style={{ padding: '0 10px' }}>
                            <input
                                type="text"
                                placeholder="Enter avatar name..."
                                value={avatarName}
                                onChange={(e) => setAvatarName(e.target.value)}
                                className="clay-input"
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '20px',
                                    border: '3px solid var(--soft-blue)',
                                    fontSize: '1.1rem',
                                    background: 'rgba(255,255,255,0.8)',
                                    textAlign: 'center',
                                    outline: 'none',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <button
                        className="clay-button"
                        style={{ width: '100%', padding: '16px', fontSize: '1.3rem' }}
                        disabled={!selectedImage || !avatarName.trim()}
                        onClick={() => navigate('/avatar-view', { state: { image: selectedImage, name: avatarName } })}
                    >
                        Generate 3D Avatar! ✨
                    </button>
                    {!selectedImage && <p style={{ fontSize: '0.9rem', color: '#ff6b6b', marginTop: '0.8rem', fontWeight: 600 }}>Please upload an image first</p>}
                    {selectedImage && !avatarName.trim() && <p style={{ fontSize: '0.9rem', color: '#ff6b6b', marginTop: '0.8rem', fontWeight: 600 }}>Please give your avatar a name</p>}
                </div>
            </div>
        </div>
    );
};

export default CreateAvatar;
