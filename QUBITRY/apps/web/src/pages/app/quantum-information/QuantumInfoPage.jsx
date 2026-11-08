import { useState } from 'react';

export default function QuantumInfoPage() {
  const [activeTab, setActiveTab] = useState('chsh'); // 'chsh' | 'tomography' | 'helstrom' | 'complexity'

  // CHSH interactive measurement angles
  const [aliceAngle, setAliceAngle] = useState(0); // degrees
  const [bobAngle, setBobAngle] = useState(22.5);  // degrees (pi/8)

  // CHSH correlation E(a, b) = -cos(2 * (a - b)) for singlet or cos for Phi+
  const correlationVal = Math.cos(2 * (aliceAngle - bobAngle) * (Math.PI / 180));
  const chshS = 2 * Math.sqrt(2) * Math.cos(2 * (aliceAngle - bobAngle) * (Math.PI / 180) - (Math.PI / 4));

  // Helstrom Bound angle between two states |psi_0> = |0> and |psi_1> = cos(th)|0> + sin(th)|1>
  const [helstromTheta, setHelstromTheta] = useState(30); // degrees
  const helstromErrorProb = 0.5 * (1 - Math.sin(helstromTheta * (Math.PI / 180)));

  return (
    <div className="w">
      <div style={{ marginBottom: 16 }}>
        <h2>Quantum Information &amp; Foundations</h2>
        <p className="m" style={{ margin: '4px 0 0' }}>
          Explore Bell inequalities, quantum games, state tomography, discrimination bounds, and computational complexity.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
        <button
          className={activeTab === 'chsh' ? 'on' : ''}
          onClick={() => setActiveTab('chsh')}
        >
          CHSH Game &amp; Tsirelson Bound
        </button>
        <button
          className={activeTab === 'tomography' ? 'on' : ''}
          onClick={() => setActiveTab('tomography')}
        >
          Quantum State Tomography
        </button>
        <button
          className={activeTab === 'helstrom' ? 'on' : ''}
          onClick={() => setActiveTab('helstrom')}
        >
          State Discrimination &amp; Helstrom Bound
        </button>
        <button
          className={activeTab === 'complexity' ? 'on' : ''}
          onClick={() => setActiveTab('complexity')}
        >
          BQP &amp; Complexity Classes
        </button>
      </div>

      {/* CHSH Tab */}
      {activeTab === 'chsh' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
          <div className="card">
            <h3 style={{ fontSize: 16, marginBottom: 8 }}>Clauser–Horne–Shimony–Holt (CHSH) Inequality</h3>
            <p className="m" style={{ fontSize: 13, lineHeight: 1.6 }}>
              In the CHSH game, referee sends random bits x, y ∈ {'{0, 1}'} to Alice and Bob, who return bits a, b ∈ {'{0, 1}'} without communicating. They win if a ⊕ b = x · y.
            </p>
            <ul>
              <li><b>Classical Local Realism:</b> Maximum winning probability is strictly bounded by <b>75%</b> (CHSH parameter S ≤ 2).</li>
              <li><b>Quantum Entanglement:</b> Sharing Bell state |Φ⁺⟩ and measuring at optimal angles achieves winning probability cos²(π/8) ≈ <b>85.36%</b>.</li>
              <li><b>Tsirelson’s Bound:</b> Quantum physics allows a maximum value of S = 2√2 ≈ <b>2.8284</b>, proving that quantum mechanics violates local hidden-variable theories.</li>
            </ul>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '14px 0' }}>
              <div className="card" style={{ background: 'var(--bg)' }}>
                <div className="m" style={{ fontSize: 11 }}>Classical Bell Bound S</div>
                <b style={{ fontSize: 22, color: 'var(--m)' }}>S ≤ 2.000</b>
              </div>
              <div className="card" style={{ background: 'var(--bg)' }}>
                <div className="m" style={{ fontSize: 11 }}>Tsirelson Quantum Bound S_max</div>
                <b style={{ fontSize: 22, color: 'var(--ok)' }}>2√2 ≈ 2.828</b>
              </div>
            </div>
          </div>

          <div className="card">
            <b style={{ color: 'var(--c)' }}>Measurement Settings</b>
            <div style={{ marginTop: 12 }}>
              <label>Alice Measurement Angle: {aliceAngle}°</label>
              <input
                type="range"
                min="0"
                max="90"
                step="2.5"
                value={aliceAngle}
                onChange={e => setAliceAngle(+e.target.value)}
              />
            </div>
            <div style={{ marginTop: 12 }}>
              <label>Bob Measurement Angle: {bobAngle}°</label>
              <input
                type="range"
                min="0"
                max="90"
                step="2.5"
                value={bobAngle}
                onChange={e => setBobAngle(+e.target.value)}
              />
            </div>
            <div className="mono" style={{ fontSize: 12, marginTop: 14 }}>
              Correlation E(A, B): {correlationVal.toFixed(3)}
            </div>
          </div>
        </div>
      )}

      {/* State Tomography Tab */}
      {activeTab === 'tomography' && (
        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>Single-Qubit State Tomography</h3>
          <p className="m" style={{ fontSize: 13, lineHeight: 1.6 }}>
            A quantum state cannot be directly read from a single system due to the no-cloning theorem. State tomography reconstructs the full density matrix ρ̂ by measuring an ensemble of identical copies in the three orthogonal Pauli bases:
          </p>
          <div className="card mono" style={{ background: 'var(--bg)', margin: '12px 0', fontSize: 12 }}>
            <div>ρ = 1/2 [ I + ⟨X⟩·X + ⟨Y⟩·Y + ⟨Z⟩·Z ]</div>
          </div>
          <ul>
            <li>Measure in computational basis Z: yields ⟨Z⟩ = P(0) - P(1).</li>
            <li>Measure in diagonal basis X (apply H before measurement): yields ⟨X⟩.</li>
            <li>Measure in circular basis Y (apply S†H before measurement): yields ⟨Y⟩.</li>
          </ul>
        </div>
      )}

      {/* Helstrom Bound Tab */}
      {activeTab === 'helstrom' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
          <div className="card">
            <h3 style={{ fontSize: 16, marginBottom: 8 }}>Quantum State Discrimination &amp; Helstrom Bound</h3>
            <p className="m" style={{ fontSize: 13, lineHeight: 1.6 }}>
              Non-orthogonal quantum states |ψ₀⟩ and |ψ₁⟩ cannot be distinguished with 100% certainty. The <b>Helstrom Bound</b> defines the fundamental quantum limit for the minimum probability of error under equal prior probabilities:
            </p>
            <div className="card mono" style={{ background: 'var(--bg)', margin: '10px 0', fontSize: 12 }}>
              <div>P_error,min = 1/2 [ 1 - 1/2 ||ρ₀ - ρ₁||₁ ] = 1/2 [ 1 - sin(θ) ]</div>
            </div>
            <div style={{ marginTop: 12 }}>
              <div className="m" style={{ fontSize: 11 }}>Minimum Error Probability P_e:</div>
              <b style={{ fontSize: 24, color: 'var(--c)' }}>{(helstromErrorProb * 100).toFixed(2)}%</b>
            </div>
          </div>

          <div className="card">
            <b style={{ color: 'var(--c)' }}>State Overlap Angle θ</b>
            <div style={{ marginTop: 12 }}>
              <label>Angle Between States θ: {helstromTheta}°</label>
              <input
                type="range"
                min="0"
                max="90"
                step="1"
                value={helstromTheta}
                onChange={e => setHelstromTheta(+e.target.value)}
              />
            </div>
            <div className="m" style={{ fontSize: 11, marginTop: 12 }}>
              When θ = 90° (orthogonal states), error probability is 0%. When θ = 0° (identical states), error is 50% (random guess).
            </div>
          </div>
        </div>
      )}

      {/* Complexity Classes Tab */}
      {activeTab === 'complexity' && (
        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>BQP &amp; Computational Complexity Classes</h3>
          <p className="m" style={{ fontSize: 13, lineHeight: 1.6 }}>
            <b>BQP (Bounded-error Quantum Polynomial-time)</b> is the class of decision problems solvable by a polynomial-time quantum algorithm with error probability bounded by $\le 1/3$.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, margin: '14px 0' }}>
            <div className="card" style={{ background: 'var(--bg)' }}>
              <b style={{ color: 'var(--ok)' }}>P</b>
              <div className="m" style={{ fontSize: 11 }}>Deterministic Classical Polynomial time.</div>
            </div>
            <div className="card" style={{ background: 'var(--bg)' }}>
              <b style={{ color: 'var(--c)' }}>BPP</b>
              <div className="m" style={{ fontSize: 11 }}>Probabilistic Classical Polynomial time with bounded error.</div>
            </div>
            <div className="card" style={{ background: 'var(--bg)' }}>
              <b style={{ color: 'var(--a)' }}>BQP</b>
              <div className="m" style={{ fontSize: 11 }}>Contains BPP and integer factoring / discrete log (Shor).</div>
            </div>
            <div className="card" style={{ background: 'var(--bg)' }}>
              <b style={{ color: 'var(--w)' }}>NP-Complete</b>
              <div className="m" style={{ fontSize: 11 }}>Believed to lie outside BQP. Quantum computers do not solve NP-complete problems in polynomial time.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

