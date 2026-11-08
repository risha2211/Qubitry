import { useEffect } from 'react';

const SHORTCUT_GROUPS = [
  {
    title: 'EDITING',
    items: [
      { label: 'Undo', keys: ['Ctrl', 'Z'] },
      { label: 'Redo', keys: ['Ctrl', 'Shift', 'Z'] },
      { label: 'Copy selected gate(s)', keys: ['Ctrl', 'C'] },
      { label: 'Paste gate(s)', keys: ['Ctrl', 'V'] },
      { label: 'Cut selected gate(s)', keys: ['Ctrl', 'X'] },
      { label: 'Delete selected gate(s)', keys: ['Del'] },
      { label: 'Select all gates', keys: ['Ctrl', 'A'] },
      { label: 'Deselect / cancel current action', keys: ['Esc'] }
    ]
  },
  {
    title: 'GATES',
    items: [
      { label: 'Identity', keys: ['I'] },
      { label: 'Hadamard', keys: ['H'] },
      { label: 'Pauli-X', keys: ['X'] },
      { label: 'Pauli-Y', keys: ['Y'] },
      { label: 'Pauli-Z', keys: ['Z'] },
      { label: 'S Phase', keys: ['S'] },
      { label: 'T Phase', keys: ['T'] },
      { label: 'Measurement', keys: ['M'] },
      { label: 'Reset (|0⟩)', keys: ['R'] }
    ]
  },
  {
    title: 'SIMULATION CONTROLS',
    items: [
      { label: 'Run / pause simulation step', keys: ['Space'] },
      { label: 'Run circuit to completion', keys: ['Shift', 'Enter'] },
      { label: 'Run measurement sampling', keys: ['Ctrl', 'Enter'] },
      { label: 'Reset circuit', keys: ['Ctrl', 'R'] },
      { label: 'Next simulation step', keys: ['N'] },
      { label: 'Previous simulation step', keys: ['P'] }
    ]
  },
  {
    title: 'VIEW & NAVIGATION',
    items: [
      { label: 'Zoom in canvas', keys: ['Ctrl', '+'] },
      { label: 'Zoom out canvas', keys: ['Ctrl', '-'] },
      { label: 'Reset zoom to 100%', keys: ['Ctrl', '0'] },
      { label: 'Fit circuit to view', keys: ['F'] },
      { label: 'Open Bloch sphere visualization', keys: ['B'] },
      { label: 'Toggle gate library sidebar', keys: ['G'] },
      { label: 'Open keyboard shortcuts reference', keys: ['?'] }
    ]
  }
];

export default function ShortcutsModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 7, 12, 0.78)',
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
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(169, 154, 255, 0.1)',
          maxWidth: 620,
          width: '100%',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid var(--b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--p)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
              Keyboard shortcuts
            </h3>
            <span
              style={{
                fontSize: 11,
                fontFamily: 'JetBrains Mono',
                color: 'var(--ok)',
                background: 'rgba(85, 185, 149, 0.12)',
                border: '1px solid rgba(85, 185, 149, 0.3)',
                borderRadius: 12,
                padding: '2px 8px'
              }}
            >
              Circuit Studio
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--m)',
              fontSize: 16,
              cursor: 'pointer',
              padding: '4px 8px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Shortcuts List Content */}
        <div style={{ padding: '20px 22px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 22 }}>
          {SHORTCUT_GROUPS.map(group => (
            <div key={group.title}>
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  color: 'var(--m)',
                  marginBottom: 10
                }}
              >
                {group.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {group.items.map(item => (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 0',
                      borderBottom: '1px solid rgba(40, 51, 68, 0.35)'
                    }}
                  >
                    <span style={{ fontSize: 13, color: 'var(--t)' }}>{item.label}</span>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      {item.keys.map((k, i) => (
                        <kbd
                          key={i}
                          className="mono"
                          style={{
                            background: '#182131',
                            border: '1px solid #283344',
                            borderRadius: 4,
                            padding: '2px 7px',
                            fontSize: 11,
                            color: '#ECEEF4',
                            boxShadow: '0 2px 0 rgba(0, 0, 0, 0.45)',
                            lineHeight: 1.4
                          }}
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
