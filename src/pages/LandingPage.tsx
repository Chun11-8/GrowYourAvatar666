import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-background">
        <div className="floating-shape" style={{ width: '100px', height: '100px', top: '10%', left: '10%' }}></div>
        <div className="floating-shape" style={{ width: '150px', height: '150px', bottom: '15%', right: '15%', animationDelay: '1s' }}></div>
        <div className="floating-shape" style={{ width: '80px', height: '80px', top: '40%', right: '20%', animationDelay: '2s' }}></div>
      </div>

      <div className="clay-container" style={{ textAlign: 'center', maxWidth: '500px' }}>
        <h1>GrowYourAvatar</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
          <button
            className="clay-button secondary"
            onClick={() => navigate('/select-avatar')}
          >
            Login
          </button>
          <button
            className="clay-button"
            onClick={() => navigate('/create-avatar')}
          >
            Create Your Avatar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
