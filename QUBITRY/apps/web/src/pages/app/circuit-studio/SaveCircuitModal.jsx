import { useState } from 'react';
import { useAuth } from '../../../stores/AuthContext.jsx';
import { circuitAPI } from '../../../services/api.js';

export default function SaveCircuitModal({ isOpen, onClose, circ, shots, onSaved }) {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const [title, setTitle] = useState(circ.note?.name || 'My Quantum Circuit');
  const [description, setDescription] = useState(circ.note?.description || '');
  const [tags, setTags] = useState('quantum, circuit');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = async e => {
    e.preventDefault();
    if (!title.trim()) return setError('Please enter a title for your circuit.');

    setLoading(true);
    setError('');

    try {
      const tagList = tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const res = await circuitAPI.create({
        title: title.trim(),
        description: description.trim(),
        qubits: circ.n,
        ops: circ.ops,
        tags: tagList,
        isPublic,
        shots
      });

      if (onSaved) onSaved(res.circuit);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save circuit to backend.');
    } finally {
      setLoading(false);
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
          maxWidth: 480,
          width: '100%',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--p)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h3 style={{ fontSize: 16, margin: 0, color: '#FFFFFF' }}>Save Circuit to Cloud</h3>
            <span
              style={{
                fontSize: 11,
                fontFamily: 'JetBrains Mono',
                color: 'var(--ok)',
                background: 'rgba(85, 185, 149, 0.12)',
                border: '1px solid rgba(85, 185, 149, 0.3)',
                padding: '2px 8px',
                borderRadius: 12
              }}
            >
              MERN Stack
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--m)',
              fontSize: 16,
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px' }}>
          {!isAuthenticated ? (
            <div style={{ textAlign: 'center', padding: '16px 8px' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🔒</div>
              <h4 style={{ margin: 0, color: '#FFFFFF' }}>Authentication Required</h4>
              <p style={{ fontSize: 13, color: 'var(--m)', margin: '8px 0 18px' }}>
                Sign in or register an account to save your quantum circuits, sync with your cloud workspace, and access them anytime.
              </p>
              <button
                className="pri"
                onClick={() => {
                  onClose();
                  openAuthModal('login');
                }}
                style={{ padding: '8px 20px', fontSize: 13 }}
              >
                Sign In to Save
              </button>
            </div>
          ) : (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {error && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    color: '#fca5a5',
                    borderRadius: 6,
                    padding: '8px 12px',
                    fontSize: 12
                  }}
                >
                  ⚠️ {error}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--m)', marginBottom: 4 }}>
                  Circuit Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bell State Superposition"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--m)', marginBottom: 4 }}>
                  Description / Experiment Notes
                </label>
                <textarea
                  rows="3"
                  placeholder="Details about expected outcomes, entanglement, or algorithms..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--m)', marginBottom: 4 }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. bell-state, superposition, research"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg)',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--b)'
                }}
              >
                <div>
                  <b style={{ fontSize: 12, color: 'var(--t)' }}>Circuit Summary</b>
                  <div style={{ fontSize: 11, color: 'var(--m)' }}>
                    {circ.n} Qubits · {circ.ops.length} Gates · Author: {user?.username}
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={e => setIsPublic(e.target.checked)}
                  />
                  <span>Make Public</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{ flex: 1, padding: '9px', background: 'transparent', borderColor: 'var(--b)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="pri"
                  disabled={loading}
                  style={{ flex: 1, padding: '9px', fontWeight: 600 }}
                >
                  {loading ? 'Saving to Cloud...' : 'Save Circuit'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

