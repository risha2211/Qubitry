import { useState } from 'react';
import { GATES } from '@qubitry/quantum-core';

const GATE_CATEGORIES = [
  {
    name: 'Pauli & Basic',
    gates: ['I', 'H', 'X', 'Y', 'Z', 'S', 'Sdg', 'T', 'Tdg']
  },
  {
    name: 'Rotations & Phase',
    gates: ['RX', 'RY', 'RZ', 'P']
  },
  {
    name: 'Controlled & Multi-Qubit',
    gates: ['CX', 'CY', 'CZ', 'CP', 'CRZ', 'SWAP', 'CSWAP', 'CCX']
  },
  {
    name: 'Measurement & Non-Unitary',
    gates: ['M', 'Reset']
  }
];

const BUILTIN_SUBROUTINES = [
  {
    name: 'Bell Pair |Φ⁺⟩',
    qubits: 2,
    desc: 'Prepares (|00⟩+|11⟩)/√2 on wires q0, q1',
    ops: [
      { g: 'H', q: [0], s: 0 },
      { g: 'CX', q: [0, 1], s: 1 }
    ]
  },
  {
    name: 'GHZ State (3q)',
    qubits: 3,
    desc: 'Prepares (|000⟩+|111⟩)/√2 on wires q0, q1, q2',
    ops: [
      { g: 'H', q: [0], s: 0 },
      { g: 'CX', q: [0, 1], s: 1 },
      { g: 'CX', q: [1, 2], s: 2 }
    ]
  },
  {
    name: 'Grover Diffuser (2q)',
    qubits: 2,
    desc: 'Inversion about the mean on 2 qubits',
    ops: [
      { g: 'H', q: [0], s: 0 }, { g: 'H', q: [1], s: 0 },
      { g: 'X', q: [0], s: 1 }, { g: 'X', q: [1], s: 1 },
      { g: 'CZ', q: [0, 1], s: 2 },
      { g: 'X', q: [0], s: 3 }, { g: 'X', q: [1], s: 3 },
      { g: 'H', q: [0], s: 4 }, { g: 'H', q: [1], s: 4 }
    ]
  },
  {
    name: 'Swap Test',
    qubits: 3,
    desc: 'Fidelity test: ancilla q0 controls swap between q1 and q2',
    ops: [
      { g: 'H', q: [0], s: 0 },
      { g: 'CSWAP', q: [0, 1, 2], s: 1 },
      { g: 'H', q: [0], s: 2 },
      { g: 'M', q: [0], s: 3 }
    ]
  }
];

