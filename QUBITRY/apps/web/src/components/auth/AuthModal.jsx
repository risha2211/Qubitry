import { useState } from 'react';
import { useAuth } from '../../stores/AuthContext.jsx';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!username || !email || !password) {
        return setError('All fields are required.');
      }
      if (password.length < 6) {
        return setError('Password must be at least 6 characters.');
      }
      if (password !== confirmPassword) {
        return setError('Passwords do not match.');
      }

      setLoading(true);
      try {
        await register({ username, email, password });
        onClose();
      } catch (err) {
        setError(err.message || 'Registration failed.');
      } finally {
        setLoading(false);
      }
    } else {
      if (!email || !password) {
        return setError('Email and password are required.');
      }

      setLoading(true);
      try {
        await login({ email, password });
        onClose();
      } catch (err) {
        setError(err.message || 'Login failed. Check your email and password.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(5, 7, 12, 0.8)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#0d121c',
          border: '1px solid var(--b)',
          borderRadius: 14,
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(101, 213, 208, 0.15)',
          maxWidth: 420,
          width: '100%',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--b)',
            background: 'var(--p)'
          }}
        >
          <button
            style={{
              flex: 1,
              padding: '14px',
              border: 'none',
              background: mode === 'login' ? '#0d121c' : 'transparent',
              color: mode === 'login' ? 'var(--c)' : 'var(--m)',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              borderBottom: mode === 'login' ? '2px solid var(--c)' : '2px solid transparent'
            }}
            onClick={() => {
              setMode('login');
              setError('');
            }}
          >
            Sign In
          </button>
          <button
            style={{
              flex: 1,
              padding: '14px',
              border: 'none',
              background: mode === 'signup' ? '#0d121c' : 'transparent',
              color: mode === 'signup' ? 'var(--c)' : 'var(--m)',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              borderBottom: mode === 'signup' ? '2px solid var(--c)' : '2px solid transparent'
            }}
            onClick={() => {
              setMode('signup');
              setError('');
            }}
          >
            Create Account
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '22px 24px' }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 18, color: '#FFFFFF' }}>
              {mode === 'login' ? 'Welcome back to Qubitry' : 'Join Qubitry Quantum Cloud'}
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--m)' }}>
              {mode === 'login'
                ? 'Sign in to access your saved circuits, simulation runs, and workspace.'
                : 'Create an account to save quantum circuits and sync across devices.'}
            </p>
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#fca5a5',
                borderRadius: 6,
                padding: '8px 12px',
                fontSize: 12,
                marginBottom: 14
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--m)', marginBottom: 4 }}>
                  Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. quantum_explorer"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--m)', marginBottom: 4 }}>
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--m)', marginBottom: 4 }}>
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--m)', marginBottom: 4 }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>
            )}

            <button
              type="submit"
              className="pri"
              disabled={loading}
              style={{
                marginTop: 6,
                padding: '10px',
                fontSize: 13,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              {loading && <span className="mono">...</span>}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

