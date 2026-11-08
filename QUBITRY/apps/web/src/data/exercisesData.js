/**
 * Qubitry Independent Exercises & Challenges
 * 5 Categories: Quizzes, Circuit Challenges, State Prediction, Math Problems, Algorithm Challenges
 */

export const EXERCISE_CATEGORIES = [
  { id: 'quiz', title: 'Conceptual Quizzes', desc: 'Multiple-choice questions testing theoretical and physical understanding.' },
  { id: 'circuit', title: 'Circuit Building Challenges', desc: 'Construct quantum circuits that satisfy exact target statevector requirements.' },
  { id: 'prediction', title: 'State Prediction', desc: 'Analyze quantum circuits and predict resultant quantum amplitudes and Born probabilities.' },
  { id: 'math', title: 'Mathematical Problems', desc: 'Solve matrix multiplication, tensor products, normalization, and inner products.' },
  { id: 'algorithm', title: 'Algorithm Challenges', desc: 'Practical challenges on Deutsch-Jozsa, Grover, Bernstein-Vazirani, and Teleportation.' }
];

export const EXERCISES = [
  // --- CATEGORY 01: CONCEPTUAL QUIZZES ---
  {
    id: 'quiz-foundations',
    category: 'quiz',
    title: 'Quantum Foundations & Qubits',
    difficulty: 'Beginner',
    estimatedTime: '10 mins',
    maxScore: 10,
    description: 'Test your understanding of classical vs quantum bits, superposition, and the Born rule.',
    questions: [
      {
        id: 'q1',
        prompt: 'Which of the following describes the normalization condition for a single-qubit pure state |ψ⟩ = α|0⟩ + β|1⟩?',
        options: [
          '|α|² + |β|² = 1',
          'α + β = 1',
          '|α| + |β| = 1',
          'α² + β² = 0'
        ],
        correct: 0,
        explanation: 'The normalization condition requires that the sum of the squared magnitudes of the probability amplitudes equals 1 (|α|² + |β|² = 1) to conserve total probability 100%.'
      },
      {
        id: 'q2',
        prompt: 'According to the Born rule, what is the probability of obtaining outcome 1 when measuring |ψ⟩ = (1/2)|0⟩ + (√3/2)|1⟩ in the computational basis?',
        options: [
          '75% (3/4)',
          '50% (1/2)',
          '25% (1/4)',
          '86.6% (√3/2)'
        ],
        correct: 0,
        explanation: 'The probability is the square of the amplitude of |1⟩: P(1) = |β|² = (√3/2)² = 3/4 = 75%.'
      },
      {
        id: 'q3',
        prompt: 'What happens to a qubit in superposition state |+⟩ = (|0⟩ + |1⟩)/√2 immediately after a computational basis measurement yields outcome 0?',
        options: [
          'The state collapses to |0⟩',
          'The state remains in |+⟩',
          'The state collapses to |-⟩',
          'The state oscillates between |0⟩ and |1⟩'
        ],
        correct: 0,
        explanation: 'Measurement is a projective, non-unitary operation that irreversibly collapses the wavefunction into the measured eigenstate (|0⟩).'
      },
      {
        id: 'q4',
        prompt: 'What mathematical property ensures that closed quantum operations are norm-preserving and reversible?',
        options: [
          'Unitarity (U†U = I)',
          'Commutativity (AB = BA)',
          'Symmetry (Aᵀ = A)',
          'Singularity (det(A) = 0)'
        ],
        correct: 0,
        explanation: 'A linear transformation U is unitary if U†U = I, which guarantees norm preservation ⟨Uψ|Uψ⟩ = ⟨ψ|ψ⟩ and reversibility via U†.'
      }
    ]
  },
  {
    id: 'quiz-gates-clifford',
    category: 'quiz',
    title: 'Quantum Gates & Clifford Algebra',
    difficulty: 'Intermediate',
    estimatedTime: '12 mins',
    maxScore: 10,
    description: 'Verify your knowledge of Pauli matrices, phase gates, Hadamard transformations, and universality.',
    questions: [
      {
        id: 'qg1',
        prompt: 'What is the action of the Hadamard gate on the computational basis state |1⟩?',
        options: [
          '(|0⟩ - |1⟩) / √2',
          '(|0⟩ + |1⟩) / √2',
          '|0⟩',
          '-|1⟩'
        ],
        correct: 0,
        explanation: 'H|1⟩ = (|0⟩ - |1⟩)/√2 = |-⟩. The minus sign represents the relative phase.'
      },
      {
        id: 'qg2',
        prompt: 'What gate is produced by applying the S gate twice in succession (S²)?',
        options: [
          'Pauli-Z gate',
          'Pauli-X gate',
          'Identity gate',
          'Hadamard gate'
        ],
        correct: 0,
        explanation: 'S = diag(1, i). Squaring it yields diag(1, i²) = diag(1, -1) = Z.'
      },
      {
        id: 'qg3',
        prompt: 'Why are quantum gates strictly restricted to equal numbers of input and output qubits?',
        options: [
          'Because unitary evolution is norm-preserving and reversible',
          'Because quantum hardware cannot store extra energy',
          'Because measurement cannot produce digital outputs',
          'Because qubits cannot be wired together'
        ],
        correct: 0,
        explanation: 'Unitarity requires square transformation matrices, ensuring no information is destroyed or created.'
      }
    ]
  },

  // --- CATEGORY 02: CIRCUIT BUILDING CHALLENGES ---
  {
    id: 'challenge-hadamard-superposition',
    category: 'circuit',
    title: 'Challenge: Equal Superposition |+⟩',
    difficulty: 'Beginner',
    estimatedTime: '5 mins',
    maxScore: 10,
    qubits: 1,
    initialOps: [],
    target: {
      description: 'Prepare the equal superposition state |+⟩ = (|0⟩ + |1⟩)/√2 starting from ground state |0⟩.',
      expectedProbabilities: { '0': 0.5, '1': 0.5 },
      targetState: { re: [Math.SQRT1_2, Math.SQRT1_2], im: [0, 0] },
      hint: 'Apply a single Hadamard gate (H) to wire q[0].'
    }
  },
  {
    id: 'challenge-bell-phi-plus',
    category: 'circuit',
    title: 'Challenge: Canonical Bell State |Φ⁺⟩',
    difficulty: 'Beginner to Intermediate',
    estimatedTime: '8 mins',
    maxScore: 15,
    qubits: 2,
    initialOps: [],
    target: {
      description: 'Construct the maximally entangled Bell state |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 on qubits q0 and q1.',
      expectedProbabilities: { '00': 0.5, '11': 0.5 },
      targetState: { re: [Math.SQRT1_2, 0, 0, Math.SQRT1_2], im: [0, 0, 0, 0] },
      hint: 'Apply a Hadamard gate on q0 to create superposition, then a CNOT gate with control on q0 and target on q1.'
    }
  },
  {
    id: 'challenge-bell-phi-minus',
    category: 'circuit',
    title: 'Challenge: Phase-Flipped Bell State |Φ⁻⟩',
    difficulty: 'Intermediate',
    estimatedTime: '10 mins',
    maxScore: 15,
    qubits: 2,
    initialOps: [],
    target: {
      description: 'Construct the Bell state with negative relative phase: |Φ⁻⟩ = (|00⟩ - |11⟩)/√2.',
      expectedProbabilities: { '00': 0.5, '11': 0.5 },
      targetState: { re: [Math.SQRT1_2, 0, 0, -Math.SQRT1_2], im: [0, 0, 0, 0] },
      hint: 'Prepare |Φ⁺⟩ and apply a Pauli-Z gate on q0, or apply Pauli-X on q0 before the entangling circuit.'
    }
  },
  {
    id: 'challenge-ghz-state',
    category: 'circuit',
    title: 'Challenge: 3-Qubit GHZ State',
    difficulty: 'Intermediate',
    estimatedTime: '12 mins',
    maxScore: 20,
    qubits: 3,
    initialOps: [],
    target: {
      description: 'Construct the tripartite maximally entangled GHZ state |GHZ⟩ = (|000⟩ + |111⟩)/√2 across 3 qubits.',
      expectedProbabilities: { '000': 0.5, '111': 0.5 },
      targetState: { re: [Math.SQRT1_2, 0, 0, 0, 0, 0, 0, Math.SQRT1_2], im: [0, 0, 0, 0, 0, 0, 0, 0] },
      hint: 'Apply H to q0, then CNOT(0, 1), and then CNOT(1, 2).'
    }
  },
  {
    id: 'challenge-grover-diffuser',
    category: 'circuit',
    title: 'Challenge: 2-Qubit Grover Search for |11⟩',
    difficulty: 'Advanced',
    estimatedTime: '15 mins',
    maxScore: 25,
    qubits: 2,
    initialOps: [],
    target: {
      description: 'Amplify target state |11⟩ to 100% measurement probability using Grover\'s oracle and diffuser.',
      expectedProbabilities: { '11': 1.0 },
      targetState: { re: [0, 0, 0, 1.0], im: [0, 0, 0, 0] },
      hint: '1. H on q0 and q1. 2. CZ oracle on (q0, q1). 3. Diffuser: H on both, X on both, CZ on both, X on both, H on both.'
    }
  },

  // --- CATEGORY 03: STATE PREDICTION ---
  {
    id: 'predict-h-z-h',
    category: 'prediction',
    title: 'State Prediction: H followed by Z on |0⟩',
    difficulty: 'Beginner',
    estimatedTime: '8 mins',
    maxScore: 10,
    description: 'Predict the resultant quantum state and measurement probabilities when H and Z gates are applied in sequence.',
    questions: [
      {
        id: 'pred1',
        prompt: 'Starting from |0⟩, what state vector results from applying a Hadamard gate followed by a Pauli-Z gate?',
        options: [
          '|-⟩ = (|0⟩ - |1⟩) / √2',
          '|+⟩ = (|0⟩ + |1⟩) / √2',
          '|1⟩',
          '-|0⟩'
        ],
        correct: 0,
        explanation: 'H|0⟩ = (|0⟩ + |1⟩)/√2. Applying Z leaves |0⟩ invariant and maps |1⟩ ↦ -|1⟩, resulting in (|0⟩ - |1⟩)/√2 = |-⟩.'
      },
      {
        id: 'pred2',
        prompt: 'What are the computational basis measurement probabilities for state |-⟩?',
        options: [
          'P(0) = 50%, P(1) = 50%',
          'P(0) = 100%, P(1) = 0%',
          'P(0) = 0%, P(1) = 100%',
          'P(0) = 75%, P(1) = 25%'
        ],
        correct: 0,
        explanation: 'P(0) = |1/√2|² = 50% and P(1) = |-1/√2|² = 50%. The relative phase (-1) does not affect probabilities in the computational basis.'
      }
    ]
  },
  {
    id: 'predict-cnot-superposition',
    category: 'prediction',
    title: 'State Prediction: CNOT on Superposition',
    difficulty: 'Intermediate',
    estimatedTime: '10 mins',
    maxScore: 10,
    description: 'Predict the entangled state when CNOT is applied to control qubit in |+⟩ and target in |0⟩.',
    questions: [
      {
        id: 'pred3',
        prompt: 'If wire 0 is in state |+⟩ and wire 1 is in state |0⟩, what is the output of CNOT(control=0, target=1)?',
        options: [
          '(|00⟩ + |11⟩) / √2',
          '(|00⟩ + |10⟩) / √2',
          '(|01⟩ + |10⟩) / √2',
          '|00⟩'
        ],
        correct: 0,
        explanation: 'Initial state is (|0⟩+|1⟩)/√2 ⊗ |0⟩ = (|00⟩ + |10⟩)/√2. CNOT flips the target only when control is 1, mapping |10⟩ ↦ |11⟩. Output is (|00⟩ + |11⟩)/√2.'
      }
    ]
  },

  // --- CATEGORY 04: MATHEMATICAL PROBLEMS ---
  {
    id: 'math-normalization-inner-product',
    category: 'math',
    title: 'Mathematical Problem: Amplitude Normalization & Inner Product',
    difficulty: 'Intermediate',
    estimatedTime: '12 mins',
    maxScore: 15,
    description: 'Calculate normalization constants and state vector projections in complex Hilbert space.',
    questions: [
      {
        id: 'm1',
        prompt: 'Find the positive real constant c such that the state |ψ⟩ = (1/√3)|0⟩ + c|1⟩ is normalized.',
        options: [
          'c = √(2/3)',
          'c = 2/3',
          'c = 1/√3',
          'c = 1/2'
        ],
        correct: 0,
        explanation: 'By the normalization condition: |1/√3|² + |c|² = 1 ⟹ 1/3 + c² = 1 ⟹ c² = 2/3 ⟹ c = √(2/3).'
      },
      {
        id: 'm2',
        prompt: 'Calculate the inner product ⟨+|0⟩ between transversal basis state |+⟩ = (|0⟩+|1⟩)/√2 and computational state |0⟩.',
        options: [
          '1/√2 ≈ 0.7071',
          '1',
          '0',
          '1/2'
        ],
        correct: 0,
        explanation: '⟨+|0⟩ = (1/√2 ⟨0| + 1/√2 ⟨1|) |0⟩ = 1/√2 ⟨0|0⟩ + 1/√2 ⟨1|0⟩ = 1/√2(1) + 1/√2(0) = 1/√2.'
      },
      {
        id: 'm3',
        prompt: 'What is the matrix product of Pauli matrices X and Z (X · Z)?',
        options: [
          '-iY',
          '+iY',
          'Identity (I)',
          '-Z'
        ],
        correct: 0,
        explanation: 'XZ = [[0, 1], [1, 0]] · [[1, 0], [0, -1]] = [[0, -1], [1, 0]] = -i [[0, -i], [i, 0]] = -iY.'
      }
    ]
  },

  // --- CATEGORY 05: ALGORITHM CHALLENGES ---
  {
    id: 'algo-deutsch-jozsa',
    category: 'algorithm',
    title: 'Algorithm Challenge: Deutsch-Jozsa Oracle Discrimination',
    difficulty: 'Intermediate to Advanced',
    estimatedTime: '15 mins',
    maxScore: 20,
    description: 'Analyze oracle queries, constructive interference at |00...0⟩, and query complexity.',
    questions: [
      {
        id: 'a1',
        prompt: 'In the Deutsch-Jozsa algorithm on n input qubits, what measurement outcome is observed if the oracle f(x) is constant?',
        options: [
          '|00...0⟩ with 100% probability',
          'Any non-zero bitstring',
          'A completely uniform distribution across all 2ⁿ states',
          '|11...1⟩ with 100% probability'
        ],
        correct: 0,
        explanation: 'For a constant function, all phase factors are identical, causing complete constructive interference into the all-zero state |0...0⟩.'
      },
      {
        id: 'a2',
        prompt: 'How many quantum queries are required by the Deutsch-Jozsa algorithm to distinguish constant from balanced functions with certainty?',
        options: [
          'Exactly 1 query',
          '2^(n-1) queries',
          'n queries',
          'O(√2ⁿ) queries'
        ],
        correct: 0,
        explanation: 'Deutsch-Jozsa requires exactly 1 quantum query, compared to 2^(n-1) + 1 queries for a deterministic classical algorithm.'
      }
    ]
  },
  {
    id: 'algo-bernstein-vazirani',
    category: 'algorithm',
    title: 'Algorithm Challenge: Bernstein-Vazirani Analysis',
    difficulty: 'Advanced',
    estimatedTime: '15 mins',
    maxScore: 20,
    description: 'Determine hidden bitstring encoding and single-shot phase kickback.',
    questions: [
      {
        id: 'bv1',
        prompt: 'In Bernstein-Vazirani, an oracle computes f(x) = s · x. How does the circuit measure all n bits of s in 1 query?',
        options: [
          'Phase kickback encodes (-1)^(s·x), and a final Hadamard transform maps this directly into |s⟩',
          'By using n independent entangled pairs',
          'By measuring the ancilla qubit repeatedly',
          'By brute-force parallel search'
        ],
        correct: 0,
        explanation: 'Phase kickback introduces phase factor (-1)^(s·x) into the superposition. Because H^(⊗n) is its own inverse, H^(⊗n) (1/√2ⁿ ∑ (-1)^(s·x) |x⟩) = |s⟩.'
      }
    ]
  }
];

