import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const waves = useMemo(() => 
    Array.from({ length: 60 }, (_, index) => ({
      baseHeight: Math.random() * 80 + 40,
      hoverHeight: Math.random() * 120 + 140,
      animationDelay: -index * 0.1
    })),
    []
  );

  return (
    <div className="landing-container">
      <div className="corner-logo">
        <div className="logo-waves-corner">
          <div className="logo-wave"></div>
          <div className="logo-wave"></div>
          <div className="logo-wave"></div>
          <div className="logo-wave"></div>
          <div className="logo-wave"></div>
        </div>
        <span className="logo-text">Neurotone</span>
      </div>

      <div className="landing-content">
        <div 
          className="wave-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {waves.map((wave, index) => (
            <div
              key={index}
              className="wave-bar"
              style={{
                height: isHovered ? `${wave.hoverHeight}px` : `${wave.baseHeight}px`,
                animationDelay: `${wave.animationDelay}s`
              }}
            />
          ))}
        </div>

        <div className="text-section">
          <p className="landing-subtitle">AI-Powered Emotion Detection for Therapists</p>
          <button className="get-started-button" onClick={() => navigate('/login')}>
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
