import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import FullScreenBlochSphere from '../../components/visualizations/FullScreenBlochSphere.jsx';
import WavyPixelHeadline from '../../components/visualizations/WavyPixelHeadline.jsx';
import QuantumFeatureScrollSection from '../../components/visualizations/QuantumFeatureScrollSection.jsx';

const STATES = [
  ['|0⟩', 0, 0],
  ['|1⟩', Math.PI, 0],
  ['|+⟩', Math.PI / 2, 0],
  ['|−⟩', Math.PI / 2, Math.PI],
  ['|+i⟩', Math.PI / 2, Math.PI / 2],
  ['|−i⟩', Math.PI / 2, (3 * Math.PI) / 2]
];

export default function LandingPage() {
  const nav = useNavigate();
  const [th, setTh] = useState(Math.PI / 2);
  const [ph, setPh] = useState(0);

  // Randomize state
  const handleRandomState = () => {
    const u = Math.random();
    const newTh = Math.acos(2 * u - 1);
    const newPh = Math.random() * 2 * Math.PI;
    setTh(newTh);
    setPh(newPh);
  };

  const handleStateChange = useCallback((newTh, newPh) => {
    setTh(newTh);
    setPh(newPh);
  }, []);

  return (
    <div className="landing-container">
      {/* 1. INITIAL SCREEN: PURE BLOCH SPHERE VIEWPORT */}
      <section className="hero-sphere-viewport">
        {/* Centered full-screen interactive 3D Bloch sphere */}
        <FullScreenBlochSphere
          th={th}
          ph={ph}
          onStateChange={handleStateChange}
          autoRotateDefault={false}
        />

        {/* Minimal Micro Quantum State HUD in bottom-right corner */}
        <div className="micro-quantum-hud">
          {/* Preset chips */}
          <div className="micro-hud-chips">
            {STATES.map(([name, targetTh, targetPh]) => {
              const isActive =
                Math.abs(th - targetTh) < 0.05 && Math.abs(ph - targetPh) < 0.05;
              return (
                <button
                  key={name}
                  className={`micro-chip ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setTh(targetTh);
                    setPh(targetPh);
                  }}
                  title={name}
                >
                  {name}
                </button>
              );
            })}
            <button
              className="micro-chip"
              onClick={handleRandomState}
              title="Random quantum state"
            >
              🎲
            </button>
          </div>

          {/* Micro Sliders */}
          <div className="micro-hud-sliders">
            <div className="micro-slider-row">
              <span className="mono">θ {(th * 180 / Math.PI).toFixed(0)}°</span>
              <input
                type="range"
                min="0"
                max={Math.PI}
                step="0.01"
                value={th}
                onChange={(e) => setTh(+e.target.value)}
              />
            </div>
            <div className="micro-slider-row">
              <span className="mono">φ {(ph * 180 / Math.PI).toFixed(0)}°</span>
              <input
                type="range"
                min="0"
                max={2 * Math.PI}
                step="0.01"
                value={ph}
                onChange={(e) => setPh(+e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. SCROLL DOWN SECTION: BIG WAVY PIXEL HEADLINE */}
      <section id="explore-section" className="explore-section" style={{ paddingBottom: 50 }}>
        <div className="explore-content-wrap">
          {/* Large wavy pixel headline spanning the horizontal screen */}
          <WavyPixelHeadline text="A new way to explore the quantum world." />
        </div>
      </section>

      {/* 3. SCROLL-DRIVEN FEATURE SHOWCASE WITH ROTATING LOGO SPHERE */}
      <QuantumFeatureScrollSection />

      {/* 4. ACTIONS & ABOUT THE CREATOR */}
      <section className="w" style={{ textAlign: 'center', padding: '60px 20px 80px' }}>
        <div className="explore-cta-group" style={{ marginBottom: 50 }}>
          <button className="pri" onClick={() => nav('/studio')}>
            Open Circuit Studio
          </button>
          <button onClick={() => nav('/algorithms')}>
            Explore Algorithms
          </button>
        </div>

        {/* About the Creator Card */}
        <div
          className="card"
          style={{
            maxWidth: 820,
            margin: '0 auto',
            textAlign: 'left',
            padding: '36px 40px',
            background: 'linear-gradient(180deg, #101524 0%, #0d111c 100%)',
            border: '1px solid rgba(169, 154, 255, 0.22)',
            borderRadius: 14,
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)'
          }}
        >
          <div
            className="mono"
            style={{
              fontSize: 11,
              letterSpacing: '0.14em',
              color: 'var(--a)',
              fontWeight: 600,
              textTransform: 'uppercase',
              marginBottom: 14
            }}
          >
            A LITTLE ABOUT THE CREATOR
          </div>

          <h2
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              marginBottom: 8
            }}
          >
            Hello, I'm Risha.
          </h2>

          <div
            style={{
              fontSize: 18,
              color: 'var(--a)',
              fontWeight: 500,
              marginBottom: 18
            }}
          >
            The person behind Qubitry.
          </div>

          <p
            className="m"
            style={{
              fontSize: 14,
              lineHeight: 1.7,
              margin: '0 0 24px',
              maxWidth: 720,
              color: '#929CAD'
            }}
          >
            Qubitry started as an exploration of how quantum computing could be made more tangible through interactive tools. What began as a technical project slowly grew into something I wanted to share with others who are just as curious about the subject.
          </p>

          <a
            href="https://github.com/risha2211"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: 'var(--t)',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 500,
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--a)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--t)')}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              style={{ display: 'block', flexShrink: 0 }}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span>Find me on GitHub ↗</span>
          </a>
        </div>
      </section>
    </div>
  );
}
