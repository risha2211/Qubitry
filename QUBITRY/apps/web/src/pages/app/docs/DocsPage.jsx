import { useState } from 'react';
import { GATES, matrix } from '@qubitry/quantum-core';

export default function DocsPage() {
  const [selectedGate, setSelectedGate] = useState('H');

  const scrollTo = id => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getMatrixDisplay = g => {
    try {
      const meta = GATES[g];
      if (!meta) return null;

      if (meta.k === 1 && g !== 'M' && g !== 'Reset') {
        const m = matrix(g, Math.PI / 4);
        const f = (r, i) => `${r.toFixed(3)}${i >= 0 ? '+' : ''}${i.toFixed(3)}i`;
        return `[[ ${f(m[0], m[1])},  ${f(m[2], m[3])} ],\n [ ${f(m[4], m[5])},  ${f(m[6], m[7])} ]]`;
      }

      if (g === 'CX') {
        return `Controlled-NOT Unitary Matrix (4×4):\n[[ 1, 0, 0, 0 ],\n [ 0, 1, 0, 0 ],\n [ 0, 0, 0, 1 ],\n [ 0, 0, 1, 0 ]]`;
      }
      if (g === 'CY') {
        return `Controlled-Y Unitary Matrix (4×4):\n[[ 1, 0, 0, 0 ],\n [ 0, 1, 0, 0 ],\n [ 0, 0, 0,-i ],\n [ 0, 0, i, 0 ]]`;
      }
      if (g === 'CZ') {
        return `Controlled-Z Unitary Matrix (4×4):\n[[ 1, 0, 0, 0 ],\n [ 0, 1, 0, 0 ],\n [ 0, 0, 1, 0 ],\n [ 0, 0, 0,-1 ]]`;
      }
      if (g === 'CP') {
        return `Controlled-Phase P(φ) Matrix (4×4):\n[[ 1, 0, 0, 0 ],\n [ 0, 1, 0, 0 ],\n [ 0, 0, 1, 0 ],\n [ 0, 0, 0, e^{iφ} ]]`;
      }
      if (g === 'CRZ') {
        return `Controlled-RZ(θ) Matrix (4×4):\n[[ 1, 0, 0, 0 ],\n [ 0, 1, 0, 0 ],\n [ 0, 0, e^{-iθ/2}, 0 ],\n [ 0, 0, 0, e^{iθ/2} ]]`;
      }
      if (g === 'SWAP') {
        return `SWAP Unitary Matrix (4×4):\n[[ 1, 0, 0, 0 ],\n [ 0, 0, 1, 0 ],\n [ 0, 1, 0, 0 ],\n [ 0, 0, 0, 1 ]]`;
      }
      if (g === 'CCX') {
        return `Toffoli CCX Permutation Matrix (8×8):\nMaps |110⟩ ↔ |111⟩ and acts as identity on all other 6 basis states.`;
      }
      if (g === 'CSWAP') {
        return `Fredkin CSWAP Matrix (8×8):\nSwaps target qubits q1 and q2 if and only if control qubit q0 = |1⟩.`;
      }
      if (g === 'M') {
        return `Projective Computational Basis Measurement:\nP(0) = |⟨0|ψ⟩|²,  P(1) = |⟨1|ψ⟩|²\nCollapses superposition non-unitarily into classical bit.`;
      }
      if (g === 'Reset') {
        return `Quantum Reset Channel:\nNon-unitary reset projecting qubit back to ground state |0⟩.`;
      }
    } catch {
      return null;
    }
    return null;
  };

  return (
    <div className="w">
      <div style={{ marginBottom: 16 }}>
        <h2>Qubitry Documentation &amp; Reference</h2>
        <p className="m" style={{ margin: '4px 0 0' }}>
          Mathematical conventions, simulator specifications, gate dictionary, and curriculum guides.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16 }}>
        {/* Navigation Sidebar */}
        <div className="card" style={{ padding: 8, height: 'fit-content' }}>
          <div style={{ fontSize: 11, color: 'var(--m)', padding: '4px 6px', letterSpacing: '0.05em' }}>
            TOPICS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
            <button
              onClick={() => scrollTo('conventions')}
              className="tag"
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 8px', fontSize: 12, background: 'transparent', cursor: 'pointer', border: '1px solid var(--b)' }}
            >
              1. Mathematical Conventions
            </button>
            <button
              onClick={() => scrollTo('gates')}
              className="tag"
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 8px', fontSize: 12, background: 'transparent', cursor: 'pointer', border: '1px solid var(--b)' }}
            >
              2. Gate Dictionary &amp; Matrices
            </button>
            <button
              onClick={() => scrollTo('simulator')}
              className="tag"
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 8px', fontSize: 12, background: 'transparent', cursor: 'pointer', border: '1px solid var(--b)' }}
            >
              3. Simulator Architecture &amp; Limits
            </button>
            <button
              onClick={() => scrollTo('glossary')}
              className="tag"
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 8px', fontSize: 12, background: 'transparent', cursor: 'pointer', border: '1px solid var(--b)' }}
            >
              4. Quantum Glossary
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Conventions */}
          <div id="conventions" className="card">
            <h3 style={{ fontSize: 16, color: 'var(--c)', marginBottom: 8 }}>1. Mathematical &amp; Simulator Conventions</h3>
            <ul style={{ fontSize: 13, lineHeight: 1.6, paddingLeft: 18 }}>
              <li><b>Qubit Indexing &amp; Endianness:</b> Wires are indexed from q₀ (top wire) to q_(n-1) (bottom wire). In standard computational basis bitstrings |b_(n-1)...b₁b₀⟩, q₀ corresponds to the <i>least significant bit</i> (rightmost). Integer basis index i = Σ b_k · 2^k.</li>
              <li><b>Hilbert Space Dimension:</b> An n-qubit quantum register spans an exact statevector of dimension N = 2^n complex numbers (stored as 64-bit IEEE double-precision floats).</li>
              <li><b>Normalisation:</b> Total probability Σ |c_i|² = 1.0 is maintained unitarily across all gate operations.</li>
              <li><b>Phase Convention:</b> Rotations are defined as R_X(θ) = exp(-i(θ/2)X), R_Y(θ) = exp(-i(θ/2)Y), R_Z(θ) = exp(-i(θ/2)Z).</li>
            </ul>
          </div>

          {/* Gate Dictionary */}
          <div id="gates" className="card">
            <h3 style={{ fontSize: 16, color: 'var(--c)', marginBottom: 8 }}>2. Interactive Gate Dictionary &amp; Matrix Inspector</h3>
            <p className="m" style={{ fontSize: 12, marginBottom: 12 }}>
              Select any quantum logic gate to inspect its exact unitary matrix, number of qubits, and algebraic transformation:
            </p>

            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
              {Object.keys(GATES).map(g => (
                <button
                  key={g}
                  className={selectedGate === g ? 'on' : ''}
                  onClick={() => setSelectedGate(g)}
                  style={{ fontSize: 12, padding: '4px 8px', fontFamily: 'JetBrains Mono' }}
                >
                  {g}
                </button>
              ))}
            </div>

            <div className="card" style={{ background: 'var(--bg)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <b style={{ color: 'var(--c)', fontSize: 14 }}>{GATES[selectedGate]?.name || selectedGate}</b>
                <span className="tag">{GATES[selectedGate]?.k} Qubit{GATES[selectedGate]?.k > 1 ? 's' : ''}</span>
              </div>
              <div className="m" style={{ fontSize: 12, margin: '6px 0' }}>
                {GATES[selectedGate]?.desc}
              </div>

              {/* Matrix or transformation representation */}
              {getMatrixDisplay(selectedGate) && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 11, color: 'var(--m)', marginBottom: 2 }}>Algebraic &amp; Matrix Representation:</div>
                  <pre className="mono" style={{ fontSize: 11, padding: '6px 10px', whiteSpace: 'pre-wrap' }}>
                    {getMatrixDisplay(selectedGate)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Simulator Architecture */}
          <div id="simulator" className="card">
            <h3 style={{ fontSize: 16, color: 'var(--c)', marginBottom: 8 }}>3. Simulator Engine &amp; Limitations</h3>
            <p className="m" style={{ fontSize: 13, lineHeight: 1.6 }}>
              Qubitry’s execution engine is an exact noiseless statevector simulator written in pure JavaScript, running client-side with zero external telemetry.
            </p>
            <ul style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--m)' }}>
              <li><b>Safe Qubit Limit:</b> 6 qubits (2⁶ = 64 amplitudes). Higher qubit counts scale exponentially (O(2ⁿ) in memory and runtime).</li>
              <li><b>Linear Complexity:</b> Each single-qubit gate evaluates 2^(n-1) complex pairwise updates.</li>
              <li><b>Scientific Integrity:</b> The simulator never replaces an exact quantum calculation with an undocumented classical shortcut.</li>
            </ul>
          </div>

          {/* Quantum Glossary */}
          <div id="glossary" className="card">
            <h3 style={{ fontSize: 16, color: 'var(--c)', marginBottom: 8 }}>4. Quantum Computing Glossary</h3>
            <p className="m" style={{ fontSize: 12, marginBottom: 12 }}>
              Essential concepts and theoretical definitions for quantum information and algorithms:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
              <div className="card" style={{ background: 'var(--bg)' }}>
                <b style={{ color: 'var(--a)' }}>Superposition</b>
                <div className="m" style={{ fontSize: 12, marginTop: 4 }}>
                  A linear combination |ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1.
                </div>
              </div>
              <div className="card" style={{ background: 'var(--bg)' }}>
                <b style={{ color: 'var(--ok)' }}>Entanglement</b>
                <div className="m" style={{ fontSize: 12, marginTop: 4 }}>
                  Composite states that cannot be factored as |ψ_A⟩ ⊗ |ψ_B⟩.
                </div>
              </div>
              <div className="card" style={{ background: 'var(--bg)' }}>
                <b style={{ color: 'var(--c)' }}>Bloch Sphere</b>
                <div className="m" style={{ fontSize: 12, marginTop: 4 }}>
                  Geometric visualization mapping any 2-level quantum state to the surface of S².
                </div>
              </div>
              <div className="card" style={{ background: 'var(--bg)' }}>
                <b style={{ color: 'var(--w)' }}>Density Matrix &amp; Purity</b>
                <div className="m" style={{ fontSize: 12, marginTop: 4 }}>
                  ρ = ∑ p_i |ψ_i⟩⟨ψ_i|. State purity γ = Tr(ρ²) = 1 for pure, &lt; 1 for mixed states.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
