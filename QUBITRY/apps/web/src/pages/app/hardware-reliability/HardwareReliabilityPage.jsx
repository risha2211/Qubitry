import { useState } from 'react';

export default function HardwareReliabilityPage() {
  const [activeTab, setActiveTab] = useState('noise'); // 'noise' | 'qec' | 'topology'

  // Noise simulation state
  const [noiseModel, setNoiseModel] = useState('depolarizing');
  const [errorProb, setErrorProb] = useState(0.05);

  const fidelity = Math.max(0, 1 - errorProb * (noiseModel === 'depolarizing' ? 1.33 : 1.0));

  // QEC Syndrome simulation
  const [injectedQubitError, setInjectedQubitError] = useState(1);

  return (
    <div className="w">
      <div style={{ marginBottom: 16 }}>
        <h2>Hardware, Noise &amp; Reliability</h2>
        <p className="m" style={{ margin: '4px 0 0' }}>
          Explore physical decoherence channels, ideal vs noisy simulation, quantum error correction (QEC), and hardware topology routing.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
        <button
          className={activeTab === 'noise' ? 'on' : ''}
          onClick={() => setActiveTab('noise')}
        >
          Noise Channels &amp; Fidelity
        </button>
        <button
          className={activeTab === 'qec' ? 'on' : ''}
          onClick={() => setActiveTab('qec')}
        >
          Quantum Error Correction (3-Qubit Code)
        </button>
        <button
          className={activeTab === 'topology' ? 'on' : ''}
          onClick={() => setActiveTab('topology')}
        >
          Hardware Topology &amp; SWAP Routing
        </button>
      </div>

      {/* Noise Channels Tab */}
      {activeTab === 'noise' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
          <div className="card">
            <h3 style={{ fontSize: 16, marginBottom: 8 }}>Quantum Noise Channels &amp; Decoherence</h3>
            <p className="m" style={{ fontSize: 13, lineHeight: 1.6 }}>
              In real quantum processors, environmental interactions degrade quantum information. Open quantum systems are modeled by completely positive trace-preserving (CPTP) Kraus maps: ρ ↦ ∑_k E_k ρ E_k†.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '14px 0' }}>
              <div className="card" style={{ background: 'var(--bg)' }}>
                <div className="m" style={{ fontSize: 11 }}>Active Noise Model</div>
                <b style={{ fontSize: 18, color: 'var(--c)' }}>
                  {noiseModel === 'depolarizing' ? 'Depolarizing Channel' : noiseModel === 'bitflip' ? 'Bit-Flip (Pauli X)' : noiseModel === 'phaseflip' ? 'Phase-Flip (Pauli Z)' : 'Amplitude Damping (T₁)'}
                </b>
              </div>
              <div className="card" style={{ background: 'var(--bg)' }}>
                <div className="m" style={{ fontSize: 11 }}>State Fidelity F(ρ_ideal, ρ_noisy)</div>
                <b style={{ fontSize: 22, color: fidelity > 0.9 ? 'var(--ok)' : fidelity > 0.75 ? 'var(--w)' : 'var(--er)' }}>
                  {(fidelity * 100).toFixed(1)}%
                </b>
              </div>
            </div>

            <div className="m" style={{ fontSize: 12, lineHeight: 1.5 }}>
              <b>Channel Definition:</b>
              {noiseModel === 'depolarizing' && (
                <div className="mono" style={{ color: 'var(--t)', marginTop: 4 }}>
                  E(ρ) = (1 - p)ρ + (p/3)(XρX + YρY + ZρZ) — isotropic decoherence.
                </div>
              )}
              {noiseModel === 'bitflip' && (
                <div className="mono" style={{ color: 'var(--t)', marginTop: 4 }}>
                  E(ρ) = (1 - p)ρ + p XρX — models classical bit inversions.
                </div>
              )}
              {noiseModel === 'phaseflip' && (
                <div className="mono" style={{ color: 'var(--t)', marginTop: 4 }}>
                  E(ρ) = (1 - p)ρ + p ZρZ — loss of quantum relative phase (T₂ dephasing).
                </div>
              )}
              {noiseModel === 'amplitude-damping' && (
                <div className="mono" style={{ color: 'var(--t)', marginTop: 4 }}>
                  E₀ = [[1, 0], [0, √(1-p)]], E₁ = [[0, √p], [0, 0]] — spontaneous emission decay to |0⟩.
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <b style={{ color: 'var(--c)' }}>Channel Parameters</b>
            <div style={{ marginTop: 12 }}>
              <label>Select Channel Type:</label>
              <select
                value={noiseModel}
                onChange={e => setNoiseModel(e.target.value)}
                style={{ width: '100%', fontSize: 12 }}
              >
                <option value="depolarizing">Depolarizing Channel</option>
                <option value="bitflip">Bit-Flip Channel</option>
                <option value="phaseflip">Phase-Flip Channel</option>
                <option value="amplitude-damping">Amplitude Damping (T₁ decay)</option>
              </select>
            </div>

            <div style={{ marginTop: 14 }}>
              <label>Error Rate p: {(errorProb * 100).toFixed(1)}%</label>
              <input
                type="range"
                min="0"
                max="0.25"
                step="0.005"
                value={errorProb}
                onChange={e => setErrorProb(+e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* QEC Tab */}
      {activeTab === 'qec' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
          <div className="card">
            <h3 style={{ fontSize: 16, marginBottom: 8 }}>3-Qubit Bit-Flip Repetition Code</h3>
            <p className="m" style={{ fontSize: 13, lineHeight: 1.6 }}>
              Protects a single logical qubit |ψ⟩ = α|0⟩ + β|1⟩ against arbitrary single bit-flips by encoding into 3 physical qubits:
            </p>
            <div className="card mono" style={{ background: 'var(--bg)', margin: '10px 0', fontSize: 12 }}>
              <div>|0_L⟩ = |000⟩, &nbsp; |1_L⟩ = |111⟩</div>
            </div>
            <p className="m" style={{ fontSize: 12 }}>
              Two ancilla qubits measure parity syndromes s₁ = Z₀ Z₁ and s₂ = Z₁ Z₂ non-destructively without collapsing the superposed amplitudes α and β.
            </p>

            <div className="card" style={{ background: 'var(--bg)', marginTop: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--c)', marginBottom: 4 }}>Active Syndrome Measurement:</div>
              <div className="mono" style={{ fontSize: 12 }}>
                Syndrome (s₁, s₂) = {injectedQubitError === 0 ? '(1, 0) ⟹ Error on q0, apply X₀ correction' : injectedQubitError === 1 ? '(1, 1) ⟹ Error on q1, apply X₁ correction' : injectedQubitError === 2 ? '(0, 1) ⟹ Error on q2, apply X₂ correction' : '(0, 0) ⟹ No error detected'}
              </div>
              <div className="mono" style={{ color: 'var(--ok)', marginTop: 4, fontSize: 12 }}>
                State recovered with 100% fidelity: |ψ_L⟩ = α|000⟩ + β|111⟩
              </div>
            </div>
          </div>

          <div className="card">
            <b style={{ color: 'var(--c)' }}>Inject Bit-Flip Error</b>
            <div style={{ marginTop: 12 }}>
              <label>Select Error Location:</label>
              <select
                value={injectedQubitError}
                onChange={e => setInjectedQubitError(+e.target.value)}
                style={{ width: '100%', fontSize: 12 }}
              >
                <option value={-1}>No Error (clean)</option>
                <option value={0}>Bit-Flip on Qubit q0 (X₀ error)</option>
                <option value={1}>Bit-Flip on Qubit q1 (X₁ error)</option>
                <option value={2}>Bit-Flip on Qubit q2 (X₂ error)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Topology Tab */}
      {activeTab === 'topology' && (
        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>Hardware Topology &amp; SWAP Routing Overhead</h3>
          <p className="m" style={{ fontSize: 13, lineHeight: 1.6 }}>
            Physical superconducting quantum processors do not feature all-to-all qubit connectivity. Gates can only be executed between physically coupled adjacent qubits.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, margin: '14px 0' }}>
            <div className="card" style={{ background: 'var(--bg)' }}>
              <b style={{ color: 'var(--c)' }}>Linear Chain: q0 — q1 — q2 — q3</b>
              <div className="m" style={{ fontSize: 11, marginTop: 4 }}>
                A CNOT between q0 and q3 requires inserting 4 SWAP operations (cost: 12 CNOTs!), severely increasing circuit depth and gate error.
              </div>
            </div>
            <div className="card" style={{ background: 'var(--bg)' }}>
              <b style={{ color: 'var(--ok)' }}>Transpilation &amp; Routing</b>
              <div className="m" style={{ fontSize: 11, marginTop: 4 }}>
                Compilers (like Qiskit SABRE) solve the token swapping problem to minimize total inserted SWAP gates and preserve circuit fidelity.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
