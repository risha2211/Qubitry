import { GATES, PI } from './gates.js';
import { orderOps } from './simulator.js';

const NAMES = {
  Sdg: 'sdg',
  Tdg: 'tdg',
  CCX: 'ccx',
  CX: 'cx',
  CY: 'cy',
  CZ: 'cz',
  CP: 'cp',
  CRZ: 'crz',
  SWAP: 'swap',
  CSWAP: 'cswap',
  Reset: 'reset',
  M: 'measure',
  RX: 'rx',
  RY: 'ry',
  RZ: 'rz',
  P: 'p'
};

export function generateCode(n, ops, mode = 'qiskit') {
  const ordered = orderOps(ops);

  if (mode === 'qiskit') {
    const lines = ordered.map(o => {
      const g = NAMES[o.g] || o.g.toLowerCase();
      const a = GATES[o.g]?.a ? `${+(o.p / PI).toFixed(6)}*pi` : '';
      if (o.g === 'M') {
        const q = o.q[0];
        return `qc.measure(${q}, ${q})`;
      }
      if (o.g === 'Reset') {
        return `qc.reset(${o.q[0]})`;
      }
      return `qc.${g}(${[a, ...o.q].filter(x => x !== '').join(', ')})`;
    });

    const hasMeasurements = ordered.some(o => o.g === 'M');
    return [
      'from qiskit import QuantumCircuit',
      'from math import pi',
      `qc = QuantumCircuit(${n}, ${n})`,
      ...lines,
      ...(!hasMeasurements ? [`qc.measure(range(${n}), range(${n}))`] : [])
    ].join('\n');
  }

  // OpenQASM 2.0
  const lines = ordered.map(o => {
    let g = NAMES[o.g] || o.g.toLowerCase();
    const a = GATES[o.g]?.a ? `(${+(o.p / PI).toFixed(6)}*pi)` : '';
    if (o.g === 'M') {
      const q = o.q[0];
      return `measure q[${q}] -> c[${q}];`;
    }
    if (o.g === 'Reset') {
      return `reset q[${o.q[0]}];`;
    }
    if (g === 'p') g = 'u1';
    if (g === 'cp') g = 'cu1';
    return `${g}${a} ${o.q.map(q => `q[${q}]`).join(',')};`;
  });

  const hasMeasurements = ordered.some(o => o.g === 'M');
  return [
    'OPENQASM 2.0;',
    'include "qelib1.inc";',
    `qreg q[${n}];`,
    `creg c[${n}];`,
    ...lines,
    ...(!hasMeasurements ? ['measure q -> c;'] : [])
  ].join('\n');
}
