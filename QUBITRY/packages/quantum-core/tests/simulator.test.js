import { describe, it, expect } from 'vitest';
import {
  simulate,
  simulateStepByStep,
  probabilities,
  blochVector,
  angles,
  subsystemEntropy,
  singleQubitDensityMatrix,
  formatDirac,
  generateCode
} from '../src/index.js';
import { PRESETS, buildCircuit } from '../../quantum-algorithms/src/index.js';

const run = id => {
  const preset = PRESETS.find(p => p.id === id);
  if (!preset) throw new Error('Preset not found: ' + id);
  const c = buildCircuit(preset);
  const sv = simulate(c.n, c.ops);
  return { c, sv, p: probabilities(sv) };
};

describe('simulator core', () => {
  it('Superposition test', () => {
    const { p } = run('superposition');
    expect(p[0]).toBeCloseTo(0.5);
    expect(p[1]).toBeCloseTo(0.5);
  });

  it('Bell state: creates equal superposition of |00> and |11>', () => {
    const { p } = run('bell');
    expect(p[0]).toBeCloseTo(0.5);
    expect(p[3]).toBeCloseTo(0.5);
    expect(p[1] + p[2]).toBeCloseTo(0);
  });

  it('Bell qubits are maximally mixed with von Neumann entropy = 1.0 bit', () => {
    const { sv } = run('bell');
    const bv = blochVector(sv, 2, 0);
    expect(angles(bv).r).toBeCloseTo(0);
    const entropy = subsystemEntropy(sv, 2, 0);
    expect(entropy).toBeCloseTo(1.0, 4);
    const dm = singleQubitDensityMatrix(sv, 2, 0);
    expect(dm.purity).toBeCloseTo(0.5, 4);
  });

  it('Separable pure state has entropy = 0 and purity = 1.0', () => {
    const sv = simulate(2, [{ g: 'H', q: [0], s: 0 }]);
    expect(subsystemEntropy(sv, 2, 0)).toBeCloseTo(0);
    expect(singleQubitDensityMatrix(sv, 2, 0).purity).toBeCloseTo(1.0);
  });

  it('GHZ: creates equal superposition of |000> and |111>', () => {
    const { p } = run('ghz');
    expect(p[0]).toBeCloseTo(0.5);
    expect(p[7]).toBeCloseTo(0.5);
  });

  it('One-bit adder: 1 + 1 computes Sum=0 and Carry=1', () => {
    const { p } = run('adder');
    // |q3 q2 q1 q0> = |1 0 1 1> -> bit index 0b1011 = 11
    expect(p[11]).toBeCloseTo(1.0);
  });

  it('Deutsch algorithm: balanced function outputs 1 on q0', () => {
    const { p } = run('deutsch');
    // q0 is odd indices (|1> for q0)
    expect(p[1] + p[3]).toBeCloseTo(1.0);
  });

  it('Deutsch-Jozsa balanced: input register never 00', () => {
    const { p } = run('dj-balanced');
    expect(p[0b001] + p[0b101]).toBeCloseTo(1);
  });

  it('Deutsch-Jozsa constant: input register always 00', () => {
    const { p } = run('dj-constant');
    // input register q0, q1 is 00 -> only bits ending in 00
    // ancilla q2 was prepared in |1> then H -> |->
    expect(p[0b100] + p[0b000]).toBeCloseTo(1.0);
  });

  it('Simon algorithm: measures strings y orthogonal to s=11', () => {
    const { p } = run('simon');
    // For s=11, valid input register strings are 00 and 11
    let sumValid = 0;
    for (let i = 0; i < 16; i++) {
      const q0 = i & 1;
      const q1 = (i >> 1) & 1;
      if ((q0 ^ q1) === 0) { // 00 or 11
        sumValid += p[i];
      }
    }
    expect(sumValid).toBeCloseTo(1.0);
  });

  it('Grover 2 qubits finds target |11>', () => {
    expect(run('g2').p[3]).toBeCloseTo(1);
  });

  it('Grover 3 qubits with 2 iterations amplifies |111>', () => {
    expect(run('g3').p[7]).toBeCloseTo(0.9453125, 6);
  });

  it('Inverse QFT recovers original state |001> with 100% fidelity', () => {
    const { p } = run('inv-qft');
    expect(p[1]).toBeCloseTo(1.0);
  });

  it('Fredkin gate (CSWAP): swaps targets only if control is 1', () => {
    const ops = [
      { g: 'X', q: [0], s: 0 },
      { g: 'X', q: [2], s: 0 },
      { g: 'CSWAP', q: [0, 1, 2], s: 1 }
    ];
    const sv = simulate(3, ops);
    const p = probabilities(sv);
    expect(p[3]).toBeCloseTo(1.0); // |110>
  });

  it('step-by-step simulation records snapshots', () => {
    const ops = [
      { g: 'H', q: [0], s: 0 },
      { g: 'CX', q: [0, 1], s: 1 }
    ];
    const steps = simulateStepByStep(2, ops);
    expect(steps.length).toBe(3);
    expect(steps[0].re[0]).toBe(1.0);
    expect(steps[1].re[0]).toBeCloseTo(Math.SQRT1_2);
    expect(steps[1].re[1]).toBeCloseTo(Math.SQRT1_2);
    expect(steps[2].re[0]).toBeCloseTo(Math.SQRT1_2);
    expect(steps[2].re[3]).toBeCloseTo(Math.SQRT1_2);
  });

  it('Dirac notation formatter', () => {
    const sv = simulate(2, [{ g: 'H', q: [0], s: 0 }, { g: 'CX', q: [0, 1], s: 1 }]);
    const dirac = formatDirac(sv, 2);
    expect(dirac).toContain('|00⟩');
    expect(dirac).toContain('|11⟩');
  });

  it('codegen produces valid Qiskit code', () => {
    expect(generateCode(2, buildCircuit(PRESETS[0]).ops)).toContain('qc.');
  });
});
