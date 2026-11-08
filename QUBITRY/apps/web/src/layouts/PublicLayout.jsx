import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../stores/AuthContext.jsx';

export default function PublicLayout() {
  const [labsOpen, setLabsOpen] = useState(false);
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  return (
    <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px', background: 'var(--p)', borderBottom: '1px solid var(--b)' }}>
        {/* Left: Brand & Main Workspaces */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <NavLink
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              textDecoration: 'none',
              padding: '3px 8px',
              borderRadius: 6,
              marginRight: 6
            }}
          >
            <img
              src="/logo.png"
              alt="Qubitry Logo"
              style={{
                width: 26,
                height: 26,
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 6px rgba(169, 154, 255, 0.45))'
              }}
            />
            <b style={{ letterSpacing: '0.25em', color: 'var(--t)', fontSize: 15, margin: 0 }}>
              QUBITRY
            </b>
          </NavLink>

          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
          <NavLink to="/studio" className={({ isActive }) => (isActive ? 'active' : '')}>
            Circuit Studio
          </NavLink>
          <NavLink to="/algorithms" className={({ isActive }) => (isActive ? 'active' : '')}>
            Algorithms
          </NavLink>
          <NavLink to="/learn" className={({ isActive }) => (isActive ? 'active' : '')}>
            Learn
          </NavLink>
          <NavLink to="/exercises" className={({ isActive }) => (isActive ? 'active' : '')}>
            Exercises
          </NavLink>

          {/* Research & Lab Workspaces Dropdown */}
          <div style={{ position: 'relative' }} onMouseLeave={() => setLabsOpen(false)}>
            <button
              onClick={() => setLabsOpen(!labsOpen)}
              onMouseEnter={() => setLabsOpen(true)}
              style={{
                fontSize: 13,
                padding: '5px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                borderColor: labsOpen ? 'var(--c)' : 'var(--b)'
              }}
            >
              <span>Research Labs</span>
              <span style={{ fontSize: 9 }}>▼</span>
            </button>

            {labsOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  zIndex: 100,
                  background: 'var(--p)',
                  border: '1px solid var(--b)',
                  borderRadius: 6,
                  padding: '6px 0',
                  minWidth: 230,
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
                }}
              >
                <NavLink
                  to="/optimization"
                  style={{ display: 'block', padding: '6px 14px', borderRadius: 0, border: 'none' }}
                  onClick={() => setLabsOpen(false)}
                >
                  Optimization Lab (QAOA/VQE)
                </NavLink>
                <NavLink
                  to="/qml"
                  style={{ display: 'block', padding: '6px 14px', borderRadius: 0, border: 'none' }}
                  onClick={() => setLabsOpen(false)}
                >
                  Quantum Machine Learning
                </NavLink>
                <NavLink
                  to="/data-clustering"
                  style={{ display: 'block', padding: '6px 14px', borderRadius: 0, border: 'none' }}
                  onClick={() => setLabsOpen(false)}
                >
                  Data &amp; Clustering (K-Means/QRAM)
                </NavLink>
                <NavLink
                  to="/quantum-information"
                  style={{ display: 'block', padding: '6px 14px', borderRadius: 0, border: 'none' }}
                  onClick={() => setLabsOpen(false)}
                >
                  Quantum Information &amp; Bell/CHSH
                </NavLink>
                <NavLink
                  to="/security"
                  style={{ display: 'block', padding: '6px 14px', borderRadius: 0, border: 'none', color: 'var(--c)' }}
                  onClick={() => setLabsOpen(false)}
                >
                  Cryptography &amp; Security (PQC)
                </NavLink>
                <NavLink
                  to="/hardware-reliability"
                  style={{ display: 'block', padding: '6px 14px', borderRadius: 0, border: 'none' }}
                  onClick={() => setLabsOpen(false)}
                >
                  Hardware, Noise &amp; QEC
                </NavLink>
              </div>
            )}
          </div>
        </div>

        {/* Right: Docs, Workspace & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <NavLink to="/docs" className={({ isActive }) => (isActive ? 'active' : '')}>
            Documentation
          </NavLink>
          <NavLink to="/workspace" className={({ isActive }) => (isActive ? 'active' : '')}>
            My Workspace
          </NavLink>

          <div style={{ width: 1, height: 16, background: 'var(--b)', margin: '0 4px' }} />

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 12,
                  fontFamily: 'JetBrains Mono',
                  color: 'var(--c)',
                  background: 'rgba(101, 213, 208, 0.1)',
                  border: '1px solid rgba(101, 213, 208, 0.3)',
                  padding: '3px 9px',
                  borderRadius: 14
                }}
              >
                👤 {user?.username}
              </span>
              <button
                onClick={logout}
                style={{
                  fontSize: 11,
                  padding: '4px 10px',
                  background: 'transparent',
                  borderColor: 'var(--b)',
                  color: 'var(--m)'
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={() => openAuthModal('login')}
                style={{
                  fontSize: 12,
                  padding: '4px 12px',
                  background: 'transparent',
                  borderColor: 'var(--b)'
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('signup')}
                className="pri"
                style={{
                  fontSize: 12,
                  padding: '4px 12px'
                }}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Outlet */}
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>

      {/* Platform Footer */}
      <footer style={{ borderTop: '1px solid var(--b)', background: 'var(--p)', padding: '14px 20px', marginTop: 'auto' }}>
        <div className="w" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, padding: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/logo.png" alt="Qubitry" style={{ width: 18, height: 18, objectFit: 'contain' }} />
            <b style={{ letterSpacing: '0.22em', color: 'var(--t)', fontSize: 13 }}>
              QUBITRY
            </b>
          </div>
        </div>
      </footer>
    </div>
  );
}
