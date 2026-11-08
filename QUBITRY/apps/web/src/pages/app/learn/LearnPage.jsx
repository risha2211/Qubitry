import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCircuit } from '../../../stores/CircuitContext.jsx';
import { nextId } from '@qubitry/quantum-core';

const MODULES = [
  {
    id: 'intro',
    title: '01. Qubits & Superposition',
    level: 'Beginner',
    summary: 'Classical bits vs quantum bits, physical state representation, and the superposition principle.',
    content: (
      <div>
        <p>A classical bit is strictly deterministic, restricted to either <b>0</b> or <b>1</b>. A <b>qubit</b> (quantum bit) is a two-level quantum mechanical system whose state vector |ψ⟩ resides in a two-dimensional complex Hilbert space ℂ².</p>
        <div className="card" style={{ background: 'var(--bg)', margin: '12px 0' }}>
          <div className="mono" style={{ fontSize: 13, color: 'var(--c)' }}>
            |ψ⟩ = α|0⟩ + β|1⟩, &nbsp; where α, β ∈ ℂ &nbsp; and &nbsp; |α|² + |β|² = 1
          </div>
        </div>
        <p>The coefficients <b>α</b> and <b>β</b> are <i>probability amplitudes</i>. According to the <b>Born rule</b>, upon measurement in the computational basis &#123;|0⟩, |1⟩&#125;:</p>
        <ul>
          <li>The probability of observing outcome 0 is P(0) = |α|²</li>
          <li>The probability of observing outcome 1 is P(1) = |β|²</li>
        </ul>
        <p className="m" style={{ fontSize: 12 }}>Key takeaway: Superposition does NOT mean the qubit is secretly 0 and 1 at the same time in a classical sense; rather, it possesses definite probability amplitudes capable of quantum interference.</p>
      </div>
    )
  },
  {
    id: 'math',
    title: '02. Dirac Notation & Mathematics',
    level: 'Beginner',
    summary: 'Bra-ket notation, state vectors, inner products, and orthonormal basis vectors.',
    content: (
      <div>
        <p>Quantum mechanics uses <b>Dirac notation</b> (bra-ket notation) invented by Paul Dirac:</p>
        <ul>
          <li><b>Ket |ψ⟩</b>: Column vector representing a quantum state vector:
            <pre className="mono" style={{ margin: '4px 0', fontSize: 11 }}>
              |0⟩ = [1, 0]ᵀ, &nbsp; |1⟩ = [0, 1]ᵀ
            </pre>
          </li>
          <li><b>Bra ⟨ψ|</b>: Conjugate transpose (Hermitian adjoint) row vector ⟨ψ| = (|ψ⟩)†.</li>
          <li><b>Inner Product ⟨ϕ|ψ⟩</b>: Complex scalar measuring state overlap. For orthonormal basis states: ⟨0|0⟩ = 1, ⟨1|1⟩ = 1, ⟨0|1⟩ = 0.</li>
          <li><b>Outer Product |ϕ⟩⟨ψ|</b>: Linear operator / matrix. The density operator for a pure state is ρ = |ψ⟩⟨ψ|.</li>
        </ul>
      </div>
    )
  },
  {
    id: 'gates',
    title: '03. Quantum Gates & Unitary Evolution',
    level: 'Intermediate',
    summary: 'Reversible quantum transformations, unitarity U†U = I, and single-qubit rotations.',
    content: (
      <div>
        <p>Isolated quantum systems evolve via <b>unitary linear transformations</b>. A matrix U is unitary if its conjugate transpose equals its inverse:</p>
        <div className="mono" style={{ color: 'var(--c)', margin: '8px 0' }}>U† U = U U† = I  ⟹  ⟨Uψ|Uψ⟩ = ⟨ψ|ψ⟩ = 1 (norm preservation)</div>
        <p>Because unitary operations are norm-preserving, all quantum logic gates (apart from measurement) are strictly <b>reversible</b>.</p>
        <div className="card" style={{ background: 'var(--bg)', marginTop: 10 }}>
          <b style={{ fontSize: 12, color: 'var(--c)' }}>Common Single-Qubit Matrices:</b>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 6, fontSize: 11 }} className="mono">
            <div>H = 1/√2 [[1, 1], [1, -1]]</div>
            <div>X = [[0, 1], [1, 0]]</div>
            <div>Y = [[0, -i], [i, 0]]</div>
            <div>Z = [[1, 0], [0, -1]]</div>
            <div>S = [[1, 0], [0, i]]</div>
            <div>T = [[1, 0], [0, e^(iπ/4)]]</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'entanglement',
    title: '04. Entanglement & Bell States',
    level: 'Intermediate',
    summary: 'Multi-qubit tensor product spaces, non-separable states, Bell pairs, and partial trace.',
    content: (
      <div>
        <p>When combining multiple quantum registers, the composite state space is the <b>tensor product</b> H_A ⊗ H_B. For two qubits, basis states are |00⟩, |01⟩, |10⟩, |11⟩.</p>
        <p>A state is <b>entangled</b> if it cannot be factored as a product state |ψ_A⟩ ⊗ |ψ_B⟩. The four canonical maximally entangled Bell states are:</p>
        <div className="card mono" style={{ background: 'var(--bg)', margin: '8px 0', fontSize: 12 }}>
          <div>|Φ⁺⟩ = (|00⟩ + |11⟩) / √2</div>
          <div>|Φ⁻⟩ = (|00⟩ - |11⟩) / √2</div>
          <div>|Ψ⁺⟩ = (|01⟩ + |10⟩) / √2</div>
          <div>|Ψ⁻⟩ = (|01⟩ - |10⟩) / √2</div>
        </div>
        <p><b>Subsystem Entanglement:</b> An individual qubit belonging to an entangled pair does not have a pure statevector; its state is mixed, obtained by taking the <i>partial trace</i> ρ_A = Tr_B(ρ_AB). For a Bell state, ρ_A = 0.5 I with von Neumann entropy S(ρ_A) = 1.0 bit.</p>
      </div>
    )
  },
  {
    id: 'measurement',
    title: '05. Measurement & State Collapse',
    level: 'Intermediate',
    summary: 'Projective measurement, state collapse, mid-circuit measurement, and decoherence.',
    content: (
      <div>
        <p>Measurement in quantum computing is fundamentally non-unitary. A projective measurement in the computational basis applies projectors P₀ = |0⟩⟨0| and P₁ = |1⟩⟨1|.</p>
        <p>Upon obtaining outcome m ∈ &#123;0, 1&#125;, the statevector instantly collapses to the corresponding subspace:</p>
        <div className="mono" style={{ color: 'var(--c)', margin: '8px 0' }}>
          |ψ⟩ ↦ P_m|ψ⟩ / √⟨ψ|P_m|ψ⟩
        </div>
        <p>Measuring a qubit destroys quantum coherence between branches of superposition. Consequently, measurement placement in a circuit is position-sensitive and critical to interference.</p>
      </div>
    )
  }
];

