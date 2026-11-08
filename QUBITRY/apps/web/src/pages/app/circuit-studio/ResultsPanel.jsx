import { useState, useMemo } from 'react';
import {
  bitstring,
  blochVector,
  angles,
  subsystemEntropy,
  singleQubitDensityMatrix,
  formatDirac,
  simulateStepByStep
} from '@qubitry/quantum-core';
import BlochSphere, { BlochReadout } from '../../../components/visualizations/BlochSphere.jsx';
import CodePreview from './CodePreview.jsx';

const Row = ({ l, w, r }) => (
  <div className="row mono" style={{ display: 'grid', gridTemplateColumns: '80px 1fr 80px', gap: 10, alignItems: 'center', margin: '4px 0' }}>
    <span>|{l}⟩</span>
    <div style={{ background: 'var(--e)', borderRadius: 2, height: 16, overflow: 'hidden' }}>
      <div className="bar" style={{ width: `${Math.min(100, Math.max(0, w))}%`, height: '100%', background: 'var(--c)' }} />
    </div>
    <span style={{ textAlign: 'right' }}>{r}</span>
  </div>
);

export default function ResultsPanel({
  n,
  ops,
  sim,
  shots,
  seed,
  tab: controlledTab,
  setTab: setControlledTab,
  stepIdx: controlledStepIdx,
  setStepIdx: setControlledStepIdx
}) {
  const [localTab, setLocalTab] = useState('prob');
  const [localStepIdx, setLocalStepIdx] = useState(null);

  const tab = controlledTab !== undefined ? controlledTab : localTab;
  const setTab = setControlledTab || setLocalTab;
  const stepIdx = controlledStepIdx !== undefined ? controlledStepIdx : localStepIdx;
  const setStepIdx = setControlledStepIdx || setLocalStepIdx;

  const { sv, probs, counts } = sim;

  // Step-by-step timeline snapshots
  const snapshots = useMemo(() => {
    try {
      return simulateStepByStep(n, ops);
    } catch {
      return [];
    }
  }, [n, ops]);

  const activeSnapshot = stepIdx !== null && snapshots[stepIdx] ? snapshots[stepIdx] : null;
  const currentSv = activeSnapshot ? { re: activeSnapshot.re, im: activeSnapshot.im } : sv;

  const nonZeroIndices = useMemo(() => {
    return probs.map((_, i) => i).filter(i => probs[i] > 1e-7);
  }, [probs]);

  // Circuit statistics
  const stats = useMemo(() => {
    const twoQubitCount = ops.filter(o => o.q.length > 1).length;
    const maxMoment = ops.reduce((m, o) => Math.max(m, o.s ?? 0), 0);
    const depth = ops.length > 0 ? maxMoment + 1 : 0;
    const measureCount = ops.filter(o => o.g === 'M').length;
    return {
      totalGates: ops.length,
      twoQubitCount,
      depth,
      measureCount,
      stateDim: 1 << n
    };
  }, [ops, n]);

  const T = (k, label) => (
    <button
      className={tab === k ? 'on' : ''}
      onClick={() => setTab(k)}
      style={{ fontSize: 12, padding: '4px 8px' }}
    >
      {label}
    </button>
  );

  return (
    <div className="card" style={{ marginTop: 12 }}>
      {/* Tab bar */}
      <div className="bg" style={{ gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {T('prob', 'Probabilities')}
        {T('counts', 'Counts')}
        {T('sv', 'Statevector & Dirac')}
        {T('bl', 'Bloch Spheres')}
        {T('entanglement', 'Entanglement & Density Matrix')}
        {T('timeline', 'Step-by-Step Inspector')}
        {T('code', 'Generated Code')}
        {T('stats', 'Circuit Stats')}
      </div>

      {/* Probabilities Tab */}
      {tab === 'prob' && (
        <div>
          <div style={{ marginBottom: 8, fontSize: 12, color: 'var(--m)' }}>
            Exact theoretical Born distribution |amplitude|² (computational basis |q{n - 1}…q0⟩):
          </div>
          {nonZeroIndices.length > 0 ? (
            nonZeroIndices.map(i => (
              <Row
                key={i}
                l={bitstring(i, n)}
                w={probs[i] * 100}
                r={`${(probs[i] * 100).toFixed(2)}%`}
              />
            ))
          ) : (
            <div className="mono" style={{ color: 'var(--m)' }}>No non-zero states.</div>
          )}
        </div>
      )}

      {/* Counts Tab */}
      {tab === 'counts' && (
        <div>
          <div style={{ marginBottom: 8, fontSize: 12, color: 'var(--m)' }}>
            Finite-shot sampling ({shots} shots, seed {seed}):
          </div>
          {Object.keys(counts).length > 0 ? (
            Object.keys(counts)
              .sort((a, b) => +a - +b)
              .map(i => (
                <Row
                  key={i}
                  l={bitstring(+i, n)}
                  w={(counts[i] / shots) * 100}
                  r={`${counts[i]} (${((counts[i] / shots) * 100).toFixed(1)}%)`}
                />
              ))
          ) : (
            <div className="mono" style={{ color: 'var(--m)' }}>No counts recorded.</div>
          )}
        </div>
      )}

      {/* Statevector & Dirac Tab */}
      {tab === 'sv' && (
        <div>
          <div style={{ marginBottom: 8, fontSize: 12, color: 'var(--m)' }}>
            Dirac Notation |ψ⟩:
          </div>
          <div
            className="mono"
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--b)',
              padding: '8px 12px',
              borderRadius: 6,
              fontSize: 13,
              color: 'var(--c)',
              marginBottom: 10,
              overflowX: 'auto'
            }}
          >
            |ψ⟩ = {formatDirac(currentSv, n)}
          </div>

          <div style={{ marginBottom: 4, fontSize: 12, color: 'var(--m)' }}>
            Computational Basis Amplitudes:
          </div>
          <pre style={{ maxHeight: 220, overflowY: 'auto' }}>
            {nonZeroIndices.map(i => {
              const r = currentSv.re[i];
              const im = currentSv.im[i];
              const p = probs[i];
              const phase = Math.atan2(im, r) * 180 / Math.PI;
              return `|${bitstring(i, n)}⟩:  ${r >= 0 ? ' ' : ''}${r.toFixed(4)} ${im >= 0 ? '+' : '-'} ${Math.abs(im).toFixed(4)}i   |c|²=${p.toFixed(4)}   phase=${phase.toFixed(1)}°`;
            }).join('\n')}
          </pre>
        </div>
      )}

      {/* Bloch Spheres Tab */}
      {tab === 'bl' && (
        <div>
          <div className="bg" style={{ gap: 14 }}>
            {Array.from({ length: n }, (_, q) => {
              const v = blochVector(currentSv, n, q);
              const a = angles(v);
              const isEntangled = a.r < 0.999;
              return (
                <div
                  key={q}
                  style={{
                    width: 190,
                    background: 'var(--bg)',
                    padding: 8,
                    borderRadius: 6,
                    border: '1px solid var(--b)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <b className="mono" style={{ color: 'var(--c)' }}>Qubit q{q}</b>
                    {isEntangled && (
                      <span className="tag" style={{ color: 'var(--w)', borderColor: 'var(--w)', fontSize: 10 }}>
                        Mixed (r&lt;1)
                      </span>
                    )}
                  </div>
                  <BlochSphere v={v} size={170} />
                  <BlochReadout v={v} />
                </div>
              );
            })}
          </div>
          <div className="m" style={{ fontSize: 11, marginTop: 8 }}>
            Note: Single-qubit Bloch vector is derived from partial trace. For entangled states, r &lt; 1 represents a mixed state inside the sphere.
          </div>
        </div>
      )}

      {/* Entanglement & Density Matrix Tab */}
      {tab === 'entanglement' && (
        <div>
          <div style={{ marginBottom: 8, fontSize: 12, color: 'var(--m)' }}>
            Bipartite Von Neumann Entanglement Entropy S(ρ_A) = -Tr(ρ_A log₂ ρ_A) and Reduced Purity:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
            {Array.from({ length: n }, (_, q) => {
              const entropy = subsystemEntropy(currentSv, n, q);
              const dm = singleQubitDensityMatrix(currentSv, n, q);
              const v = blochVector(currentSv, n, q);
              const r = Math.hypot(...v);

              return (
                <div
                  key={q}
                  style={{
                    background: 'var(--bg)',
                    border: '1px solid var(--b)',
                    borderRadius: 6,
                    padding: '10px 12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <b className="mono" style={{ color: 'var(--c)' }}>Subsystem q{q}</b>
                    <span className="mono" style={{ fontSize: 11, color: entropy > 0.05 ? 'var(--a)' : 'var(--ok)' }}>
                      {entropy > 0.05 ? 'Entangled' : 'Separable'}
                    </span>
                  </div>

                  <div className="mono" style={{ fontSize: 12 }}>
                    <div>Entropy S(ρ): <b style={{ color: 'var(--t)' }}>{entropy.toFixed(4)} bits</b></div>
                    <div>Purity γ=Tr(ρ²): <b style={{ color: 'var(--t)' }}>{dm.purity.toFixed(4)}</b></div>
                    <div>Bloch radius r: <b style={{ color: 'var(--t)' }}>{r.toFixed(4)}</b></div>
                  </div>

                  <div style={{ marginTop: 8, fontSize: 10, color: 'var(--m)' }}>
                    Reduced Density Matrix ρ:
                  </div>
                  <pre style={{ fontSize: 10, padding: 4, marginTop: 2 }}>
{`[[ ${dm.re[0][0].toFixed(3)},  ${dm.re[0][1].toFixed(3)}+${dm.im[0][1].toFixed(3)}i ],
 [ ${dm.re[1][0].toFixed(3)}+${dm.im[1][0].toFixed(3)}i,  ${dm.re[1][1].toFixed(3)} ]]`}
                  </pre>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step-by-Step Inspector Tab */}
      {tab === 'timeline' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--m)' }}>
              Step-by-Step State Timeline ({snapshots.length} moments):
            </span>
            <button
              style={{ fontSize: 11, padding: '2px 8px' }}
              onClick={() => setStepIdx(null)}
            >
              Reset to Final State
            </button>
          </div>

          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '6px 0', marginBottom: 10 }}>
            {snapshots.map((snap, idx) => {
              const isActive = (stepIdx === null && idx === snapshots.length - 1) || stepIdx === idx;
              return (
                <button
                  key={idx}
                  className={isActive ? 'on' : ''}
                  onClick={() => setStepIdx(idx)}
                  style={{ minWidth: 64, padding: '4px 6px', fontSize: 11, textAlign: 'center' }}
                >
                  <div style={{ fontWeight: 'bold' }}>t={snap.step}</div>
                  <div style={{ fontSize: 9, opacity: 0.8 }}>
                    {snap.op ? snap.op.g : 'Initial'}
                  </div>
                </button>
              );
            })}
          </div>

          {activeSnapshot && (
            <div style={{ background: 'var(--bg)', border: '1px solid var(--b)', borderRadius: 6, padding: '8px 12px' }}>
              <div style={{ fontSize: 12, color: 'var(--c)', marginBottom: 4 }}>
                State after moment t={activeSnapshot.step} {activeSnapshot.op ? `(${activeSnapshot.op.g} on q[${activeSnapshot.op.q.join(',')}])` : '(Initial state |0...0⟩)'}:
              </div>
              <div className="mono" style={{ fontSize: 13, color: 'var(--t)' }}>
                |ψ(t)⟩ = {formatDirac({ re: activeSnapshot.re, im: activeSnapshot.im }, n)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Code Preview Tab */}
      {tab === 'code' && (
        <CodePreview n={n} ops={ops} />
      )}

      {/* Circuit Stats Tab */}
      {tab === 'stats' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <div className="card" style={{ background: 'var(--bg)' }}>
            <div className="m" style={{ fontSize: 11 }}>Total Quantum Gates</div>
            <b style={{ fontSize: 20, color: 'var(--c)' }}>{stats.totalGates}</b>
          </div>
          <div className="card" style={{ background: 'var(--bg)' }}>
            <div className="m" style={{ fontSize: 11 }}>Two-Qubit / Entangling Gates</div>
            <b style={{ fontSize: 20, color: 'var(--a)' }}>{stats.twoQubitCount}</b>
          </div>
          <div className="card" style={{ background: 'var(--bg)' }}>
            <div className="m" style={{ fontSize: 11 }}>Circuit Depth (Moments)</div>
            <b style={{ fontSize: 20, color: 'var(--t)' }}>{stats.depth}</b>
          </div>
          <div className="card" style={{ background: 'var(--bg)' }}>
            <div className="m" style={{ fontSize: 11 }}>Hilbert Space Dimension</div>
            <b style={{ fontSize: 20, color: 'var(--ok)' }}>2^{n} ({stats.stateDim} states)</b>
          </div>
        </div>
      )}
    </div>
  );
}