export default function GateLibrary({
  tool,
  setTool,
  par,
  setPar,
  selectedOp,
  setSelectedOpId,
  n,
  setN,
  shots,
  setShots,
  seed,
  setSeed,
  undo,
  redo,
  canUndo = true,
  canRedo = false,
  clear,
  insertSubroutine
}) {
  const [tab, setTab] = useState('gates'); // 'gates' | 'subroutines'
  const [hoveredGate, setHoveredGate] = useState(null);

  const activeGateMeta = GATES[tool] || null;

  return (
    <div className="card gate-library-panel" style={{ width: 230, flexShrink: 0 }}>
      {/* Tab Switcher: Primitive Gates vs Reusable Subroutines */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 12, borderBottom: '1px solid var(--b)', paddingBottom: 6 }}>
        <button
          className={tab === 'gates' ? 'on' : ''}
          style={{ flex: 1, padding: '4px 6px', fontSize: 11 }}
          onClick={() => setTab('gates')}
        >
          Gates
        </button>
        <button
          className={tab === 'subroutines' ? 'on' : ''}
          style={{ flex: 1, padding: '4px 6px', fontSize: 11 }}
          onClick={() => setTab('subroutines')}
        >
          Subroutines
        </button>
      </div>

      {tab === 'gates' && (
        <div>
          {/* Active / Selected Gate Inspector Banner */}
          {selectedOp && (
            <div style={{ background: '#142a35', border: '1px solid #65D5D0', borderRadius: 6, padding: '8px', marginBottom: 10, fontSize: 11 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <b style={{ color: '#65D5D0' }}>Selected: {selectedOp.g} Gate</b>
                <button
                  style={{ fontSize: 10, padding: '1px 6px', background: 'transparent', borderColor: 'var(--b)' }}
                  onClick={() => setSelectedOpId?.(null)}
                >
                  Clear
                </button>
              </div>
              <div style={{ color: 'var(--m)', marginTop: 2 }}>
                Wire: q[{selectedOp.q.join(', ')}] · Step {selectedOp.s + 1}
              </div>
              {GATES[selectedOp.g]?.a && (
                <div style={{ marginTop: 8 }}>
                  <label style={{ color: '#65D5D0', fontWeight: 600, fontSize: 11 }}>Modify Angle θ in Real Time:</label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.02"
                    value={par}
                    onChange={e => setPar(+e.target.value)}
                    style={{ width: '100%', accentColor: '#65D5D0', marginTop: 4 }}
                  />
                  <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                    <input
                      type="number"
                      step="0.05"
                      value={par}
                      onChange={e => setPar(+e.target.value || 0)}
                      style={{ width: '65px', fontSize: 11, padding: '2px 4px' }}
                    />
                    <span className="mono" style={{ fontSize: 10, color: 'var(--t)', alignSelf: 'center' }}>
                      × π rad ({(par * 180).toFixed(0)}°)
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {GATE_CATEGORIES.map(cat => (
            <div key={cat.name} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--m)', marginBottom: 4, letterSpacing: '0.05em' }}>
                {cat.name}
              </div>
              <div className="pal" style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {cat.gates.map(g => (
                  <button
                    key={g}
                    className={tool === g ? 'on' : ''}
                    onClick={() => setTool(g)}
                    onMouseEnter={() => setHoveredGate(g)}
                    onMouseLeave={() => setHoveredGate(null)}
                    style={{ minWidth: 38, padding: '4px 6px', fontSize: 12, fontFamily: 'JetBrains Mono' }}
                    title={GATES[g]?.desc || g}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Erase Tool */}
          <div style={{ margin: '8px 0' }}>
            <button
              className={tool === 'Erase' ? 'on' : ''}
              onClick={() => setTool('Erase')}
              style={{ width: '100%', borderColor: tool === 'Erase' ? 'var(--er)' : 'var(--b)' }}
            >
              🧹 Erase Gate
            </button>
          </div>

          {/* Contextual Gate Tooltip Card */}
          {(hoveredGate || tool !== 'Erase') && (
            <div style={{ background: 'var(--bg)', border: '1px solid var(--b)', borderRadius: 6, padding: '6px 8px', margin: '8px 0', fontSize: 11 }}>
              <b style={{ color: 'var(--c)' }}>{GATES[hoveredGate || tool]?.name || (hoveredGate || tool)}</b>
              <div style={{ color: 'var(--m)', marginTop: 2 }}>{GATES[hoveredGate || tool]?.desc}</div>
              {GATES[hoveredGate || tool]?.k > 1 && (
                <div style={{ color: 'var(--a)', marginTop: 2 }}>
                  Qubits: {GATES[hoveredGate || tool].k} (controls first, target last)
                </div>
              )}
            </div>
          )}

          {/* Parameter input if gate takes angle and no gate is currently selected */}
          {!selectedOp && activeGateMeta?.a && (
            <div style={{ marginTop: 8, background: 'var(--bg)', padding: '6px 8px', borderRadius: 6, border: '1px solid var(--b)' }}>
              <label style={{ fontSize: 11, color: 'var(--c)', fontWeight: 600 }}>Placement Angle θ:</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.02"
                value={par}
                onChange={e => setPar(+e.target.value)}
                style={{ width: '100%', marginTop: 4 }}
              />
              <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                <input
                  type="number"
                  step="0.05"
                  value={par}
                  onChange={e => setPar(+e.target.value || 0)}
                  style={{ width: '65px', fontSize: 11, padding: '2px 4px' }}
                />
                <span className="mono" style={{ fontSize: 10, color: 'var(--t)', alignSelf: 'center' }}>
                  × π rad ({(par * 180).toFixed(0)}°)
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'subroutines' && (
        <div>
          <div style={{ fontSize: 11, color: 'var(--m)', marginBottom: 8 }}>
            Click to append composite block:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {BUILTIN_SUBROUTINES.map(sub => (
              <div
                key={sub.name}
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--b)',
                  borderRadius: 6,
                  padding: '6px 8px',
                  cursor: 'pointer'
                }}
                onClick={() => insertSubroutine?.(sub)}
              >
                <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--c)' }}>{sub.name}</div>
                <div style={{ fontSize: 10, color: 'var(--m)', margin: '2px 0' }}>{sub.desc}</div>
                <button
                  style={{ fontSize: 10, padding: '2px 6px', marginTop: 4, width: '100%' }}
                  disabled={n < sub.qubits}
                >
                  {n < sub.qubits ? `Needs ${sub.qubits} Qubits` : 'Insert Subroutine +'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Execution Settings */}
      <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--b)' }}>
        <label>Register Size (max 6):</label>
        <select
          value={n}
          onChange={e => setN(+e.target.value)}
          style={{ width: '100%' }}
        >
          {[1, 2, 3, 4, 5, 6].map(v => (
            <option key={v} value={v}>
              {v} Qubit{v > 1 ? 's' : ''} (dim: {1 << v})
            </option>
          ))}
        </select>

        <label style={{ marginTop: 8 }}>Shots Sampling:</label>
        <input
          type="number"
          min="1"
          max="8192"
          value={shots}
          onChange={e => setShots(Math.max(1, Math.min(8192, +e.target.value || 1)))}
          style={{ width: '100%' }}
        />

        <label style={{ marginTop: 8 }}>Random Seed:</label>
        <div style={{ display: 'flex', gap: 4 }}>
          <input
            type="number"
            value={seed}
            onChange={e => setSeed(+e.target.value || 0)}
            style={{ width: '100%' }}
          />
          <button title="Randomize seed" onClick={() => setSeed(Math.floor(Math.random() * 1e6))}>
            ↻
          </button>
        </div>

        <div style={{ display: 'flex', gap: 4, marginTop: 12 }}>
          <button
            onClick={undo}
            disabled={!canUndo}
            style={{ flex: 1, fontSize: 11, padding: '4px 6px', opacity: canUndo ? 1 : 0.4 }}
            title="Undo last action (Ctrl+Z)"
          >
            Undo
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            style={{ flex: 1, fontSize: 11, padding: '4px 6px', opacity: canRedo ? 1 : 0.4 }}
            title="Redo action (Ctrl+Shift+Z)"
          >
            Redo
          </button>
          <button
            onClick={clear}
            style={{ flex: 1, fontSize: 11, padding: '4px 6px', borderColor: 'var(--er)', color: 'var(--er)' }}
            title="Reset circuit (Ctrl+R)"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
