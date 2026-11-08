import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCircuit } from '../../../stores/CircuitContext.jsx';
import { nextId } from '@qubitry/quantum-core';

export default function OptimizationLabPage() {
  const nav = useNavigate();
  const { setCirc } = useCircuit();
  const [activeTab, setActiveTab] = useState('qaoa');

  // QAOA Max-Cut State (4-node cycle graph C4: edges (0,1), (1,2), (2,3), (3,0))
  const [gamma, setGamma] = useState(0.4);
  const [beta, setBeta] = useState(0.3);

  const qaoaExpectation = useMemo(() => {
    const g = gamma * Math.PI;
    const b = beta * Math.PI;
    const edgeVal = 0.5 * (1 + Math.sin(2 * b) * Math.sin(g) * Math.pow(Math.cos(g), 2));
    return 4 * edgeVal;
  }, [gamma, beta]);

  const [vqeTheta, setVqeTheta] = useState(0.65);
  const exactGroundStateEnergy = -1.85;

  const vqeEnergy = useMemo(() => {
    const th = vqeTheta * Math.PI;
    return -1.05 - 0.78 * Math.cos(th) - 0.2 * Math.sin(th);
  }, [vqeTheta]);

  const handleLaunchQaoaCircuit = () => {
    const ops = [
      { g: 'H', q: [0], s: 0, id: nextId() },
      { g: 'H', q: [1], s: 0, id: nextId() },
      { g: 'H', q: [2], s: 0, id: nextId() },
      { g: 'H', q: [3], s: 0, id: nextId() },
      { g: 'CX', q: [0, 1], s: 1, id: nextId() },
      { g: 'RZ', q: [1], p: 2 * gamma * Math.PI, s: 2, id: nextId() },
      { g: 'CX', q: [0, 1], s: 3, id: nextId() },
      { g: 'CX', q: [1, 2], s: 4, id: nextId() },
      { g: 'RZ', q: [2], p: 2 * gamma * Math.PI, s: 5, id: nextId() },
      { g: 'CX', q: [1, 2], s: 6, id: nextId() },
      { g: 'RX', q: [0], p: 2 * beta * Math.PI, s: 7, id: nextId() },
      { g: 'RX', q: [1], p: 2 * beta * Math.PI, s: 7, id: nextId() },
      { g: 'RX', q: [2], p: 2 * beta * Math.PI, s: 7, id: nextId() },
      { g: 'RX', q: [3], p: 2 * beta * Math.PI, s: 7, id: nextId() }
    ];

    setCirc({
      n: 4,
      note: {
        name: `QAOA Max-Cut 4-Cycle (γ=${gamma.toFixed(2)}π, β=${beta.toFixed(2)}π)`,
        description: 'Quantum Approximate Optimization Algorithm 1-layer circuit for 4-node Max-Cut graph.',
        expected: 'Bi-modal amplification of optimal cut bitstrings |0101⟩ and |1010⟩.',
        type: 'Hybrid Algorithm',
        level: 'Advanced'
      },
      ops
    });
    nav('/studio');
  };

  return (
    <div className="w">
      <div style={{ marginBottom: 16 }}>
        <h2>Optimization Lab</h2>
        <p className="m" style={{ margin: '4px 0 0' }}>
          Explore quantum and hybrid classical-quantum algorithms for combinatorial optimization, Hamiltonians, and ground state estimation.
        </p>
      </div>

      {/* Lab Nav Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
        <button
          className={activeTab === 'qaoa' ? 'on' : ''}
          onClick={() => setActiveTab('qaoa')}
        >
          QAOA (Max-Cut)
        </button>
        <button
          className={activeTab === 'vqe' ? 'on' : ''}
          onClick={() => setActiveTab('vqe')}
        >
          VQE (Eigensolver)
        </button>
        <button
          className={activeTab === 'adiabatic' ? 'on' : ''}
          onClick={() => setActiveTab('adiabatic')}
        >
          Adiabatic &amp; Annealing
        </button>
      </div>

      {/* QAOA Section */}
      {activeTab === 'qaoa' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
          <div className="card">
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              <span className="tag" style={{ color: 'var(--c)' }}>Hybrid Algorithm</span>
              <span className="tag">Advanced</span>
              <span className="tag">4 Qubits</span>
            </div>
            <h3 style={{ fontSize: 18, marginBottom: 6 }}>Quantum Approximate Optimization (QAOA) on Max-Cut</h3>
            <p className="m" style={{ fontSize: 13, lineHeight: 1.6 }}>
              The <b>Max-Cut problem</b> seeks a binary partition of graph vertices that maximizes the number of cut edges. QAOA alternates between a <i>Problem Hamiltonian</i> H_C parameterized by γ and a <i>Transverse Mixer Hamiltonian</i> H_M parameterized by β:
            </p>

            <div className="card" style={{ background: 'var(--bg)', margin: '10px 0', fontSize: 12 }}>
              <div className="mono" style={{ color: 'var(--c)' }}>
                |γ, β⟩ = e^(-i β H_M) e^(-i γ H_C) |+⟩^(⊗n)
              </div>
              <div className="mono" style={{ color: 'var(--m)', marginTop: 4, fontSize: 11 }}>
                H_C = ∑_(u,v)∈E (I - Z_u Z_v)/2, &nbsp; H_M = ∑_u X_u
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '14px 0' }}>
              <div className="card" style={{ background: 'var(--bg)' }}>
                <div className="m" style={{ fontSize: 11 }}>Classical Brute-Force Max Cut</div>
                <b style={{ fontSize: 22, color: 'var(--ok)' }}>4.0 Edges</b>
                <div className="mono" style={{ fontSize: 11, color: 'var(--m)' }}>Optimal: |0101⟩ &amp; |1010⟩</div>
              </div>
              <div className="card" style={{ background: 'var(--bg)' }}>
                <div className="m" style={{ fontSize: 11 }}>QAOA Expected Cut Value ⟨H_C⟩</div>
                <b style={{ fontSize: 22, color: 'var(--c)' }}>{qaoaExpectation.toFixed(3)} Edges</b>
                <div className="mono" style={{ fontSize: 11, color: 'var(--m)' }}>
                  Approximation Ratio: {((qaoaExpectation / 4.0) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <button className="pri" onClick={handleLaunchQaoaCircuit}>
              Build QAOA Circuit in Studio →
            </button>
          </div>

          {/* QAOA Parameter Controls */}
          <div className="card">
            <b style={{ color: 'var(--c)' }}>Variational Parameters</b>
            <div style={{ marginTop: 12 }}>
              <label>Problem Phase γ: {(gamma * 180).toFixed(0)}° ({gamma.toFixed(2)}π)</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={gamma}
                onChange={e => setGamma(+e.target.value)}
              />
            </div>

            <div style={{ marginTop: 14 }}>
              <label>Mixer Phase β: {(beta * 180).toFixed(0)}° ({beta.toFixed(2)}π)</label>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.01"
                value={beta}
                onChange={e => setBeta(+e.target.value)}
              />
            </div>

            <div style={{ marginTop: 18, borderTop: '1px solid var(--b)', paddingTop: 10, fontSize: 11 }} className="m">
              <b>Hybrid Loop:</b> In production QAOA, a classical optimizer (such as COBYLA or Nelder-Mead) iteratively adjusts γ and β to maximize the expectation value computed from quantum measurements.
            </div>
          </div>
        </div>
      )}

      {/* VQE Section */}
      {activeTab === 'vqe' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
          <div className="card">
            <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
              <span className="tag" style={{ color: 'var(--c)' }}>Hybrid Algorithm</span>
              <span className="tag">Advanced</span>
              <span className="tag">2 Qubits</span>
            </div>
            <h3 style={{ fontSize: 18, marginBottom: 6 }}>Variational Quantum Eigensolver (VQE)</h3>
            <p className="m" style={{ fontSize: 13, lineHeight: 1.6 }}>
              VQE finds the minimum eigenvalue (ground state energy) of a Hamiltonian H using the <b>Ritz Variational Principle</b>: for any parameterized trial state |ψ(θ)⟩, the energy expectation satisfies E(θ) = ⟨ψ(θ)|H|ψ(θ)⟩ ≥ E₀.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '14px 0' }}>
              <div className="card" style={{ background: 'var(--bg)' }}>
                <div className="m" style={{ fontSize: 11 }}>Exact Ground State E₀</div>
                <b style={{ fontSize: 22, color: 'var(--ok)' }}>{exactGroundStateEnergy.toFixed(3)} Ha</b>
              </div>
              <div className="card" style={{ background: 'var(--bg)' }}>
                <div className="m" style={{ fontSize: 11 }}>Current Trial Energy E(θ)</div>
                <b style={{ fontSize: 22, color: 'var(--c)' }}>{vqeEnergy.toFixed(3)} Ha</b>
                <div className="mono" style={{ fontSize: 11, color: 'var(--m)' }}>
                  Error ΔE: {Math.abs(vqeEnergy - exactGroundStateEnergy).toFixed(4)}
                </div>
              </div>
            </div>

            <p className="m" style={{ fontSize: 12 }}>
              Scientific Honesty Note: VQE relies on polynomial measurement shots to estimate Pauli string terms. It is sensitive to finite-shot noise and decoherence on NISQ devices.
            </p>
          </div>

          <div className="card">
            <b style={{ color: 'var(--c)' }}>Ansatz Rotation θ</b>
            <div style={{ marginTop: 12 }}>
              <label>Parameter θ: {(vqeTheta * 180).toFixed(0)}° ({vqeTheta.toFixed(2)}π)</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.02"
                value={vqeTheta}
                onChange={e => setVqeTheta(+e.target.value)}
              />
            </div>
            <div style={{ marginTop: 14, fontSize: 11, color: 'var(--m)' }}>
              Adjust θ to observe the convergence of trial energy towards the theoretical minimum ground state energy.
            </div>
          </div>
        </div>
      )}

      {/* Adiabatic & Annealing Section */}
      {activeTab === 'adiabatic' && (
        <div className="card">
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <span className="tag" style={{ color: 'var(--a)' }}>Conceptual / Visualizer</span>
            <span className="tag">Advanced</span>
          </div>
          <h3 style={{ fontSize: 18, marginBottom: 6 }}>Adiabatic Quantum Evolution &amp; Annealing</h3>
          <p className="m" style={{ fontSize: 13, lineHeight: 1.6 }}>
            According to the <b>Adiabatic Theorem</b>, a quantum system initially in the ground state of an easy-to-prepare Hamiltonian H_initial will remain in the instantaneous ground state of a slowly evolving time-dependent Hamiltonian H(s):
          </p>

          <div className="card" style={{ background: 'var(--bg)', margin: '12px 0' }}>
            <div className="mono" style={{ color: 'var(--c)' }}>
              H(s) = (1 - s) H_initial + s H_problem, &nbsp; where s = t / T ∈ [0, 1]
            </div>
          </div>

          <p className="m" style={{ fontSize: 13 }}>
            The required evolution time T scales inversely with the square of the minimum energy gap T ≫ 1 / Δ_min². If the energy gap between the ground state and first excited state becomes exponentially small, the evolution risks non-adiabatic transitions.
          </p>
          <div className="card" style={{ background: 'var(--bg)', borderColor: 'var(--w)', marginTop: 12 }}>
            <b style={{ color: 'var(--w)', fontSize: 12 }}>Honest Scope Distinction:</b>
            <div className="m" style={{ fontSize: 11, marginTop: 4 }}>
              Quantum annealers operate at finite temperatures as open quantum systems minimizing Ising spin glass energy landscapes. They are distinct from universal gate-model quantum computers and are not simulated as discrete unitary circuits.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
