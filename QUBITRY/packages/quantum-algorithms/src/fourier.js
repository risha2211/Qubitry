// 3-qubit QFT circuit builder
const qftCols = [[['X', [0]]]];
for (let j = 2; j >= 0; j--) {
  qftCols.push([['H', [j]]]);
  for (let k = j - 1; k >= 0; k--) {
    qftCols.push([['CP', [k, j], Math.PI / Math.pow(2, j - k)]]);
  }
}
qftCols.push([['SWAP', [0, 2]]]);

// 3-qubit Inverse QFT circuit builder
const invQftCols = [[['SWAP', [0, 2]]]];
for (let j = 0; j <= 2; j++) {
  for (let k = 0; k < j; k++) {
    invQftCols.push([['CP', [k, j], -Math.PI / Math.pow(2, j - k)]]);
  }
  invQftCols.push([['H', [j]]]);
}

export const fourier = [
  {
    id: 'qft',
    name: 'Quantum Fourier Transform (3 qubits)',
    type: 'Circuit Simulation',
    level: 'Advanced',
    n: 3,
    cols: qftCols,
    description: 'Computes discrete Fourier transform of quantum amplitudes: |j⟩ ↦ 1/√N ∑_{k} e^{2πi jk/N} |k⟩. On input |001⟩, produces equal magnitude 1/8 on all states with linear phase progression.',
    expected: 'All 8 outcomes with probability 12.5% each'
  },
  {
    id: 'inv-qft',
    name: 'Inverse QFT (3 qubits)',
    type: 'Circuit Simulation',
    level: 'Advanced',
    n: 3,
    // Apply QFT then Inverse QFT to verify return to exact input |001>
    cols: [...qftCols, ...invQftCols],
    description: 'Unitary adjoint of QFT (U† U = I). Reversing the gate order and conjugating phase rotations recovers the initial state with 100% fidelity.',
    expected: 'Recovers initial state |001⟩ with 100% certainty (P(1) = 1)'
  },
  {
    id: 'qpe',
    name: 'Quantum Phase Estimation (QPE)',
    type: 'Circuit Simulation',
    level: 'Advanced',
    n: 3,
    // Estimating eigenphase of T gate: T|1> = e^{i 2pi (1/8)} |1> -> phi = 0.001_2 (1/8)
    // q0, q1: counting qubits; q2: eigenstate |1>
    cols: [
      [['X', [2]]],              // Prepare eigenstate |1> on q2
      [['H', [0]], ['H', [1]]],  // Superposition on counting qubits
      [['CP', [0, 2], Math.PI / 4]], // Controlled-T on q0
      [['CP', [1, 2], Math.PI / 2]], // Controlled-T^2 = Controlled-S on q1
      // 2-qubit inverse QFT on q0, q1:
      [['SWAP', [0, 1]]],
      [['H', [0]]],
      [['CP', [1, 0], -Math.PI / 2]],
      [['H', [1]]]
    ],
    description: 'Estimates the unknown phase φ in U|ψ⟩ = e^{2πi φ}|ψ⟩. Here estimating phase of T gate (φ = 1/8 = 0.001 in binary). Readout register yields the binary fraction estimate.',
    expected: 'Counting register (q1, q0) measures phase 1/8'
  },
  {
    id: 'shor-toy',
    name: "Shor's Order-Finding (Toy N=15, a=7)",
    type: 'Hybrid Algorithm',
    level: 'Research',
    n: 4,
    // Order finding circuit for a=7 mod 15:
    // Period r=4: 7^0=1, 7^1=7, 7^2=4, 7^3=13, 7^4=1 (mod 15)
    cols: [
      [['X', [3]]], // Work register in |1>
      [['H', [0]], ['H', [1]]], // Control register
      // Controlled modular multiplications:
      [['CX', [0, 2]], ['CX', [0, 3]]],
      [['CX', [1, 2]]],
      // Inverse QFT on counting register q0, q1:
      [['SWAP', [0, 1]]],
      [['H', [0]]],
      [['CP', [1, 0], -Math.PI / 2]],
      [['H', [1]]]
    ],
    description: "Quantum core of Shor's factoring algorithm: estimates phase s/r using QPE. Measuring period r=4 allows classical post-processing to compute gcd(7^{r/2} ± 1, 15) = gcd(48, 15)=3 and gcd(50, 15)=5, factoring 15 = 3 × 5.",
    expected: 'Measures phase multiples of 1/r = 1/4; yields factors 3 and 5 classically'
  }
];
