import { GATES, matrix } from './gates.js';

export const MAX_QUBITS = 6;

export const orderOps = ops => [...ops].sort((a, b) => (a.s ?? 0) - (b.s ?? 0) || (a.id ?? 0) - (b.id ?? 0));

/**
 * Applies a single quantum operation on statevector (re, im) in place.
 * N = 1 << n
 */
export function applyOp(re, im, n, op) {
  const N = 1 << n;
  const g = op.g;

  // Measurement (ideal projection for statevector inspector: collapse according to Born probabilities)
  if (g === 'M') {
    const q = op.q[0];
    let prob0 = 0;
    for (let i = 0; i < N; i++) {
      if ((i >> q & 1) === 0) {
        prob0 += re[i] * re[i] + im[i] * im[i];
      }
    }
    // Deterministic or sampled outcome based on op.forcedOutcome if provided
    const outcome = op.forcedOutcome !== undefined 
      ? op.forcedOutcome 
      : (Math.random() < prob0 ? 0 : 1);
    const norm = Math.sqrt(outcome === 0 ? prob0 : 1 - prob0);
    
    if (norm > 1e-12) {
      for (let i = 0; i < N; i++) {
        if ((i >> q & 1) === outcome) {
          re[i] /= norm;
          im[i] /= norm;
        } else {
          re[i] = 0;
          im[i] = 0;
        }
      }
    }
    return outcome;
  }

  // Reset gate: project to |0⟩ (if measured |1⟩, flip to |0⟩)
  if (g === 'Reset') {
    const q = op.q[0];
    let prob0 = 0;
    for (let i = 0; i < N; i++) {
      if ((i >> q & 1) === 0) prob0 += re[i] * re[i] + im[i] * im[i];
    }
    // If state has amplitude in |1⟩, shift to |0⟩
    for (let i = 0; i < N; i++) {
      if ((i >> q & 1) === 1) {
        const j = i ^ (1 << q);
        re[j] = Math.sqrt(re[j] * re[j] + re[i] * re[i]);
        im[j] = 0;
        re[i] = 0;
        im[i] = 0;
      }
    }
    // Renormalize
    let s = 0;
    for (let i = 0; i < N; i++) s += re[i] * re[i] + im[i] * im[i];
    const norm = Math.sqrt(s) || 1;
    for (let i = 0; i < N; i++) { re[i] /= norm; im[i] /= norm; }
    return 0;
  }

  // SWAP gate: exchanges wires a and b
  if (g === 'SWAP') {
    const [a, b] = op.q;
    for (let i = 0; i < N; i++) {
      if ((i >> a & 1) && !(i >> b & 1)) {
        const j = i ^ (1 << a) ^ (1 << b);
        [re[i], re[j]] = [re[j], re[i]];
        [im[i], im[j]] = [im[j], im[i]];
      }
    }
    return;
  }

  // CSWAP (Fredkin gate): controls target swaps if control is |1⟩
  if (g === 'CSWAP') {
    const [ctrl, a, b] = op.q;
    for (let i = 0; i < N; i++) {
      // Must have control bit = 1
      if (!(i >> ctrl & 1)) continue;
      if ((i >> a & 1) && !(i >> b & 1)) {
        const j = i ^ (1 << a) ^ (1 << b);
        [re[i], re[j]] = [re[j], re[i]];
        [im[i], im[j]] = [im[j], im[i]];
      }
    }
    return;
  }

  // General controlled or single-qubit unitary
  const baseGate = GATES[g]?.b || g;
  const t = op.q[op.q.length - 1]; // target is last qubit
  const cm = op.q.slice(0, -1).reduce((m, x) => m | (1 << x), 0); // control mask
  const u = matrix(baseGate, op.p || 0);

  for (let i = 0; i < N; i++) {
    // Only process basis states where target bit is 0 and all control bits are 1
    if ((i >> t & 1) || (i & cm) !== cm) continue;
    const j = i | (1 << t);
    const ar = re[i], ai = im[i];
    const br = re[j], bi = im[j];

    re[i] = u[0]*ar - u[1]*ai + u[2]*br - u[3]*bi;
    im[i] = u[0]*ai + u[1]*ar + u[2]*bi + u[3]*br;

    re[j] = u[4]*ar - u[5]*ai + u[6]*br - u[7]*bi;
    im[j] = u[4]*ai + u[5]*ar + u[6]*bi + u[7]*br;
  }
}

/**
 * Exact statevector simulation.
 * Returns final { re, im } statevector.
 */
export function simulate(n, ops) {
  if (n < 1 || n > MAX_QUBITS) throw new Error('Qubit count must be 1-' + MAX_QUBITS);
  const N = 1 << n;
  const re = new Float64Array(N);
  const im = new Float64Array(N);
  re[0] = 1.0;

  for (const op of orderOps(ops)) {
    applyOp(re, im, n, op);
  }

  return { re, im };
}

/**
 * Step-by-step statevector simulation.
 * Returns an array of snapshots: [{ step: 0, op: null, sv: {re, im} }, ...]
 * allows inspecting the quantum state after every single operation moment.
 */
export function simulateStepByStep(n, ops) {
  if (n < 1 || n > MAX_QUBITS) throw new Error('Qubit count must be 1-' + MAX_QUBITS);
  const N = 1 << n;
  const re = new Float64Array(N);
  const im = new Float64Array(N);
  re[0] = 1.0;

  const steps = [
    {
      step: 0,
      op: null,
      re: new Float64Array(re),
      im: new Float64Array(im)
    }
  ];

  const ordered = orderOps(ops);
  for (let idx = 0; idx < ordered.length; idx++) {
    const op = ordered[idx];
    applyOp(re, im, n, op);
    steps.push({
      step: idx + 1,
      op,
      re: new Float64Array(re),
      im: new Float64Array(im)
    });
  }

  return steps;
}
