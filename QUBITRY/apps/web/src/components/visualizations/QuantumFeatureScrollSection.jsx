import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RotatingLogoSphere from './RotatingLogoSphere.jsx';

const STEPS = [
  {
    num: '01',
    title: 'Build circuits',
    tag: 'Studio & Canvas',
    desc: 'Interactive multi-qubit canvas with drag-and-drop gates, parameterized phase rotations, custom subroutines, and automatic moment scheduling.',
    cta: 'Open Circuit Studio →',
    path: '/studio',
    color: '#A99AFF'
  },
  {
    num: '02',
    title: 'simulate algorithms',
    tag: 'Quantum Library',
    desc: 'Explore Grover search, Shor’s order finding, Simon’s hidden shift, Deutsch-Jozsa, and QFT with full step-by-step state collapse history.',
    cta: 'Explore Algorithms →',
    path: '/algorithms',
    color: '#65D5D0'
  },
  {
    num: '03',
    title: 'inspect quantum states',
    tag: 'Bloch & Density Matrix',
    desc: 'Analyze exact statevectors, Bloch sphere 3D projections, single-qubit density matrices, subsystem purity, and von Neumann entropy.',
    cta: 'Learn Foundations →',
    path: '/learn',
    color: '#55B995'
  },
  {
    num: '04',
    title: 'running in your browser',
    tag: 'Zero-Latency Engine',
    desc: 'Zero installation, zero server round-trips. Exact IEEE 754 double-precision statevector simulation executing unitaries natively in real time.',
    cta: 'Documentation & Reference →',
    path: '/docs',
    color: '#D6A85B'
  }
];

export default function QuantumFeatureScrollSection() {
  const containerRef = useRef(null);
  const nav = useNavigate();
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!containerRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = containerRef.current.getBoundingClientRect();
          const totalDist = containerRef.current.offsetHeight - window.innerHeight;
          if (totalDist > 0) {
            const scrolled = -rect.top;
            const p = Math.max(0, Math.min(1, scrolled / totalDist));
            setProgress(p);

            // Step calculation: 4 discrete intervals
            const step = Math.min(3, Math.floor(p * 4));
            setActiveStep(step);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToStep = index => {
    if (!containerRef.current) return;
    const totalDist = containerRef.current.offsetHeight - window.innerHeight;
    const targetY = containerRef.current.offsetTop + (index / 3.9) * totalDist;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      className="feature-scroll-track"
      style={{
        position: 'relative',
        height: '360vh', // Generous scroll space for smooth storytelling
        background: 'linear-gradient(180deg, #0d121b 0%, #070314 30%, #070314 70%, #0B0E14 100%)'
      }}
    >
      {/* Sticky Fullscreen Frame */}
      <div
        className="feature-sticky-viewport"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '0 24px',
          boxSizing: 'border-box'
        }}
      >
        <div
          className="feature-scroll-grid"
          style={{
            width: '100%',
            maxWidth: 1200,
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 460px) 1fr',
            gap: 48,
            alignItems: 'center'
          }}
        >
          {/* LEFT COLUMN: THE ROTATING QUBITRY LOGO SPHERE */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            {/* The rotating 3D logo */}
            <div style={{ position: 'relative' }}>
              <RotatingLogoSphere
                scrollProgress={progress}
                size={window.innerWidth < 600 ? 280 : 380}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: SCROLL-REVEALED TEXT PHRASES */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              paddingLeft: 12
            }}
          >
            {/* Step Progress Tracker */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 4
              }}
            >
              <span
                className="mono"
                style={{
                  fontSize: 12,
                  color: 'var(--a)',
                  fontWeight: 600,
                  letterSpacing: '0.1em'
                }}
              >
                DISCOVER THE PLATFORM — {STEPS[activeStep].num} / 04
              </span>
              <div
                style={{
                  flex: 1,
                  maxWidth: 160,
                  height: 3,
                  background: 'rgba(40, 51, 68, 0.8)',
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.round(progress * 100)}%`,
                    background: STEPS[activeStep].color,
                    transition: 'width 0.15s ease-out, background 0.3s ease'
                  }}
                />
              </div>
            </div>

            {/* The 4 Text Phrases Stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {STEPS.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <div
                    key={step.num}
                    onClick={() => scrollToStep(idx)}
                    style={{
                      cursor: 'pointer',
                      padding: '14px 18px',
                      borderRadius: 10,
                      background: isActive
                        ? 'rgba(17, 23, 34, 0.85)'
                        : 'rgba(11, 14, 20, 0.35)',
                      border: `1px solid ${
                        isActive ? 'rgba(169, 154, 255, 0.45)' : 'transparent'
                      }`,
                      boxShadow: isActive
                        ? `0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)`
                        : 'none',
                      transition: 'all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
                      opacity: isActive ? 1.0 : 0.32,
                      transform: isActive ? 'translateX(8px) scale(1.01)' : 'translateX(0) scale(0.99)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                        <span
                          className="mono"
                          style={{
                            fontSize: 14,
                            color: isActive ? step.color : 'var(--m)',
                            fontWeight: 600
                          }}
                        >
                          {step.num}
                        </span>
                        <h2
                          style={{
                            fontSize: window.innerWidth < 768 ? 24 : 34,
                            fontWeight: 600,
                            letterSpacing: '-0.02em',
                            color: isActive ? '#FFFFFF' : 'var(--m)',
                            textTransform: idx === 0 ? 'capitalize' : 'lowercase',
                            transition: 'color 0.25s ease'
                          }}
                        >
                          {step.title}
                        </h2>
                      </div>
                      <span
                        className="tag mono"
                        style={{
                          margin: 0,
                          fontSize: 10,
                          borderColor: isActive ? step.color : 'var(--b)',
                          color: isActive ? step.color : 'var(--m)'
                        }}
                      >
                        {step.tag}
                      </span>
                    </div>

                    {/* Expanded details when active */}
                    <div
                      style={{
                        maxHeight: isActive ? 140 : 0,
                        opacity: isActive ? 1 : 0,
                        overflow: 'hidden',
                        transition: 'all 0.35s ease-in-out',
                        paddingTop: isActive ? 10 : 0
                      }}
                    >
                      <p
                        className="m"
                        style={{
                          fontSize: 13,
                          lineHeight: 1.6,
                          margin: 0,
                          color: 'var(--t)'
                        }}
                      >
                        {step.desc}
                      </p>
                      <div style={{ marginTop: 12 }}>
                        <button
                          className="pri"
                          onClick={e => {
                            e.stopPropagation();
                            nav(step.path);
                          }}
                          style={{
                            fontSize: 12,
                            padding: '5px 14px',
                            background: step.color,
                            color: '#0B0E14',
                            fontWeight: 600,
                            borderColor: step.color
                          }}
                        >
                          {step.cta}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

