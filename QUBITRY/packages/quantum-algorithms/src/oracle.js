import { layer } from './util.js';

export const oracle = [
  {
    id: 'deutsch',
    name: "Deutsch's Algorithm",
    type: 'Circuit Simulation',
    level: 'Beginner',
    n: 2,
    // q0: input, q1: ancilla in |->
    cols: [
      [['X', [1]]],
      [['H', [0]], ['H', [1]]],
      [['CX', [0, 1]]], // balanced oracle f(x) = x
      [['H', [0]]]
    ],
    description: "Determines whether a 1-bit function f:{0,1}→{0,1} is constant or balanced in a single quantum query using phase kickback. For balanced f, q0 measures |1⟩.",
    expected: 'q0 is measured as 1 (balanced function detected)'
  },
  {
    id: 'dj-balanced',
    name: 'Deutsch–Jozsa (Balanced Oracle)',
    type: 'Circuit Simulation',
    level: 'Intermediate',
    n: 3,
    cols: [
      [['X', [2]]],
      layer('H', 3),
      [['CX', [0, 2]]], // f(x0, x1) = x0 (balanced)
      [['H', [0]], ['H', [1]]]
    ],
    description: 'Oracle f(x) is balanced (returns 1 for exactly half of inputs). Destructive interference ensures the input register (q0, q1) is never |00⟩.',
    expected: 'Input register (q0, q1) ≠ 00 (outcomes 001 and 101 at 50% each)'
  },
  {
    id: 'dj-constant',
    name: 'Deutsch–Jozsa (Constant Oracle)',
    type: 'Circuit Simulation',
    level: 'Intermediate',
    n: 3,
    cols: [
      [['X', [2]]],
      layer('H', 3),
      // constant oracle: f(x) = 0 (identity on ancilla)
      [['H', [0]], ['H', [1]]]
    ],
    description: 'Oracle f(x) = 0 is constant. Constructive interference guarantees that the input register (q0, q1) returns to |00⟩ with 100% probability.',
    expected: 'Input register (q0, q1) = 00 with 100% certainty'
  },
  {
    id: 'simon',
    name: "Simon's Algorithm (s = 11)",
    type: 'Circuit Simulation',
    level: 'Advanced',
    n: 4,
    // q0, q1: input register; q2, q3: output register
    // 2-to-1 function with secret mask s = 11:
    // f(x) = f(x ⊕ 11)
    cols: [
      [['H', [0]], ['H', [1]]],
      // Oracle mapping for s = 11:
      // q2 = q0 ⊕ q1, q3 = q0 ⊕ q1
      [['CX', [0, 2]], ['CX', [0, 3]]],
      [['CX', [1, 2]], ['CX', [1, 3]]],
      [['H', [0]], ['H', [1]]]
    ],
    description: "Finds hidden XOR period s such that f(x) = f(x ⊕ s). Measurement of input register yields strings y orthogonal to s (y · s = 0 mod 2). For s=11, outcomes are 00 and 11.",
    expected: 'Measures only strings y where y · s = 0: outcomes |00⟩ and |11⟩'
  }
];
