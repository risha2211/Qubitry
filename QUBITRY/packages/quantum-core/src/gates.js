export const PI = Math.PI, S2 = Math.SQRT1_2;

// Gate metadata dictionary
// k = total qubits involved, b = base single-qubit gate (for controlled operations),
// c = number of controls, a = takes angle parameter (radians)
export const GATES = {
  // Single-qubit Pauli & Clifford
  I:   { k: 1, name: 'Identity', desc: 'Leaves qubit unchanged' },
  H:   { k: 1, name: 'Hadamard', desc: 'Creates equal superposition |0⟩ ↦ (|0⟩+|1⟩)/√2, |1⟩ ↦ (|0⟩-|1⟩)/√2' },
  X:   { k: 1, name: 'Pauli-X (NOT)', desc: 'Bit-flip: |0⟩ ↔ |1⟩' },
  Y:   { k: 1, name: 'Pauli-Y', desc: 'Bit-and-phase flip: |0⟩ ↦ i|1⟩, |1⟩ ↦ -i|0⟩' },
  Z:   { k: 1, name: 'Pauli-Z', desc: 'Phase-flip: |0⟩ ↦ |0⟩, |1⟩ ↦ -|1⟩' },
  S:   { k: 1, name: 'Phase S', desc: 'Quarter-turn phase gate: diag(1, i)' },
  Sdg: { k: 1, name: 'S† (S-Dagger)', desc: 'Inverse quarter-turn: diag(1, -i)' },
  T:   { k: 1, name: 'T (π/8)', desc: 'Eighth-turn phase gate: diag(1, e^{iπ/4})' },
  Tdg: { k: 1, name: 'T† (T-Dagger)', desc: 'Inverse eighth-turn: diag(1, e^{-iπ/4})' },
  
  // Parameterized rotations
  RX:  { k: 1, a: 1, name: 'Rotation-X', desc: 'Rotation around X axis by angle θ' },
  RY:  { k: 1, a: 1, name: 'Rotation-Y', desc: 'Rotation around Y axis by angle θ' },
  RZ:  { k: 1, a: 1, name: 'Rotation-Z', desc: 'Rotation around Z axis by angle θ' },
  P:   { k: 1, a: 1, name: 'Phase P(φ)', desc: 'Arbitrary phase shift: diag(1, e^{iφ})' },
  
  // Two-qubit controlled gates
  CX:  { k: 2, b: 'X', c: 1, name: 'CNOT (CX)', desc: 'Controlled-NOT: flips target if control is |1⟩' },
  CY:  { k: 2, b: 'Y', c: 1, name: 'Controlled-Y', desc: 'Controlled Pauli-Y gate' },
  CZ:  { k: 2, b: 'Z', c: 1, name: 'Controlled-Z', desc: 'Flips sign if both qubits are |1⟩' },
  CP:  { k: 2, b: 'P', c: 1, a: 1, name: 'Controlled-Phase', desc: 'Applies phase shift e^{iφ} if both are |1⟩' },
  CRZ: { k: 2, b: 'RZ', c: 1, a: 1, name: 'Controlled-RZ', desc: 'Controlled rotation around Z axis' },
  SWAP:{ k: 2, name: 'SWAP', desc: 'Exchanges states of two qubits: |ab⟩ ↦ |ba⟩' },
  
  // Three-qubit gates
  CCX: { k: 3, b: 'X', c: 2, name: 'Toffoli (CCX)', desc: 'Controlled-Controlled-NOT: flips target if both controls are |1⟩' },
  CSWAP:{ k: 3, name: 'Fredkin (CSWAP)', desc: 'Controlled-SWAP: swaps targets if control is |1⟩' },
  
  // Non-unitary / measurement
  M:   { k: 1, name: 'Measurement', desc: 'Measures qubit in computational basis {|0⟩, |1⟩} into classical bit and collapses state' },
  Reset:{ k: 1, name: 'Reset', desc: 'Non-unitary reset to ground state |0⟩' }
};

let _id = 1;
export const nextId = () => _id++;

// 2x2 unitary matrix represented as flat array: [ar, ai, br, bi, cr, ci, dr, di]
// representing matrix [[a, b], [c, d]] where each entry is (real, imag)
export function matrix(g, p = 0) {
  const c = Math.cos(p / 2), s = Math.sin(p / 2);
  switch (g) {
    case 'I':   return [1, 0, 0, 0, 0, 0, 1, 0];
    case 'H':   return [S2, 0, S2, 0, S2, 0, -S2, 0];
    case 'X':   return [0, 0, 1, 0, 1, 0, 0, 0];
    case 'Y':   return [0, 0, 0, -1, 0, 1, 0, 0];
    case 'Z':   return [1, 0, 0, 0, 0, 0, -1, 0];
    case 'S':   return [1, 0, 0, 0, 0, 0, 0, 1];
    case 'Sdg': return [1, 0, 0, 0, 0, 0, 0, -1];
    case 'T':   return [1, 0, 0, 0, 0, 0, S2, S2];
    case 'Tdg': return [1, 0, 0, 0, 0, 0, S2, -S2];
    case 'RX':  return [c, 0, 0, -s, 0, -s, c, 0];
    case 'RY':  return [c, 0, -s, 0, s, 0, c, 0];
    case 'RZ':  return [c, -s, 0, 0, 0, 0, c, s];
    case 'P':   return [1, 0, 0, 0, 0, 0, Math.cos(p), Math.sin(p)];
    default: throw new Error('Unknown single-qubit unitary gate: ' + g);
  }
}
