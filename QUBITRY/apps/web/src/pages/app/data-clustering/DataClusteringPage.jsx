import { useState } from 'react';

// Curriculum 18-12 Worked Numerical Data Points
const INITIAL_POINTS = [
  { id: 'P1', x: 1.0, y: 1.0 },
  { id: 'P2', x: 1.5, y: 2.0 },
  { id: 'P3', x: 3.0, y: 4.0 },
  { id: 'P4', x: 5.0, y: 7.0 },
  { id: 'P5', x: 3.5, y: 5.0 },
  { id: 'P6', x: 4.5, y: 5.0 },
  { id: 'P7', x: 3.5, y: 4.5 }
];

export default function DataClusteringPage() {
  const [activeTab, setActiveTab] = useState('kmeans'); // 'kmeans' | 'quantum-clustering' | 'qram'

  // K-Means Step-by-Step Simulation State (k=2 clusters)
  const [step, setStep] = useState(0);
  const [centroids, setCentroids] = useState([
    { x: 1.0, y: 1.0 },
    { x: 5.0, y: 7.0 }
  ]);
  const [assignments, setAssignments] = useState([]);

  // Perform one iteration of K-Means assignment & update
  const handleNextKMeansIteration = () => {
    const newAssignments = INITIAL_POINTS.map(p => {
      const d0 = Math.hypot(p.x - centroids[0].x, p.y - centroids[0].y);
      const d1 = Math.hypot(p.x - centroids[1].x, p.y - centroids[1].y);
      return d0 <= d1 ? 0 : 1;
    });

    const c0Points = INITIAL_POINTS.filter((_, i) => newAssignments[i] === 0);
    const c1Points = INITIAL_POINTS.filter((_, i) => newAssignments[i] === 1);

    const newC0 = {
      x: c0Points.reduce((s, p) => s + p.x, 0) / (c0Points.length || 1),
      y: c0Points.reduce((s, p) => s + p.y, 0) / (c0Points.length || 1)
    };
    const newC1 = {
      x: c1Points.reduce((s, p) => s + p.x, 0) / (c1Points.length || 1),
      y: c1Points.reduce((s, p) => s + p.y, 0) / (c1Points.length || 1)
    };

    setAssignments(newAssignments);
    setCentroids([newC0, newC1]);
    setStep(s => s + 1);
  };

  const handleResetKMeans = () => {
    setStep(0);
    setCentroids([
      { x: 1.0, y: 1.0 },
      { x: 5.0, y: 7.0 }
    ]);
    setAssignments([]);
  };

  return (
    <div className="w">
      <div style={{ marginBottom: 16 }}>
        <h2>Quantum Data Processing &amp; Clustering</h2>
        <p className="m" style={{ margin: '4px 0 0' }}>
          Explore classical and quantum clustering algorithms (K-Means / Q-Means) and associative memory (Hopfield / QRAM).
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
        <button
          className={activeTab === 'kmeans' ? 'on' : ''}
          onClick={() => setActiveTab('kmeans')}
        >
          Curriculum K-Means Numerical
        </button>
        <button
          className={activeTab === 'quantum-clustering' ? 'on' : ''}
          onClick={() => setActiveTab('quantum-clustering')}
        >
          Quantum Q-Means (Swap-Test)
        </button>
        <button
          className={activeTab === 'qram' ? 'on' : ''}
          onClick={() => setActiveTab('qram')}
        >
          Associative Memory &amp; QRAM
        </button>
      </div>

      {/* K-Means Numerical Tab */}
      {activeTab === 'kmeans' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="tag" style={{ color: 'var(--ok)' }}>Curriculum Exercise 18-12</span>
                <span className="tag">Interactive Numerical</span>
              </div>
              <div className="mono" style={{ fontSize: 12, color: 'var(--c)' }}>
                Iteration: {step}
              </div>
            </div>

            <h3 style={{ fontSize: 16, margin: '8px 0 6px' }}>Worked K-Means Clustering on 2D Sample Data</h3>
            <p className="m" style={{ fontSize: 12, lineHeight: 1.5 }}>
              Step-by-step assignment and centroid recalculation for k=2 clusters with Euclidean distance metric:
            </p>

            {/* 2D Coordinate Grid Visualizer */}
            <div style={{ background: 'var(--bg)', border: '1px solid var(--b)', borderRadius: 8, padding: 12, margin: '12px 0' }}>
              <svg width="100%" height="220" viewBox="0 0 360 220" style={{ display: 'block' }}>
                {[0, 1, 2, 3, 4, 5, 6, 7].map(val => (
                  <g key={val}>
                    <line x1={40 + val * 40} y1="10" x2={40 + val * 40} y2="190" stroke="#182131" />
                    <line x1="40" y1={190 - val * 24} x2="330" y2={190 - val * 24} stroke="#182131" />
                    <text x={40 + val * 40} y="206" fill="#929CAD" fontSize="9" textAnchor="middle" fontFamily="JetBrains Mono">{val}</text>
                    <text x="28" y={194 - val * 24} fill="#929CAD" fontSize="9" textAnchor="end" fontFamily="JetBrains Mono">{val}</text>
                  </g>
                ))}

                {INITIAL_POINTS.map((pt, idx) => {
                  const cluster = assignments[idx];
                  const color = cluster === 0 ? '#65D5D0' : cluster === 1 ? '#A99AFF' : '#ECEEF4';
                  const cx = 40 + pt.x * 40;
                  const cy = 190 - pt.y * 24;
                  return (
                    <g key={pt.id}>
                      <circle cx={cx} cy={cy} r="6" fill={color} />
                      <text x={cx + 8} y={cy - 4} fill="#ECEEF4" fontSize="10" fontFamily="JetBrains Mono">{pt.id}</text>
                    </g>
                  );
                })}

                {centroids.map((c, idx) => {
                  const cx = 40 + c.x * 40;
                  const cy = 190 - c.y * 24;
                  const color = idx === 0 ? '#65D5D0' : '#A99AFF';
                  return (
                    <g key={idx}>
                      <polygon points={`${cx},${cy - 8} ${cx + 7},${cy + 5} ${cx - 7},${cy + 5}`} fill={color} stroke="#FFFFFF" strokeWidth="1.5" />
                      <text x={cx} y={cy + 18} fill={color} fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono" fontWeight="bold">μ{idx + 1}</text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="pri" onClick={handleNextKMeansIteration}>
                Run Step {step + 1} (Assign &amp; Update) →
              </button>
              <button onClick={handleResetKMeans}>Reset</button>
            </div>
          </div>

          {/* Centroid Coordinates & Assignments Table */}
          <div className="card">
            <b style={{ color: 'var(--c)' }}>Cluster Summary</b>
            <div style={{ marginTop: 10, fontSize: 12 }}>
              <div className="mono" style={{ color: '#65D5D0', marginBottom: 4 }}>
                Centroid μ₁: ({centroids[0].x.toFixed(2)}, {centroids[0].y.toFixed(2)})
              </div>
              <div className="mono" style={{ color: '#A99AFF' }}>
                Centroid μ₂: ({centroids[1].x.toFixed(2)}, {centroids[1].y.toFixed(2)})
              </div>
            </div>

            <div style={{ marginTop: 14, borderTop: '1px solid var(--b)', paddingTop: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--m)', marginBottom: 6 }}>Point Assignments:</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, fontSize: 11 }} className="mono">
                {INITIAL_POINTS.map((pt, idx) => (
                  <div key={pt.id} style={{ background: 'var(--bg)', padding: '3px 4px', borderRadius: 4, textAlign: 'center' }}>
                    {pt.id}: {assignments[idx] !== undefined ? `C${assignments[idx] + 1}` : '–'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quantum Q-Means Tab */}
      {activeTab === 'quantum-clustering' && (
        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>Quantum Distance Estimation (Swap Test)</h3>
          <p className="m" style={{ fontSize: 13, lineHeight: 1.6 }}>
            In classical K-Means, computing Euclidean distance between N data vectors and K cluster centers requires O(N K d) operations where d is the feature dimension.
          </p>
          <p className="m" style={{ fontSize: 13, lineHeight: 1.6 }}>
            <b>Quantum Subroutine:</b> By encoding normalized vectors into amplitudes |a⟩ and |b⟩, a quantum <b>Swap Test</b> with an ancilla qubit estimates the inner product overlap |⟨a|b⟩|² in O(log d) time, calculating Euclidean distance d(a, b)² = 2(1 - Re⟨a|b⟩).
          </p>
          <div className="card" style={{ background: 'var(--bg)', borderColor: 'var(--w)', marginTop: 14 }}>
            <b style={{ color: 'var(--w)', fontSize: 12 }}>Data Loading Caveat:</b>
            <div className="m" style={{ fontSize: 11, marginTop: 4 }}>
              Quantum speedup for Q-Means relies on efficient state preparation (such as QRAM). If preparing |a⟩ takes O(d) classical time, the end-to-end algorithmic advantage disappears.
            </div>
          </div>
        </div>
      )}

      {/* Associative Memory & QRAM Tab */}
      {activeTab === 'qram' && (
        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>Hopfield Associative Memory vs QRAM</h3>
          <p className="m" style={{ fontSize: 13, lineHeight: 1.6 }}>
            A classical <b>Hopfield network</b> is an associative content-addressable memory storing binary patterns as local energy minima in a symmetric weight matrix W_ij = ∑_p x_i^p x_j^p. Given a corrupted or partial pattern, the network converges to the nearest stored memory via energy descent.
          </p>
          <p className="m" style={{ fontSize: 13, lineHeight: 1.6 }}>
            <b>Quantum Associative Memory (QAM) &amp; QRAM:</b> QRAM allows a quantum address register in superposition ∑_j α_j |j⟩ to load classical memory contents into a quantum data register: ∑_j α_j |j⟩ |D_j⟩. Practical physical realization requires O(N) quantum routing switches (e.g. quantum dot arrays / bucket brigade architecture) and error suppression.
          </p>
        </div>
      )}
    </div>
  );
}
