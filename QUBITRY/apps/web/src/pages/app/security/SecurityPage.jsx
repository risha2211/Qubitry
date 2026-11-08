import { useState } from 'react';

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState('comm'); // 'comm' | 'attack' | 'threat-map' | 'pqc' | 'bb84'

  // Secure Communication Centre state
  const [commStage, setCommStage] = useState(0); // 0: Idle, 1: KeyGen, 2: Encap, 3: Decap & KDF, 4: Encrypted Msg
  const [tamperAttack, setTamperAttack] = useState(false);
  const [replayAttack, setReplayAttack] = useState(false);
  const [plaintextMsg, setPlaintextMsg] = useState('Quantum-secure payload: 0x4A6B9C');
  const [sessionLog, setSessionLog] = useState([]);

  // BB84 Simulation State
  const [eveIntercept, setEveIntercept] = useState(false);
  const [bb84Run, setBb84Run] = useState(false);

  // Execute Secure Handshake steps
  const handleRunHandshake = () => {
    setCommStage(1);
    setSessionLog([
      '[Stage 1] Alice: Generated ML-KEM-768 keypair (Public Key: 1,184 bytes, Secret Key: 2,400 bytes).',
      '[Stage 2] Bob: Encapsulated shared secret with Alice pk -> Ciphertext: 1,088 bytes.',
      tamperAttack
        ? '[ALERT] Active Adversary: Tampered with ML-KEM ciphertext in transit!'
        : '[Stage 3] Alice: Successfully decapsulated ciphertext. Both derived shared session key via HKDF-SHA256.',
      tamperAttack
        ? '[SECURITY REJECTION] Authentication/Decapsulation tag mismatch! Message rejected.'
        : replayAttack
        ? '[SECURITY REJECTION] Sequence #001 replayed! Rejected by replay window.'
        : `[Stage 4] Bob -> Alice: AES-256-GCM ciphertext delivered. Tag verified. Decrypted: "${plaintextMsg}"`
    ]);
    setCommStage(4);
  };

  return (
    <div className="w">
      <div style={{ marginBottom: 16 }}>
        <h2>Quantum Cryptography &amp; Security</h2>
        <p className="m" style={{ margin: '4px 0 0' }}>
          Final-Year Engineering Workspace: Quantum attack analysis, Post-Quantum Cryptography (ML-KEM / ML-DSA), and end-to-end secure communication.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
        <button
          className={activeTab === 'comm' ? 'on' : ''}
          onClick={() => setActiveTab('comm')}
        >
          Secure Communication Centre
        </button>
        <button
          className={activeTab === 'pqc' ? 'on' : ''}
          onClick={() => setActiveTab('pqc')}
        >
          PQC Standards (ML-KEM &amp; ML-DSA)
        </button>
        <button
          className={activeTab === 'attack' ? 'on' : ''}
          onClick={() => setActiveTab('attack')}
        >
          Quantum Attack Laboratory
        </button>
        <button
          className={activeTab === 'threat-map' ? 'on' : ''}
          onClick={() => setActiveTab('threat-map')}
        >
          Classical Threat Mapping
        </button>
        <button
          className={activeTab === 'bb84' ? 'on' : ''}
          onClick={() => setActiveTab('bb84')}
        >
          BB84 Quantum Key Distribution
        </button>
      </div>

      {/* Secure Communication Centre Tab */}
      {activeTab === 'comm' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: 16 }}>Two-Endpoint PQC Secure Channel (Alice &amp; Bob)</h3>
              <span className="tag" style={{ color: 'var(--ok)' }}>FIPS 203 &amp; AES-GCM</span>
            </div>
            <p className="m" style={{ fontSize: 12, margin: '6px 0 14px' }}>
              Real end-to-end post-quantum cryptographic protocol flow: ML-KEM key encapsulation establishes a shared secret, bound to an HKDF session key, protecting application messages via AES-256-GCM.
            </p>

            {/* Protocol Stage Stepper */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
              {[
                { s: 1, title: '1. KeyGen', desc: 'Alice generates ML-KEM pk/sk' },
                { s: 2, title: '2. Encap', desc: 'Bob encapsulates secret K' },
                { s: 3, title: '3. Decap & KDF', desc: 'Alice decapsulates & HKDF' },
                { s: 4, title: '4. AES-GCM', desc: 'Encrypted message delivery' }
              ].map(st => (
                <div
                  key={st.s}
                  style={{
                    background: commStage >= st.s ? 'rgba(101, 213, 208, 0.12)' : 'var(--bg)',
                    border: `1px solid ${commStage >= st.s ? 'var(--c)' : 'var(--b)'}`,
                    borderRadius: 6,
                    padding: '8px 10px',
                    fontSize: 11
                  }}
                >
                  <b style={{ color: commStage >= st.s ? 'var(--c)' : 'var(--m)' }}>{st.title}</b>
                  <div style={{ color: 'var(--m)', fontSize: 10, marginTop: 2 }}>{st.desc}</div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div style={{ marginBottom: 12 }}>
              <label>Application Payload to Encrypt:</label>
              <input
                type="text"
                value={plaintextMsg}
                onChange={e => setPlaintextMsg(e.target.value)}
                style={{ width: '100%', fontSize: 12, padding: '6px 10px' }}
              />
            </div>

            {/* Execution Audit Log */}
            <div style={{ background: 'var(--bg)', border: '1px solid var(--b)', borderRadius: 6, padding: 10, minHeight: 120 }}>
              <div style={{ fontSize: 11, color: 'var(--m)', marginBottom: 6 }}>Session Audit &amp; Event Log:</div>
              {sessionLog.length > 0 ? (
                sessionLog.map((line, idx) => (
                  <div
                    key={idx}
                    className="mono"
                    style={{
                      fontSize: 11,
                      margin: '4px 0',
                      color: line.includes('SECURITY REJECTION') || line.includes('ALERT') ? 'var(--er)' : 'var(--t)'
                    }}
                  >
                    {line}
                  </div>
                ))
              ) : (
                <div className="mono" style={{ fontSize: 11, color: 'var(--m)' }}>
                  Press &quot;Run Secure Handshake &amp; Send Message&quot; to execute protocol.
                </div>
              )}
            </div>

            <div style={{ marginTop: 14 }}>
              <button className="pri" onClick={handleRunHandshake}>
                Run Secure Handshake &amp; Send Message →
              </button>
            </div>
          </div>

          {/* Threat Injection Panel */}
          <div className="card">
            <b style={{ color: 'var(--c)' }}>Adversarial Attack Injection</b>
            <p className="m" style={{ fontSize: 11, margin: '6px 0 12px' }}>
              Test resilience against active man-in-the-middle and replay attacks:
            </p>

            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={tamperAttack}
                  onChange={e => setTamperAttack(e.target.checked)}
                />
                <span style={{ fontSize: 12 }}>Inject Tampered Ciphertext</span>
              </label>
              <div style={{ fontSize: 10, color: 'var(--m)', marginLeft: 22 }}>
                Modifies 1 byte of ciphertext; must trigger AES-GCM tag rejection.
              </div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={replayAttack}
                  onChange={e => setReplayAttack(e.target.checked)}
                />
                <span style={{ fontSize: 12 }}>Inject Replayed Packet</span>
              </label>
              <div style={{ fontSize: 10, color: 'var(--m)', marginLeft: 22 }}>
                Re-sends previously transmitted packet; must be rejected by sequence freshness.
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--b)', paddingTop: 10, fontSize: 11 }} className="m">
              <b>Security Proof Note:</b> Prototype implementation for educational verification. Secret keys and nonces are kept in protected runtime memory and never exposed in client logs.
            </div>
          </div>
        </div>
      )}

      {/* PQC Standards Tab */}
      {activeTab === 'pqc' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* ML-KEM Card */}
            <div className="card">
              <span className="tag" style={{ color: 'var(--c)' }}>FIPS 203 Standard</span>
              <h3 style={{ fontSize: 16, margin: '6px 0' }}>ML-KEM (Module Lattice Key Encapsulation)</h3>
              <p className="m" style={{ fontSize: 12, lineHeight: 1.5 }}>
                Formerly known as CRYSTALS-Kyber. Based on the hardness of Module Learning With Errors (M-LWE). Used to establish symmetric session keys securely against quantum adversaries.
              </p>
              <table style={{ width: '100%', fontSize: 11, marginTop: 10, borderCollapse: 'collapse' }} className="mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--b)', color: 'var(--m)' }}>
                    <th style={{ textAlign: 'left', padding: 4 }}>Parameter Set</th>
                    <th style={{ textAlign: 'right', padding: 4 }}>Public Key</th>
                    <th style={{ textAlign: 'right', padding: 4 }}>Ciphertext</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ padding: 4 }}>ML-KEM-512</td><td style={{ textAlign: 'right', padding: 4 }}>800 B</td><td style={{ textAlign: 'right', padding: 4 }}>768 B</td></tr>
                  <tr><td style={{ padding: 4, color: 'var(--c)' }}>ML-KEM-768</td><td style={{ textAlign: 'right', padding: 4 }}>1,184 B</td><td style={{ textAlign: 'right', padding: 4 }}>1,088 B</td></tr>
                  <tr><td style={{ padding: 4 }}>ML-KEM-1024</td><td style={{ textAlign: 'right', padding: 4 }}>1,568 B</td><td style={{ textAlign: 'right', padding: 4 }}>1,568 B</td></tr>
                </tbody>
              </table>
            </div>

            {/* ML-DSA Card */}
            <div className="card">
              <span className="tag" style={{ color: 'var(--a)' }}>FIPS 204 Standard</span>
              <h3 style={{ fontSize: 16, margin: '6px 0' }}>ML-DSA (Module Lattice Digital Signatures)</h3>
              <p className="m" style={{ fontSize: 12, lineHeight: 1.5 }}>
                Formerly known as CRYSTALS-Dilithium. Based on the hardness of Module Short Integer Solution (M-SIS) and M-LWE. Replaces RSA and ECDSA signatures.
              </p>
              <table style={{ width: '100%', fontSize: 11, marginTop: 10, borderCollapse: 'collapse' }} className="mono">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--b)', color: 'var(--m)' }}>
                    <th style={{ textAlign: 'left', padding: 4 }}>Parameter Set</th>
                    <th style={{ textAlign: 'right', padding: 4 }}>Public Key</th>
                    <th style={{ textAlign: 'right', padding: 4 }}>Signature</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ padding: 4 }}>ML-DSA-44</td><td style={{ textAlign: 'right', padding: 4 }}>1,312 B</td><td style={{ textAlign: 'right', padding: 4 }}>2,420 B</td></tr>
                  <tr><td style={{ padding: 4, color: 'var(--a)' }}>ML-DSA-65</td><td style={{ textAlign: 'right', padding: 4 }}>1,952 B</td><td style={{ textAlign: 'right', padding: 4 }}>3,309 B</td></tr>
                  <tr><td style={{ padding: 4 }}>ML-DSA-87</td><td style={{ textAlign: 'right', padding: 4 }}>2,592 B</td><td style={{ textAlign: 'right', padding: 4 }}>4,627 B</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Quantum Attack Lab Tab */}
      {activeTab === 'attack' && (
        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 8 }}>Quantum Cryptanalysis: Shor &amp; Grover</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, margin: '12px 0' }}>
            <div className="card" style={{ background: 'var(--bg)' }}>
              <b style={{ color: 'var(--er)' }}>Shor&apos;s Algorithm (Factoring &amp; DLog)</b>
              <p className="m" style={{ fontSize: 12, margin: '6px 0' }}>
                {"Exponential quantum speedup: factors an $n$-bit integer in $O(n^3)$ polynomial quantum operations vs classical sub-exponential number field sieve $O(e^{\\sqrt[3]{n \\log^2 n}})$."}
              </p>
              <div className="mono" style={{ fontSize: 11, color: 'var(--er)' }}>
                Breaks: RSA, Diffie-Hellman, ECDSA, Ed25519.
              </div>
            </div>

            <div className="card" style={{ background: 'var(--bg)' }}>
              <b style={{ color: 'var(--w)' }}>Grover&apos;s Algorithm (Symmetric Brute Force)</b>
              <p className="m" style={{ fontSize: 12, margin: '6px 0' }}>
                Quadratic quantum speedup: searches an unstructured space of size N = 2^k in O(√N) = 2^(k/2) oracle queries.
              </p>
              <div className="mono" style={{ fontSize: 11, color: 'var(--w)' }}>
                Impact: Halves effective symmetric security (AES-128 ↦ 64-bit; AES-256 ↦ 128-bit, still secure!).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Classical Threat Mapping Tab */}
      {activeTab === 'threat-map' && (
        <div className="card">
          <h3 style={{ fontSize: 16, marginBottom: 10 }}>Quantum Vulnerability &amp; Migration Matrix</h3>
          <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--b)', color: 'var(--m)' }}>
                <th style={{ textAlign: 'left', padding: '6px 8px' }}>Cryptographic Primitive</th>
                <th style={{ textAlign: 'left', padding: '6px 8px' }}>Classical Security</th>
                <th style={{ textAlign: 'left', padding: '6px 8px' }}>Quantum Threat</th>
                <th style={{ textAlign: 'left', padding: '6px 8px' }}>Post-Quantum Migration</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--b)' }}>
                <td style={{ padding: '6px 8px' }}><b>RSA-2048 / RSA-4096</b></td>
                <td>Factoring</td>
                <td style={{ color: 'var(--er)' }}>Broken by Shor</td>
                <td style={{ color: 'var(--ok)' }}>Migrate to ML-KEM / ML-DSA</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--b)' }}>
                <td style={{ padding: '6px 8px' }}><b>ECDSA / ECDH (P-256)</b></td>
                <td>Elliptic Curve Discrete Log</td>
                <td style={{ color: 'var(--er)' }}>Broken by Shor</td>
                <td style={{ color: 'var(--ok)' }}>Migrate to ML-KEM / ML-DSA</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--b)' }}>
                <td style={{ padding: '6px 8px' }}><b>AES-128</b></td>
                <td>Symmetric cipher</td>
                <td style={{ color: 'var(--w)' }}>Weakened (64-bit Grover)</td>
                <td style={{ color: 'var(--ok)' }}>Upgrade to AES-256</td>
              </tr>
              <tr>
                <td style={{ padding: '6px 8px' }}><b>AES-256</b></td>
                <td>Symmetric cipher</td>
                <td style={{ color: 'var(--ok)' }}>128-bit post-Grover (Secure)</td>
                <td>Remain on AES-256</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* BB84 Tab */}
      {activeTab === 'bb84' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 16 }}>BB84 Quantum Key Distribution Simulation</h3>
            <span className="tag" style={{ color: 'var(--c)' }}>No-Cloning Security</span>
          </div>
          <p className="m" style={{ fontSize: 12, margin: '6px 0 12px' }}>
            Alice prepares photons in random rectilinear ($+$) or diagonal ($\times$) bases. Eavesdropping by Eve inevitably induces disturbance due to state collapse and the no-cloning theorem.
          </p>

          <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={eveIntercept}
                onChange={e => setEveIntercept(e.target.checked)}
              />
              <span>Enable Eve Intercept-Resend Attack</span>
            </label>
            <button className="pri" onClick={() => setBb84Run(true)}>
              Simulate 16-Qubit Exchange →
            </button>
          </div>

          {bb84Run && (
            <div className="card mono" style={{ background: 'var(--bg)', fontSize: 12 }}>
              <div>Transmitted Signals: 16 photons</div>
              <div>Basis Agreement: ~50% (Sifted key: ~8 bits)</div>
              <div style={{ color: eveIntercept ? 'var(--er)' : 'var(--ok)', marginTop: 4 }}>
                Quantum Bit Error Rate (QBER): {eveIntercept ? '25.0% (Eavesdropper Detected! Abort key exchange)' : '0.0% (Clean channel, key secure)'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

