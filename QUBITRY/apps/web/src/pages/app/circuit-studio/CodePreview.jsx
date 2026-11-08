import { useState } from 'react'; import { generateCode } from '@qubitry/quantum-core';
export default function CodePreview({ n, ops }) {
  const [m, setM] = useState('qiskit'), code = generateCode(n, ops, m);
  return <div><div className="bg" style={{ marginBottom: 8 }}><button className={m === 'qiskit' ? 'on' : ''} onClick={() => setM('qiskit')}>Qiskit</button><button className={m === 'qasm' ? 'on' : ''} onClick={() => setM('qasm')}>OpenQASM 2.0</button>
    <button onClick={() => navigator.clipboard && navigator.clipboard.writeText(code)}>Copy</button></div><pre>{code}</pre></div>;
}
