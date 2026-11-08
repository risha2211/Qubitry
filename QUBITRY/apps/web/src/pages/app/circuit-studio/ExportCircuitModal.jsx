import { useState, useMemo } from 'react';
import { generateOpenQASM, generateQiskit, generateCirq, generateJSON } from '../../../services/api.js';

export default function ExportCircuitModal({ isOpen, onClose, circ, shots }) {
  const [format, setFormat] = useState('qasm'); // 'qasm' | 'qiskit' | 'cirq' | 'json'
  const [copied, setCopied] = useState(false);

  const exported = useMemo(() => {
    const circuitData = {
      title: circ.note?.name || 'Qubitry Circuit',
      description: circ.note?.description || '',
      qubits: circ.n,
      ops: circ.ops,
      shots: shots || 1024
    };

    switch (format) {
      case 'qiskit':
        return {
          code: generateQiskit(circuitData),
          filename: 'qubitry_circuit.py',
          mime: 'text/x-python',
          lang: 'Python (Qiskit)'
        };
      case 'cirq':
        return {
          code: generateCirq(circuitData),
          filename: 'qubitry_cirq.py',
          mime: 'text/x-python',
          lang: 'Python (Cirq)'
        };
      case 'json':
        return {
          code: generateJSON(circuitData),
          filename: 'qubitry_circuit.json',
          mime: 'application/json',
          lang: 'JSON'
        };
      case 'qasm':
      default:
        return {
          code: generateOpenQASM(circuitData, 2),
          filename: 'qubitry_circuit.qasm',
          mime: 'text/plain',
          lang: 'OpenQASM 2.0'
        };
    }
  }, [circ, shots, format]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(exported.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([exported.code], { type: exported.mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exported.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(5, 7, 12, 0.8)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#0d121c',
          border: '1px solid var(--b)',
          borderRadius: 14,
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(101, 213, 208, 0.15)',
          maxWidth: 680,
          width: '100%',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--p)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h3 style={{ fontSize: 16, margin: 0, color: '#FFFFFF' }}>Export Quantum Circuit</h3>
            <span
              style={{
                fontSize: 11,
                fontFamily: 'JetBrains Mono',
                color: 'var(--c)',
                background: 'rgba(101, 213, 208, 0.12)',
                border: '1px solid rgba(101, 213, 208, 0.3)',
                padding: '2px 8px',
                borderRadius: 12
              }}
            >
              Multi-Format Exporter
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--m)',
              fontSize: 16,
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            padding: '12px 20px',
            borderBottom: '1px solid var(--b)',
            background: 'var(--bg)',
            overflowX: 'auto'
          }}
        >
          {[
            { id: 'qasm', label: 'OpenQASM 2.0 (.qasm)' },
            { id: 'qiskit', label: 'IBM Qiskit (.py)' },
            { id: 'cirq', label: 'Google Cirq (.py)' },
            { id: 'json', label: 'Qubitry Native JSON (.json)' }
          ].map(t => (
            <button
              key={t.id}
              className={format === t.id ? 'on' : ''}
              onClick={() => setFormat(t.id)}
              style={{
                fontSize: 12,
                padding: '6px 12px',
                whiteSpace: 'nowrap',
                fontWeight: format === t.id ? 600 : 400
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Code Preview Box */}
        <div style={{ padding: '16px 20px', flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--m)' }}>
              Format: <b style={{ color: 'var(--c)' }}>{exported.lang}</b> · {circ.n} Qubits · {circ.ops.length} Gates
            </span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--t)' }}>
              {exported.filename}
            </span>
          </div>

          <pre
            className="mono"
            style={{
              background: '#070a10',
              border: '1px solid var(--b)',
              borderRadius: 8,
              padding: '14px',
              fontSize: 12,
              lineHeight: 1.5,
              color: '#ECEEF4',
              overflowX: 'auto',
              maxHeight: '42vh',
              margin: 0
            }}
          >
            <code>{exported.code}</code>
          </pre>
        </div>

        {/* Action Footer */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid var(--b)',
            background: 'var(--p)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ fontSize: 11, color: 'var(--m)' }}>
            Compatible with IBM Quantum, AWS Braket, Rigetti &amp; Google Cirq SDKs.
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleCopy}
              style={{
                fontSize: 12,
                padding: '6px 14px',
                borderColor: copied ? 'var(--ok)' : 'var(--b)',
                color: copied ? 'var(--ok)' : 'var(--t)'
              }}
            >
              {copied ? '✓ Copied to Clipboard' : '📋 Copy Code'}
            </button>
            <button
              className="pri"
              onClick={handleDownload}
              style={{ fontSize: 12, padding: '6px 16px', fontWeight: 600 }}
            >
              ⬇ Download {exported.filename}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

