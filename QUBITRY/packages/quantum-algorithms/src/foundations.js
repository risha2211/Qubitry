export const foundations = [
  {
    id: 'superposition',
    name: 'Superposition (Hadamard)',
    type: 'Circuit Simulation',
    level: 'Beginner',
    n: 1,
    cols: [[['H', [0]]]],
    description: 'Applying a Hadamard gate to ground state |0⟩ creates an equal superposition (|0⟩+|1⟩)/√2. Measurement yields 0 or 1 with 50% probability each.',
    expected: 'P(0) = 0.5, P(1) = 0.5'
  },
  {
    id: 'bell',
    name: 'Bell state |Φ⁺⟩',
    type: 'Circuit Simulation',
    level: 'Beginner',
    n: 2,
    cols: [[['H', [0]]], [['CX', [0, 1]]]],
    description: 'H on q0 then CNOT q0→q1 gives (|00⟩+|11⟩)/√2. Each qubit’s Bloch vector has length 0 (maximally entangled, subsystem entropy = 1.0 bit).',
    expected: 'P(00)=P(11)=0.5, correlations: r=0'
  },
  {
    id: 'ghz',
    name: 'GHZ state (3 qubits)',
    type: 'Circuit Simulation',
    level: 'Beginner',
    n: 3,
    cols: [[['H', [0]]], [['CX', [0, 1]]], [['CX', [1, 2]]]],
    description: 'Extends the Bell construction to the genuine tripartite entangled state (|000⟩+|111⟩)/√2.',
    expected: 'P(000)=P(111)=0.5'
  },
  {
    id: 'adder',
    name: 'Reversible One-Bit Half Adder',
    type: 'Circuit Simulation',
    level: 'Intermediate',
    n: 4,
    // q0: a=1, q1: b=1, q2: sum (|0>), q3: carry (|0>)
    cols: [
      [['X', [0]], ['X', [1]]], // Inputs a=1, b=1
      [['CX', [0, 2]]],
      [['CX', [1, 2]]],         // Sum = a ⊕ b in q2
      [['CCX', [0, 1, 3]]]      // Carry = a ∧ b in q3 (Toffoli)
    ],
    description: 'Reversible quantum logic: inputs a=1, b=1 compute Sum = a⊕b = 0 on q2, and Carry = a∧b = 1 on q3 using CNOT and Toffoli.',
    expected: 'Input 1+1 gives Sum=0, Carry=1 (|1101⟩)'
  },
  {
    id: 'tp',
    name: 'Quantum teleportation',
    type: 'Circuit Simulation',
    level: 'Advanced',
    n: 3,
    cols: [
      [['RY', [0], 0.3 * Math.PI]],
      [['RZ', [0], 0.7 * Math.PI]],
      [['H', [1]]],
      [['CX', [1, 2]]],
      [['CX', [0, 1]]],
      [['H', [0]]],
      [['CX', [1, 2]]],
      [['CZ', [0, 2]]]
    ],
    description: 'Prepares an unknown state θ=0.3π, φ=0.7π on q0 and teleports it to q2 using a Bell pair and coherent quantum corrections.',
    expected: 'q2 Bloch vector matches original q0: θ=54°, φ=126°'
  }
];