export default function LearnPage() {
  const nav = useNavigate();
  const { setCirc } = useCircuit();
  const [activeModule, setActiveModule] = useState(MODULES[0]);

  // Guided first circuit workflow action
  const handleLaunchGuidedCircuit = () => {
    setCirc({
      n: 1,
      note: {
        name: 'Guided First Experiment: 1-Qubit Hadamard Superposition',
        description: 'Guided First Experiment: 1. Qubit starts in ground state |0⟩. 2. H gate creates equal superposition (|0⟩+|1⟩)/√2. 3. Measurement samples outcomes.',
        expected: 'P(|0⟩) = 50%, P(|1⟩) = 50% across shots.',
        type: 'Circuit Simulation',
        level: 'Beginner'
      },
      ops: [
        { g: 'H', q: [0], s: 0, id: nextId() },
        { g: 'M', q: [0], s: 1, id: nextId() }
      ]
    });
    nav('/studio');
  };

  return (
    <div className="w">
      <div style={{ marginBottom: 16 }}>
        <h2>Learn Quantum Computing</h2>
        <p className="m" style={{ margin: '4px 0 0' }}>
          Structured academic learning pathway based on the Semester V Quantum Computing curriculum.
        </p>
      </div>

      {/* Guided First Experiment Banner */}
      <div className="card" style={{ marginBottom: 20, borderColor: 'var(--c)', background: 'rgba(17, 23, 34, 0.95)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h3 style={{ margin: '4px 0', fontSize: 16 }}>Guided First Experiment: Prepare |0⟩, Apply H, Measure &amp; Run</h3>
            <p className="m" style={{ fontSize: 12, margin: 0 }}>
              Hands-on 1-qubit circuit demonstration verifying superposition and 50/50 measurement statistics in Circuit Studio.
            </p>
          </div>
          <button className="pri" onClick={handleLaunchGuidedCircuit}>
            Launch First Experiment →
          </button>
        </div>
      </div>

      {/* Main Layout: Module Selector on Left, Lesson Content on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16 }}>
        {/* Module Sidebar */}
        <div>
          <div className="card" style={{ padding: 8 }}>
            <div style={{ fontSize: 11, color: 'var(--m)', padding: '4px 6px', letterSpacing: '0.05em' }}>
              CURRICULUM LESSONS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
              {MODULES.map(m => (
                <button
                  key={m.id}
                  className={activeModule.id === m.id ? 'on' : ''}
                  onClick={() => setActiveModule(m)}
                  style={{
                    textAlign: 'left',
                    padding: '8px 10px',
                    fontSize: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{m.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--m)' }}>{m.level}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lesson Body */}
        <div>
          <div className="card" style={{ minHeight: 400 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, borderBottom: '1px solid var(--b)', paddingBottom: 8 }}>
              <h3 style={{ fontSize: 18, color: 'var(--c)' }}>{activeModule.title}</h3>
              <span className="tag">{activeModule.level}</span>
            </div>
            <div style={{ color: 'var(--t)', fontSize: 14, lineHeight: 1.7 }}>
              {activeModule.content}
            </div>

            <div style={{ marginTop: 24, paddingTop: 14, borderTop: '1px solid var(--b)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="m" style={{ fontSize: 12 }}>
                Want to test this in the simulator?
              </span>
              <button onClick={() => nav('/studio')} style={{ fontSize: 12 }}>
                Open Circuit Studio →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
