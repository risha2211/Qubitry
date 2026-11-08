import { useState, useMemo } from 'react';

const TOY_DATA = [
  { x1: 0.2, x2: 0.3, label: 0 },
  { x1: 0.4, x2: 0.1, label: 0 },
  { x1: 0.1, x2: 0.5, label: 0 },
  { x1: 0.8, x2: 0.7, label: 1 },
  { x1: 0.7, x2: 0.9, label: 1 },
  { x1: 0.9, x2: 0.6, label: 1 }
];

export default function QMLPage() {
  const [activeTab, setActiveTab] = useState('encoding'); // 'encoding' | 'kernel' | 'vqc'

  // Angle encoding interactive probe point
  const [probeX1, setProbeX1] = useState(0.5);
  const [probeX2, setProbeX2] = useState(0.7);

  // Compute quantum feature state angles
  const angleTheta1 = probeX1 * Math.PI;
  const angleTheta2 = probeX2 * Math.PI;

  // Quantum Kernel Matrix K_ij = |<Phi(x_i)|Phi(x_j)>|^2
  // For product angle encoding: K(x, x') = cos^2((th1 - th1')/2) * cos^2((th2 - th2')/2)
  const kernelMatrix = useMemo(() => {
    const N = TOY_DATA.length;
    const mat = [];
    for (let i = 0; i < N; i++) {
      const row = [];
      const ptA = TOY_DATA[i];
      for (let j = 0; j < N; j++) {
        const ptB = TOY_DATA[j];
        const k1 = Math.pow(Math.cos(((ptA.x1 - ptB.x1) * Math.PI) / 2), 2);
        const k2 = Math.pow(Math.cos(((ptA.x2 - ptB.x2) * Math.PI) / 2), 2);
        row.push(k1 * k2);
      }
      mat.push(row);
    }
    return mat;
  }, []);

  return (
    <div className="w">
      <div style={{ marginBottom: 16 }}>
        <h2>Quantum Machine Learning (QML)</h2>
        <p className="m" style={{ margin: '4px 0 0' }}>
          Explore data encoding, quantum feature maps, kernel methods (QSVM), and variational quantum classifiers.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
        <button
          className={activeTab === 'encoding' ? 'on' : ''}
          onClick={() => setActiveTab('encoding')}
        >
          Data Encoding Comparison
        </button>
        <button
          className={activeTab === 'kernel' ? 'on' : ''}
          onClick={() => setActiveTab('kernel')}
        >
          Quantum Kernels (QSVM)
        </button>
        <button
          className={activeTab === 'vqc' ? 'on' : ''}
          onClick={() => setActiveTab('vqc')}
        >
          Variational Classifier (VQC)
        </button>
      </div>

      {/* Data Encoding Comparison Tab */}
      {activeTab === 'encoding' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {/* Basis Encoding */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b style={{ color: 'var(--c)' }}>Basis Encoding</b>
                <span className="tag">N Qubits</span>
              </div>
              <p className="m" style={{ fontSize: 12, margin: '6px 0 10px' }}>
                Maps an n-bit binary vector directly to computational basis state: x = (b₁, ..., bₙ) ↦ |b₁...bₙ⟩.
              </p>
              <div className="card mono" style={{ background: 'var(--bg)', fontSize: 11 }}>
                <div>x = (1, 0, 1) ↦ |101⟩</div>
                <div style={{ color: 'var(--m)', marginTop: 4 }}>Qubits: N &nbsp;|&nbsp; Depth: O(1)</div>
              </div>
              <div className="m" style={{ fontSize: 11, marginTop: 8 }}>
                <b>Limitation:</b> Inefficient for continuous real data; requires binary discretization.
              </div>
            </div>

            {/* Angle Encoding */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b style={{ color: 'var(--c)' }}>Angle Encoding</b>
                <span className="tag" style={{ color: 'var(--ok)' }}>N Qubits</span>
              </div>
              <p className="m" style={{ fontSize: 12, margin: '6px 0 10px' }}>
                Encodes each feature xᵢ as a rotation angle on an independent qubit: x ↦ ⊗ᵢ (cos(xᵢ)|0⟩ + sin(xᵢ)|1⟩).
              </p>
              <div className="card mono" style={{ background: 'var(--bg)', fontSize: 11 }}>
                <div>|ψ(x)⟩ = ⊗ᵢ R_Y(2xᵢ)|0⟩</div>
                <div style={{ color: 'var(--m)', marginTop: 4 }}>Qubits: N &nbsp;|&nbsp; Depth: O(1)</div>
              </div>
              <div className="m" style={{ fontSize: 11, marginTop: 8 }}>
                <b>Strength:</b> Clean O(1) circuit depth; standard for NISQ variational classifiers.
              </div>
            </div>

            {/* Amplitude Encoding */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <b style={{ color: 'var(--c)' }}>Amplitude Encoding</b>
                <span className="tag" style={{ color: 'var(--a)' }}>log₂(N) Qubits</span>
              </div>
              <p className="m" style={{ fontSize: 12, margin: '6px 0 10px' }}>
                Encodes an N-dimensional normalized vector x into amplitudes: |ψ(x)⟩ = ∑ᵢ xᵢ |i⟩ with ||x||=1.
              </p>
              <div className="card mono" style={{ background: 'var(--bg)', fontSize: 11 }}>
                <div>x ∈ ℝᴺ ↦ ∑ᵢ xᵢ |i⟩</div>
                <div style={{ color: 'var(--m)', marginTop: 4 }}>Qubits: ⌈log₂ N⌉ &nbsp;|&nbsp; Depth: O(N)</div>
              </div>
              <div className="m" style={{ fontSize: 11, marginTop: 8 }}>
                <b>Trade-off:</b> Exponential qubit compression, but state preparation circuit depth scales with O(N).
              </div>
            </div>
          </div>

          {/* Interactive Angle Encoding Demo */}
          <div className="card" style={{ marginTop: 16 }}>
            <b style={{ color: 'var(--c)' }}>Interactive Angle Feature Map</b>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 10 }}>
              <div>
                <label>Feature x₁ ∈ [0, 1]: {probeX1.toFixed(2)} (θ₁ = {(probeX1 * 180).toFixed(0)}°)</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={probeX1}
                  onChange={e => setProbeX1(+e.target.value)}
                />
              </div>
              <div>
                <label>Feature x₂ ∈ [0, 1]: {probeX2.toFixed(2)} (θ₂ = {(probeX2 * 180).toFixed(0)}°)</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={probeX2}
                  onChange={e => setProbeX2(+e.target.value)}
                />
              </div>
            </div>
            <div className="mono" style={{ fontSize: 12, color: 'var(--t)', marginTop: 8 }}>
              Prepared State: |ψ(x)⟩ = [{Math.cos(angleTheta1 / 2).toFixed(3)}|0⟩ + {Math.sin(angleTheta1 / 2).toFixed(3)}|1⟩] ⊗ [{Math.cos(angleTheta2 / 2).toFixed(3)}|0⟩ + {Math.sin(angleTheta2 / 2).toFixed(3)}|1⟩]
            </div>
          </div>
        </div>
      )}

      {/* Quantum Kernels & QSVM Tab */}
      {activeTab === 'kernel' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
          <div className="card">
            <h3 style={{ fontSize: 16, marginBottom: 8 }}>Quantum Kernel Matrix K_ij = |⟨Φ(x_i)|Φ(x_j)⟩|²</h3>
            <p className="m" style={{ fontSize: 12, lineHeight: 1.5 }}>
              In a <b>Quantum Support Vector Machine (QSVM)</b>, classical data points x_i are mapped to quantum states |Φ(x_i)⟩. A quantum computer computes inner product overlaps via a Swap test or inversion circuit U_Φ(x_j)† U_Φ(x_i). The resulting Gram matrix K is fed into a classical convex quadratic optimizer.
            </p>

            {/* Kernel Matrix Grid */}
            <div style={{ margin: '14px 0', overflowX: 'auto' }}>
              <div style={{ fontSize: 11, color: 'var(--m)', marginBottom: 6 }}>
                Estimated Quantum Kernel Matrix (6×6 samples):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 44px)', gap: 4 }}>
                {kernelMatrix.map((row, r) =>
                  row.map((val, c) => (
                    <div
                      key={`${r}-${c}`}
                      style={{
                        height: 38,
                        background: `rgba(101, 213, 208, ${val})`,
                        border: '1px solid var(--b)',
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontFamily: 'JetBrains Mono',
                        color: val > 0.5 ? '#0B0E14' : '#ECEEF4'
                      }}
                      title={`K(x_${r}, x_${c}) = ${val.toFixed(3)}`}
                    >
                      {val.toFixed(2)}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <b style={{ color: 'var(--c)' }}>Scientific Transparency</b>
            <div className="m" style={{ fontSize: 12, lineHeight: 1.6, marginTop: 8 }}>
              <b>Classical vs Quantum Boundaries:</b>
              <ul>
                <li>Quantum part: feature mapping &amp; fidelity overlap estimation K(x_i, x_j).</li>
                <li>Classical part: standard Support Vector Machine quadratic programming max_α Σ α_i - (1/2) Σ α_i α_j y_i y_j K(x_i, x_j).</li>
              </ul>
              <div>No automatic exponential advantage is guaranteed without provably hard-to-simulate classical kernels.</div>
            </div>
          </div>
        </div>
      )}

      {/* Variational Classifier (VQC) Tab */}
      {activeTab === 'vqc' && (
        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>Variational Quantum Classifier (VQC) Pipeline</h3>
          <p className="m" style={{ fontSize: 13, lineHeight: 1.6 }}>
            A VQC executes a hybrid loop: classical data encoding U_Φ(x) followed by parameterized entangling layers W(θ). Measurement of an observable ⟨Z⟩ provides the classification decision y = sign(⟨Z⟩):
          </p>
          <div className="card" style={{ background: 'var(--bg)', margin: '12px 0' }}>
            <div className="mono" style={{ color: 'var(--c)' }}>
              x ↦ |0⟩^(⊗n) &nbsp;—[ U_Φ(x) ]— &nbsp;—[ W(θ) ]— &nbsp;—[ Measure Z₀ ]— ↦ ŷ(x, θ)
            </div>
          </div>
          <p className="m" style={{ fontSize: 12 }}>
            Challenges: Variational quantum circuits suffer from <b>barren plateaus</b> (exponentially vanishing gradients) as qubit counts grow, requiring shallow architectures and local observables.
          </p>
        </div>
      )}
    </div>
  );
}

