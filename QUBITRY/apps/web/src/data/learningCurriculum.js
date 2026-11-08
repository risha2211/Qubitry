/**
 * Qubitry Structured Learning Curriculum
 * 5 Comprehensive Learning Paths with 44 Scientifically Accurate Lessons
 */

export const TOPICS = [
  { id: 'foundations', title: 'Quantum Foundations', pathId: 'path-1', lessonId: 'p1-l1', count: 10 },
  { id: 'math', title: 'Mathematical Foundations', pathId: 'path-1', lessonId: 'p1-l3', count: 8 },
  { id: 'gates', title: 'Quantum Gates', pathId: 'path-2', lessonId: 'p2-l1', count: 8 },
  { id: 'circuits', title: 'Quantum Circuits', pathId: 'path-2', lessonId: 'p2-l7', count: 6 },
  { id: 'superposition', title: 'Superposition & Measurement', pathId: 'path-1', lessonId: 'p1-l4', count: 8 },
  { id: 'entanglement', title: 'Entanglement', pathId: 'path-3', lessonId: 'p3-l1', count: 8 },
  { id: 'algorithms', title: 'Quantum Algorithms', pathId: 'path-4', lessonId: 'p4-l1', count: 10 },
  { id: 'info-theory', title: 'Quantum Information Theory', pathId: 'path-3', lessonId: 'p3-l6', count: 6 },
  { id: 'cryptography', title: 'Quantum Cryptography', pathId: 'path-5', lessonId: 'p5-l1', count: 8 },
  { id: 'qec', title: 'Quantum Error Correction', pathId: 'path-5', lessonId: 'p5-l6', count: 6 }
];

export const LEARNING_PATHS = [
  {
    id: 'path-1',
    number: '01',
    title: 'Foundations of Quantum Computing',
    description: 'Fundamental principles of quantum information, Dirac bra-ket notation, state vectors, superposition, and measurement.',
    level: 'Beginner',
    lessonCount: 10,
    estimatedDuration: '3–4 hours',
    lessons: [
      {
        id: 'p1-l1',
        number: 1,
        title: 'Introduction to Quantum Computing',
        duration: '15 mins',
        summary: 'The physical motivation for quantum computing, Moore’s law limits, and quantum speedup.',
        concept: `Classical computers manipulate information encoded into discrete binary digits (bits) taking values 0 or 1. Quantum computers process information utilizing quantum mechanical phenomena—principally superposition, quantum interference, and entanglement.

Pioneered by Richard Feynman and David Deutsch, quantum computing was conceived when physicists observed that simulating quantum physical systems on classical hardware suffers an exponential scaling bottleneck: an n-particle system requires 2ⁿ complex state amplitudes. A computer operating on quantum mechanical principles can simulate nature intrinsically and solve select computational classes exponentially faster.`,
        math: `A classical n-bit register exists in exactly one state s ∈ {0, 1}ⁿ at any moment:
s = (b₀, b₁, ..., bₙ₋₁)

In contrast, an n-qubit quantum state |ψ⟩ exists in a 2ⁿ-dimensional complex Hilbert space ℂ^(2ⁿ):
|ψ⟩ = ∑_{x=0}^{2ⁿ-1} c_x |x⟩,   where c_x ∈ ℂ,  ∑_{x} |c_x|² = 1`,
        interactive: { type: 'bloch', theta: 0, phi: 0, label: '|0⟩ Ground State' },
        demonstration: {
          title: 'Initialization in Ground State |0⟩',
          description: 'A newly initialized quantum wire starts in the computational ground state |0⟩.',
          circuit: { n: 1, ops: [] },
          expectedState: '|0⟩ = 1.0|0⟩ + 0.0|1⟩',
          expectedProbabilities: 'P(0) = 100%, P(1) = 0%'
        },
        takeaways: [
          'Quantum computing uses quantum mechanical properties (superposition, interference, entanglement).',
          'An n-qubit register holds 2ⁿ simultaneous complex amplitudes.',
          'Physical quantum systems operate reversibly prior to measurement.'
        ]
      },
      {
        id: 'p1-l2',
        number: 2,
        title: 'Classical Bits vs Quantum Bits',
        duration: '20 mins',
        summary: 'Comparing discrete deterministic bits against continuous Hilbert space qubit vectors.',
        concept: `A classical bit is discrete and macroscopic: a voltage level representing 0 (low) or 1 (high). Qubits are two-level quantum systems—such as the spin of an electron (spin-up / spin-down), the polarization of a photon (horizontal / vertical), or energy levels of a superconducting transmon.

While a bit is restricted to the two poles {0, 1}, a qubit state can point to any coordinate on the surface of the three-dimensional Bloch sphere.`,
        math: `Computational basis states in matrix vector form:
|0⟩ = [1, 0]ᵀ,    |1⟩ = [0, 1]ᵀ

General single-qubit pure state:
|ψ⟩ = α|0⟩ + β|1⟩ = [α, β]ᵀ

Normalization condition:
|α|² + |β|² = 1   ⟹   ⟨ψ|ψ⟩ = α*α + β*β = 1`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: 'Superposition State |+⟩' },
        demonstration: {
          title: 'Bit Flip: From |0⟩ to |1⟩ with Pauli-X',
          description: 'Applying a Pauli-X (NOT) gate flips computational state |0⟩ to |1⟩.',
          circuit: { n: 1, ops: [{ g: 'X', q: [0], s: 0, id: 1 }] },
          expectedState: '|1⟩ = 0.0|0⟩ + 1.0|1⟩',
          expectedProbabilities: 'P(0) = 0%, P(1) = 100%'
        },
        takeaways: [
          'Classical bits take boolean values; qubits have continuous complex amplitudes.',
          'The state vector must always remain normalized to unit length: |α|² + |β|² = 1.',
          'The Pauli-X gate acts as the quantum equivalent of the classical NOT gate.'
        ]
      },
      {
        id: 'p1-l3',
        number: 3,
        title: 'Dirac Notation and Quantum States',
        duration: '25 mins',
        summary: 'Bra-ket notation, inner products, outer products, and Hilbert space vector algebra.',
        concept: `Paul Dirac introduced the bracket (bra-ket) notation to represent vectors and dual vectors in complex Hilbert space:
- **Ket |ψ⟩**: A column vector representing a quantum state.
- **Bra ⟨ψ|**: The conjugate-transpose (Hermitian adjoint) row vector: ⟨ψ| = (|ψ⟩)† = (α*, β*).
- **Inner Product ⟨ϕ|ψ⟩**: A complex number measuring the overlap (projection) of two states.
- **Outer Product |ϕ⟩⟨ψ|**: A linear operator / matrix.`,
        math: `Inner Product:
⟨ϕ|ψ⟩ = [c₀*, c₁*] · [d₀, d₁]ᵀ = c₀* d₀ + c₁* d₁

Orthonormality of computational basis:
⟨0|0⟩ = 1,   ⟨1|1⟩ = 1,   ⟨0|1⟩ = 0,   ⟨1|0⟩ = 0

Outer Product Projectors:
P₀ = |0⟩⟨0| = [[1, 0], [0, 0]]
P₁ = |1⟩⟨1| = [[0, 0], [0, 1]]
Completeness relation: |0⟩⟨0| + |1⟩⟨1| = I`,
        interactive: { type: 'bloch', theta: Math.PI, phi: 0, label: '|1⟩ State' },
        demonstration: {
          title: 'State Overlap and Projection',
          description: 'Verify computational basis state |0⟩ orthogonality with |1⟩.',
          circuit: { n: 1, ops: [{ g: 'X', q: [0], s: 0, id: 1 }, { g: 'X', q: [0], s: 1, id: 2 }] },
          expectedState: '|0⟩ (X² = I)',
          expectedProbabilities: 'P(0) = 100%, P(1) = 0%'
        },
        takeaways: [
          'Kets are column vectors; Bras are conjugate-transpose row vectors.',
          'Orthonormal states have zero inner product: ⟨0|1⟩ = 0.',
          'Outer products form projection operators whose sum equals the identity matrix.'
        ]
      },
      {
        id: 'p1-l4',
        number: 4,
        title: 'Superposition',
        duration: '25 mins',
        summary: 'The superposition principle, quantum interference, and equal probability states.',
        concept: `Superposition is a fundamental property allowing a quantum state to be a linear combination of basis states. When a Hadamard gate (H) is applied to |0⟩, it creates an equal superposition:

|+⟩ = (|0⟩ + |1⟩) / √2

Superposition is not classical ignorance or a hidden coin toss. Amplitudes can constructively or destructively interfere, which is the foundational resource behind quantum computational algorithms.`,
        math: `Hadamard transformation:
H|0⟩ = (|0⟩ + |1⟩)/√2 = |+⟩
H|1⟩ = (|0⟩ - |1⟩)/√2 = |-⟩

Equal amplitudes with opposite relative phase:
|+⟩: α = 1/√2, β = 1/√2  ⟹  P(0) = 1/2, P(1) = 1/2
|-⟩: α = 1/√2, β = -1/√2 ⟹  P(0) = 1/2, P(1) = 1/2`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: '|+⟩ State' },
        demonstration: {
          title: 'Hadamard Superposition Creation',
          description: 'Hadamard transforms |0⟩ into equal superposition |+⟩.',
          circuit: { n: 1, ops: [{ g: 'H', q: [0], s: 0, id: 1 }] },
          expectedState: '|+⟩ = (|0⟩ + |1⟩)/√2 ≈ 0.7071|0⟩ + 0.7071|1⟩',
          expectedProbabilities: 'P(0) = 50.0%, P(1) = 50.0%'
        },
        takeaways: [
          'Superposition allows linear combinations of states with complex amplitudes.',
          'Relative phase between amplitudes enables constructive and destructive interference.',
          'Hadamard is an involutory unitary operator: H² = I.'
        ]
      },
      {
        id: 'p1-l5',
        number: 5,
        title: 'The Bloch Sphere',
        duration: '25 mins',
        summary: 'Geometric representation of pure qubit states as points on a unit sphere S².',
        concept: `Any single-qubit pure state can be mapped to a point on the surface of a unit sphere in ℝ³ called the **Bloch Sphere**. Because global phase e^(iγ) has no observable physical consequences, any normalized state can be parameterized by two real angles: polar angle θ ∈ [0, π] and azimuthal angle φ ∈ [0, 2π).

- North Pole (θ = 0): |0⟩
- South Pole (θ = π): |1⟩
- Equator (θ = π/2): Superpositions |+⟩, |-⟩, |i+⟩, |i-⟩`,
        math: `Bloch Parameterization:
|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ) sin(θ/2)|1⟩

Bloch Vector components r = (r_x, r_y, r_z):
r_x = sin(θ) cos(φ) = 2 Re(α* β)
r_y = sin(θ) sin(φ) = 2 Im(α* β)
r_z = cos(θ)        = |α|² - |β|²

For any pure state: |r|² = r_x² + r_y² + r_z² = 1.`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0.5 * Math.PI, label: '|i⟩ State (Y-axis)' },
        demonstration: {
          title: 'Rotation to Equator with S Gate',
          description: 'Hadamard followed by Phase S rotates state vector to the positive Y axis.',
          circuit: { n: 1, ops: [{ g: 'H', q: [0], s: 0, id: 1 }, { g: 'S', q: [0], s: 1, id: 2 }] },
          expectedState: '|i⟩ = (|0⟩ + i|1⟩)/√2 (Bloch: θ=π/2, φ=π/2)',
          expectedProbabilities: 'P(0) = 50%, P(1) = 50%'
        },
        takeaways: [
          'The Bloch sphere visualizes all single-qubit pure states geometrically.',
          'Polar angle θ controls computational basis probability: P(0) = cos²(θ/2).',
          'Azimuthal angle φ encodes quantum relative phase.'
        ]
      },
      {
        id: 'p1-l6',
        number: 6,
        title: 'Quantum Measurement and the Born Rule',
        duration: '25 mins',
        summary: 'Projective measurement, state collapse, probabilistic outcomes, and the Born rule.',
        concept: `Measurement bridges the quantum world with classical observation. Unlike unitary evolution, measurement is fundamentally irreversible and non-unitary.

According to Max Born's rule (1926), when an observable is measured, the system stochastically collapses to an eigenstate with probability proportional to the squared magnitude of its amplitude.`,
        math: `Born Rule for state |ψ⟩ = α|0⟩ + β|1⟩:
P(0) = |⟨0|ψ⟩|² = |α|²
P(1) = |⟨1|ψ⟩|² = |β|²

State post-measurement upon observing outcome '0':
|ψ'⟩ = P₀|ψ⟩ / √P(0) = α/|α| |0⟩  ≡  |0⟩ (up to global phase)`,
        interactive: { type: 'bloch', theta: 0.3 * Math.PI, phi: 0, label: 'Unbalanced Superposition' },
        demonstration: {
          title: 'Superposition Collapse with Measurement',
          description: 'Measure qubit after Hadamard gate to observe projection into classical bit.',
          circuit: { n: 1, ops: [{ g: 'H', q: [0], s: 0, id: 1 }, { g: 'M', q: [0], s: 1, id: 2 }] },
          expectedState: 'Collapsed to |0⟩ or |1⟩ with Born probability 0.5',
          expectedProbabilities: 'P(0) = 50%, P(1) = 50%'
        },
        takeaways: [
          'The Born rule dictates that measurement outcome probability is |amplitude|².',
          'Measurement causes wavefunction collapse to the observed eigenstate.',
          'Expectation value of Pauli-Z is ⟨Z⟩ = P(0) - P(1).'
        ]
      },
      {
        id: 'p1-l7',
        number: 7,
        title: 'Introduction to Quantum Gates',
        duration: '20 mins',
        summary: 'Quantum logic gates as unitary operations and rotation matrices on the Bloch sphere.',
        concept: `Quantum logic circuits are constructed from discrete quantum gates that transform quantum states. While classical circuits use irreversibility (e.g., AND, OR have 2 inputs and 1 output), quantum operations preserve information and must have equal numbers of input and output qubits.`,
        math: `Matrix Representations:
I = [[1, 0], [0, 1]]
X = [[0, 1], [1, 0]]
Y = [[0, -i], [i, 0]]
Z = [[1, 0], [0, -1]]
H = 1/√2 [[1, 1], [1, -1]]`,
        interactive: { type: 'bloch', theta: Math.PI, phi: 0, label: '|1⟩ State' },
        demonstration: {
          title: 'Pauli-Z Phase Flip',
          description: 'Pauli-Z flips the relative phase of |1⟩ without changing measurement probabilities.',
          circuit: { n: 1, ops: [{ g: 'H', q: [0], s: 0, id: 1 }, { g: 'Z', q: [0], s: 1, id: 2 }] },
          expectedState: '|-⟩ = (|0⟩ - |1⟩)/√2',
          expectedProbabilities: 'P(0) = 50%, P(1) = 50%'
        },
        takeaways: [
          'Quantum logic gates are represented by square unitary complex matrices.',
          'Pauli-X flips bit values (|0⟩ ↔ |1⟩); Pauli-Z flips relative phase (|1⟩ ↦ -|1⟩).',
          'Applying Z to |+⟩ transforms it to |-⟩.'
        ]
      },
      {
        id: 'p1-l8',
        number: 8,
        title: 'Unitary Evolution',
        duration: '20 mins',
        summary: 'Schrödinger equation, unitarity condition U†U = I, norm preservation, and reversibility.',
        concept: `Every closed quantum mechanical process is described by unitary evolution governed by the Schrödinger equation:
iℏ ∂|ψ⟩/∂t = H |ψ⟩

A linear operator U is unitary if and only if its adjoint equals its inverse:
U† U = U U† = I

Unitarity guarantees that total probability remains 100% across all time steps and that operations can always be mathematically reversed by applying U†.`,
        math: `Norm preservation:
⟨Uψ|Uψ⟩ = ⟨ψ|U† U|ψ⟩ = ⟨ψ|I|ψ⟩ = ⟨ψ|ψ⟩ = 1

Reversibility:
If |ψ'⟩ = U|ψ⟩, then |ψ⟩ = U† |ψ'⟩`,
        interactive: { type: 'bloch', theta: 0, phi: 0, label: 'Identity / Restored State' },
        demonstration: {
          title: 'Gate Reversal: H followed by H',
          description: 'H is self-inverse (H = H†); applying H twice restores original state |0⟩.',
          circuit: { n: 1, ops: [{ g: 'H', q: [0], s: 0, id: 1 }, { g: 'H', q: [0], s: 1, id: 2 }] },
          expectedState: '|0⟩ (H · H = I)',
          expectedProbabilities: 'P(0) = 100%, P(1) = 0%'
        },
        takeaways: [
          'Unitary matrices preserve the inner product and Euclidean norm of quantum states.',
          'All non-measurement quantum operations are strictly reversible.',
          'Many common gates (H, X, Y, Z, CNOT) are Hermitian and involutory: U² = I.'
        ]
      },
      {
        id: 'p1-l9',
        number: 9,
        title: 'Introduction to Multi-Qubit Systems',
        duration: '25 mins',
        summary: 'Tensor products, composite Hilbert space ℂ² ⊗ ℂ², and product state representation.',
        concept: `To scale computational capacity, multiple qubits are combined via the **Kronecker tensor product** (⊗). While a single qubit has 2 basis states, two qubits span 4 basis states: {|00⟩, |01⟩, |10⟩, |11⟩}.

For n qubits, the state space dimension scales exponentially as 2ⁿ, which allows a 50-qubit system to span over 1 quadrillion state amplitudes simultaneously.`,
        math: `Tensor Product of two basis vectors:
|0⟩ ⊗ |0⟩ = [1, 0]ᵀ ⊗ [1, 0]ᵀ = [1, 0, 0, 0]ᵀ = |00⟩
|0⟩ ⊗ |1⟩ = [0, 1, 0, 0]ᵀ = |01⟩
|1⟩ ⊗ |0⟩ = [0, 0, 1, 0]ᵀ = |10⟩
|1⟩ ⊗ |1⟩ = [0, 0, 0, 1]ᵀ = |11⟩

Two-qubit product state:
|ψ⟩ = (α|0⟩ + β|1⟩) ⊗ (γ|0⟩ + δ|1⟩) = αγ|00⟩ + αδ|01⟩ + βγ|10⟩ + βδ|11⟩`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: 'Qubit 0 in |+⟩' },
        demonstration: {
          title: '2-Qubit Product Superposition State |++⟩',
          description: 'Apply independent Hadamard gates to wires q0 and q1.',
          circuit: { n: 2, ops: [{ g: 'H', q: [0], s: 0, id: 1 }, { g: 'H', q: [1], s: 0, id: 2 }] },
          expectedState: '|++⟩ = 1/2 (|00⟩ + |01⟩ + |10⟩ + |11⟩)',
          expectedProbabilities: 'P(00)=25%, P(01)=25%, P(10)=25%, P(11)=25%'
        },
        takeaways: [
          'Multiple qubits combine via tensor product: H_total = H₁ ⊗ H₂ ⊗ ... ⊗ Hₙ.',
          'Dimension of state space grows exponentially as 2ⁿ.',
          'Product states can be factored into individual single-qubit states.'
        ]
      },
      {
        id: 'p1-l10',
        number: 10,
        title: 'Knowledge Check: Quantum Foundations',
        duration: '15 mins',
        summary: 'Synthesize core concepts from Path 01 with review questions and summary benchmarks.',
        concept: `Congratulations on completing the core concepts of Path 01! You have mastered:
1. Difference between classical discrete bits and quantum statevectors.
2. Dirac bra-ket formalism and inner product normalization.
3. Creation and interpretation of quantum superposition.
4. Bloch sphere geometry and coordinate transformations.
5. The Born measurement rule and state collapse.
6. Unitary evolution and composite multi-qubit tensor product spaces.`,
        math: `Summary of Key Equations:
- Single-qubit state: |ψ⟩ = α|0⟩ + β|1⟩,   |α|² + |β|² = 1
- Bloch sphere: |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ) sin(θ/2)|1⟩
- Born Rule: P(x) = |⟨x|ψ⟩|²
- Unitarity: U† U = I
- Hadamard: H|0⟩ = |+⟩, H|1⟩ = |-⟩`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: 'Foundations Mastered' },
        demonstration: {
          title: 'Complete Single Qubit Exploration',
          description: 'Hadamard followed by S gate and Pauli-X gate.',
          circuit: { n: 1, ops: [{ g: 'H', q: [0], s: 0, id: 1 }, { g: 'S', q: [0], s: 1, id: 2 }, { g: 'X', q: [0], s: 2, id: 3 }] },
          expectedState: 'Rotated superposition vector on Bloch equator',
          expectedProbabilities: 'P(0) = 50%, P(1) = 50%'
        },
        takeaways: [
          'You are ready to advance to Path 02: Quantum Gates & Circuit Construction.',
          'Complete the Foundations Quiz in the Exercises section to verify mastery.',
          'Practice building your own single-qubit rotations in Circuit Studio.'
        ]
      }
    ]
  },
  {
    id: 'path-2',
    number: '02',
    title: 'Quantum Gates & Circuit Construction',
    description: 'Master single and multi-qubit gates, parameterized rotations (RX, RY, RZ), CNOT, SWAP, and circuit depth optimization.',
    level: 'Beginner to Intermediate',
    lessonCount: 8,
    estimatedDuration: '3 hours',
    lessons: [
      {
        id: 'p2-l1',
        number: 1,
        title: 'Identity and Pauli Gates',
        duration: '20 mins',
        summary: 'The Pauli group {I, X, Y, Z}, algebraic relations, eigenvalues ±1, and anticommutation.',
        concept: `The Pauli gates (named after Wolfgang Pauli) along with the Identity operator form a basis for all 2×2 Hermitian matrices. Every single-qubit operation can be decomposed as a linear combination of Pauli matrices.

Key properties:
- Hermitian: σ† = σ (observable physical operators).
- Unitary: σ† σ = I.
- Involutory: σ² = I (applying any Pauli gate twice returns to initial state).
- Anticommutation: {σ_i, σ_j} = 0 for i ≠ j.`,
        math: `Pauli Matrices:
X = [[0, 1], [1, 0]],   Y = [[0, -i], [i, 0]],   Z = [[1, 0], [0, -1]]

Eigenvalues and Eigenvectors:
- Z eigenstates: |0⟩ (eigenvalue +1), |1⟩ (eigenvalue -1)
- X eigenstates: |+⟩ (eigenvalue +1), |-⟩ (eigenvalue -1)
- Y eigenstates: |i+⟩ (eigenvalue +1), |i-⟩ (eigenvalue -1)`,
        interactive: { type: 'bloch', theta: Math.PI, phi: 0, label: 'Pauli-X Bit Flip' },
        demonstration: {
          title: 'Pauli Gates Verification',
          description: 'Applying X, then Y, then Z to demonstrate phase and bit changes.',
          circuit: { n: 1, ops: [{ g: 'X', q: [0], s: 0, id: 1 }, { g: 'Z', q: [0], s: 1, id: 2 }] },
          expectedState: '-|1⟩ (Eigenstate of Z with eigenvalue -1)',
          expectedProbabilities: 'P(0) = 0%, P(1) = 100%'
        },
        takeaways: [
          'Pauli matrices have eigenvalues +1 and -1.',
          'Applying X performs a bit flip; applying Z performs a phase flip.',
          'X, Y, and Z satisfy XY = iZ, YZ = iX, ZX = iY.'
        ]
      },
      {
        id: 'p2-l2',
        number: 2,
        title: 'Hadamard Gate',
        duration: '20 mins',
        summary: 'The Hadamard transformation: basis change between Z-basis and X-basis.',
        concept: `The Hadamard gate is the most celebrated single-qubit gate in quantum computing. Geometrically, it represents a 180° rotation of the Bloch sphere about the diagonal axis (X + Z) / √2.

It acts as a bidirectional bridge transforming computational basis states {|0⟩, |1⟩} to transversal basis states {|+⟩, |-⟩}.`,
        math: `Matrix:
H = 1/√2 [[1, 1], [1, -1]]

Basis transformations:
H|0⟩ = |+⟩,   H|1⟩ = |-⟩
H|+⟩ = |0⟩,   H|-⟩ = |1⟩
HXH = Z,      HZH = X`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: '|+⟩ State' },
        demonstration: {
          title: 'Basis Conversion with Hadamard',
          description: 'X gate followed by Hadamard produces |-⟩ state.',
          circuit: { n: 1, ops: [{ g: 'X', q: [0], s: 0, id: 1 }, { g: 'H', q: [0], s: 1, id: 2 }] },
          expectedState: '|-⟩ = (|0⟩ - |1⟩)/√2',
          expectedProbabilities: 'P(0) = 50%, P(1) = 50%'
        },
        takeaways: [
          'Hadamard converts between the Z-basis and the X-basis.',
          'HXH = Z and HZH = X allows converting phase flips to bit flips.',
          'Applying H creates equal superposition from computational basis inputs.'
        ]
      },
      {
        id: 'p2-l3',
        number: 3,
        title: 'Phase Gates: S and T',
        duration: '25 mins',
        summary: 'Quarter-turn S gate (√Z) and eighth-turn T gate (⁴√Z), fault-tolerant universal sets.',
        concept: `Phase gates apply a phase shift to computational state |1⟩ while leaving |0⟩ unchanged.
- **S Gate**: Also known as Phase P(π/2), satisfies S² = Z (a quarter turn around the Z axis).
- **T Gate**: Also known as π/8 gate, satisfies T² = S and T⁴ = Z.

By the Solovay-Kitaev theorem, the set {H, S, T, CNOT} forms a **universal quantum gate set**, capable of approximating any n-qubit unitary operator to arbitrary precision ε.`,
        math: `Phase matrices:
S = [[1, 0], [0, i]] = diag(1, e^(iπ/2))
T = [[1, 0], [0, e^(iπ/4)]] = diag(1, e^(iπ/4))

Adjoints (inverse gates):
S† = diag(1, -i)
T† = diag(1, e^(-iπ/4))`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0.25 * Math.PI, label: 'T-Gate Rotated State' },
        demonstration: {
          title: 'T Gate Phase Rotation',
          description: 'Hadamard followed by T gate sets relative phase to π/4.',
          circuit: { n: 1, ops: [{ g: 'H', q: [0], s: 0, id: 1 }, { g: 'T', q: [0], s: 1, id: 2 }] },
          expectedState: '1/√2 |0⟩ + (1/√2 e^(iπ/4)) |1⟩',
          expectedProbabilities: 'P(0) = 50%, P(1) = 50%'
        },
        takeaways: [
          'S applies a 90° rotation around the Z axis; T applies a 45° rotation.',
          'Phase gates do not alter measurement probabilities in the computational basis.',
          '{H, T, CNOT} forms the Clifford+T universal gate library used in fault-tolerant quantum computing.'
        ]
      },
      {
        id: 'p2-l4',
        number: 4,
        title: 'Rotation Gates: RX, RY and RZ',
        duration: '25 mins',
        summary: 'Continuous parameter rotations about X, Y, and Z axes on the Bloch sphere.',
        concept: `In variational quantum algorithms (like VQE and QAOA) and quantum machine learning, gates are parameterized by continuous rotation angles θ ∈ [0, 2π].

These rotations are generated by exponentiating the Pauli matrices:
R_n(θ) = exp(-i θ/2 (n · σ))`,
        math: `Rotation Matrices:
RX(θ) = [[cos(θ/2), -i sin(θ/2)], [-i sin(θ/2), cos(θ/2)]]
RY(θ) = [[cos(θ/2), -sin(θ/2)], [sin(θ/2), cos(θ/2)]]
RZ(θ) = [[e^(-i θ/2), 0], [0, e^(i θ/2)]]

Euler Angle Decomposition:
Any single-qubit unitary U can be decomposed as U = e^(iα) RZ(β) RY(γ) RZ(δ).`,
        interactive: { type: 'bloch', theta: 0.25 * Math.PI, phi: 0, label: 'RY(π/4) State' },
        demonstration: {
          title: 'Continuous Rotation with RY Gate',
          description: 'RY(π/3) rotates state vector toward |1⟩ with specific Born probabilities.',
          circuit: { n: 1, ops: [{ g: 'RY', q: [0], s: 0, p: Math.PI / 3, id: 1 }] },
          expectedState: 'cos(π/6)|0⟩ + sin(π/6)|1⟩ ≈ 0.866|0⟩ + 0.500|1⟩',
          expectedProbabilities: 'P(0) = 75.0%, P(1) = 25.0%'
        },
        takeaways: [
          'RX, RY, and RZ allow arbitrary continuous angle rotations.',
          'RY rotates within the real plane without introducing imaginary phase components.',
          'Any single-qubit unitary can be synthesized using Euler angle rotations.'
        ]
      },
      {
        id: 'p2-l5',
        number: 5,
        title: 'Controlled Gates: CNOT, CZ and Controlled Phase',
        duration: '25 mins',
        summary: 'Two-qubit conditional operations: CNOT, CZ, CP, and conditional phase kickback.',
        concept: `Multi-qubit computing requires conditional interaction. A controlled gate applies an operation to a target qubit if and only if the control qubit is in state |1⟩.

The **Controlled-NOT (CNOT / CX)** flips the target qubit when the control is |1⟩. It is the fundamental entangling gate in quantum computation.`,
        math: `CNOT Matrix (Control: q0, Target: q1):
CX = [[1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 1],
      [0, 0, 1, 0]]

Action on computational basis:
|00⟩ ↦ |00⟩,   |01⟩ ↦ |01⟩,   |10⟩ ↦ |11⟩,   |11⟩ ↦ |10⟩

Controlled-Z:
CZ = diag(1, 1, 1, -1)   ⟹   Flips sign only on |11⟩.`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: 'Control Qubit' },
        demonstration: {
          title: 'CNOT Conditional Inversion',
          description: 'When q0 is flipped with X, CNOT inverts q1 from |0⟩ to |1⟩.',
          circuit: { n: 2, ops: [{ g: 'X', q: [0], s: 0, id: 1 }, { g: 'CX', q: [0, 1], s: 1, id: 2 }] },
          expectedState: '|11⟩',
          expectedProbabilities: 'P(11) = 100%, others = 0%'
        },
        takeaways: [
          'CNOT performs conditional bit-flip on target if control is |1⟩.',
          'Controlled-Z (CZ) is symmetric between control and target qubits: CZ = (I ⊗ H) CX (I ⊗ H).',
          'Phase kickback: When target is |-⟩, the target eigenvalue kicks back onto the control qubit.'
        ]
      },
      {
        id: 'p2-l6',
        number: 6,
        title: 'SWAP and Multi-Qubit Operations',
        duration: '20 mins',
        summary: 'SWAP gate decomposition using 3 CNOTs, Toffoli (CCX), and Fredkin (CSWAP).',
        concept: `Physical quantum processors have limited qubit connectivity. Moving quantum information between non-adjacent hardware qubits requires the **SWAP gate**.

Three-qubit gates like the **Toffoli (CCNOT)** and **Fredkin (Controlled-SWAP)** gates are universal for reversible classical computation.`,
        math: `SWAP Matrix:
SWAP = [[1, 0, 0, 0], [0, 0, 1, 0], [0, 1, 0, 0], [0, 0, 0, 1]]

Decomposition into 3 CNOT gates:
SWAP(a, b) = CX(a, b) · CX(b, a) · CX(a, b)

Toffoli Gate:
CCX|c₁, c₂, t⟩ = |c₁, c₂, t ⊕ (c₁ · c₂)⟩`,
        interactive: { type: 'bloch', theta: Math.PI, phi: 0, label: 'Swapped Target' },
        demonstration: {
          title: 'SWAP Gate State Exchange',
          description: 'Prepares |10⟩ and applies SWAP to exchange states to |01⟩.',
          circuit: { n: 2, ops: [{ g: 'X', q: [0], s: 0, id: 1 }, { g: 'SWAP', q: [0, 1], s: 1, id: 2 }] },
          expectedState: '|01⟩',
          expectedProbabilities: 'P(01) = 100%'
        },
        takeaways: [
          'SWAP interchanges the quantum states of two wires: |ab⟩ ↦ |ba⟩.',
          'SWAP decomposes efficiently into three alternating CNOT gates.',
          'Toffoli (CCX) and Fredkin (CSWAP) are universal reversible gates.'
        ]
      },
      {
        id: 'p2-l7',
        number: 7,
        title: 'Building and Analyzing Quantum Circuits',
        duration: '25 mins',
        summary: 'Moments, circuit depth, gate count, parallel execution, and commutativity rules.',
        concept: `A quantum circuit is a sequence of discrete moments (time steps). Two gates operating on disjoint qubit wires can execute simultaneously in parallel.

- **Circuit Width**: Number of qubits n.
- **Circuit Depth**: Total number of execution moments.
- **Gate Count**: Total number of elementary operations.
Minimizing depth is essential on NISQ hardware to prevent quantum decoherence.`,
        math: `Commutation Rules:
- Gates on disjoint qubits commute: [A ⊗ I, I ⊗ B] = 0
- Control gates commute if they share control wires: [CX(0, 1), CX(0, 2)] = 0
- Gates sharing target wires generally do NOT commute: [CX(0, 1), CX(2, 1)] ≠ 0`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: 'Parallel Hadamard' },
        demonstration: {
          title: 'Parallel Circuit Execution',
          description: 'Simultaneous moments on 3 qubits to achieve depth 2.',
          circuit: {
            n: 3,
            ops: [
              { g: 'H', q: [0], s: 0, id: 1 },
              { g: 'H', q: [1], s: 0, id: 2 },
              { g: 'H', q: [2], s: 0, id: 3 },
              { g: 'CX', q: [0, 1], s: 1, id: 4 },
              { g: 'CX', q: [1, 2], s: 2, id: 5 }
            ]
          },
          expectedState: 'Entangled 3-qubit state with depth 3',
          expectedProbabilities: 'Structured entangled distribution'
        },
        takeaways: [
          'Circuit depth dictates execution time before environmental decoherence corrupts state.',
          'Parallel gates on distinct wires execute in the same time moment.',
          'Commutativity rules allow optimizing and compressing circuit layers.'
        ]
      },
      {
        id: 'p2-l8',
        number: 8,
        title: 'Practical Challenge: Circuit Construction',
        duration: '20 mins',
        summary: 'Comprehensive circuit assembly challenge synthesizing single and multi-qubit gates.',
        concept: `Put your gate construction knowledge to the test. Combine single-qubit rotations, Hadamard superposition, and entangling CNOT operations into a coherent quantum circuit.`,
        math: `Target: Transform initial ground state |00⟩ into an equal superposition of |00⟩ and |10⟩ with zero amplitude in |01⟩ and |11⟩.`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: 'Target State' },
        demonstration: {
          title: 'Target Circuit Assembly',
          description: 'Hadamard on wire 0 leaves wire 1 in ground state |0⟩.',
          circuit: { n: 2, ops: [{ g: 'H', q: [0], s: 0, id: 1 }] },
          expectedState: '(|00⟩ + |10⟩)/√2',
          expectedProbabilities: 'P(00) = 50%, P(10) = 50%'
        },
        takeaways: [
          'Mastered single and multi-qubit gate application.',
          'Understand circuit depth, parallel gates, and connectivity.',
          'Ready to advance to Path 03: Entanglement & Quantum Information.'
        ]
      }
    ]
  },
  {
    id: 'path-3',
    number: '03',
    title: 'Entanglement & Quantum Information',
    description: 'Explore EPR pairs, Bell states, GHZ states, density matrices, subsystem entropy, and quantum teleportation protocols.',
    level: 'Intermediate',
    lessonCount: 8,
    estimatedDuration: '3–4 hours',
    lessons: [
      {
        id: 'p3-l1',
        number: 1,
        title: 'Introduction to Entanglement',
        duration: '25 mins',
        summary: 'Non-separability of quantum states, Einstein-Podolsky-Rosen (EPR) paradox, and non-locality.',
        concept: `Albert Einstein famously described quantum entanglement as "spooky action at a distance" (spukhafte Fernwirkung). In a composite quantum system, an **entangled state** is one that cannot be factored as a product of individual sub-states:

|ψ⟩ ≠ |ψ_A⟩ ⊗ |ψ_B⟩

Measuring one qubit instantaneously determines the state of the other, regardless of spatial separation, demonstrating fundamental quantum non-locality without violating special relativity (no-signaling theorem).`,
        math: `Product State (Separable):
|ψ⟩ = (|0⟩ + |1⟩)/√2 ⊗ |0⟩ = (|00⟩ + |10⟩)/√2

Entangled State (Non-separable):
|Φ⁺⟩ = (|00⟩ + |11⟩)/√2 ≠ (a|0⟩ + b|1⟩) ⊗ (c|0⟩ + d|1⟩)
Since ac = 1/√2, bd = 1/√2, but ad = 0 and bc = 0, no such complex coefficients exist.`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: 'Entangled Subsystem' },
        demonstration: {
          title: 'Bell State Superposition',
          description: 'Canonical H on q0 followed by CNOT from q0 to q1.',
          circuit: { n: 2, ops: [{ g: 'H', q: [0], s: 0, id: 1 }, { g: 'CX', q: [0, 1], s: 1, id: 2 }] },
          expectedState: '|Φ⁺⟩ = (|00⟩ + |11⟩)/√2',
          expectedProbabilities: 'P(00) = 50%, P(11) = 50%, P(01) = 0%, P(10) = 0%'
        },
        takeaways: [
          'Entangled states cannot be written as tensor products of individual qubit states.',
          'Measurement of one qubit yields perfect correlations with the entangled partner.',
          'No faster-than-light communication is possible (no-signaling theorem).'
        ]
      },
      {
        id: 'p3-l2',
        number: 2,
        title: 'Tensor Products and Composite States',
        duration: '25 mins',
        summary: 'Mathematical mechanics of tensor products, Kronecker products, and operator algebra.',
        concept: `When two independent quantum systems A and B with state spaces H_A and H_B interact, the composite system resides in the tensor product Hilbert space H_A ⊗ H_B.
Dimensions multiply: dim(H_A ⊗ H_B) = dim(H_A) × dim(H_B).`,
        math: `Operator Tensor Product:
(A ⊗ B) (|ψ_A⟩ ⊗ |ψ_B⟩) = (A|ψ_A⟩) ⊗ (B|ψ_B⟩)

Matrix Kronecker Product:
[[a₁₁, a₁₂], [a₂₁, a₂₂]] ⊗ B = [[a₁₁B, a₁₂B], [a₂₁B, a₂₂B]]`,
        interactive: { type: 'bloch', theta: 0, phi: 0, label: 'Composite Ground State' },
        demonstration: {
          title: 'Independent Gate Application',
          description: 'Applying X to wire 0 and H to wire 1 yields product state |1+⟩.',
          circuit: { n: 2, ops: [{ g: 'X', q: [0], s: 0, id: 1 }, { g: 'H', q: [1], s: 0, id: 2 }] },
          expectedState: '|1+⟩ = 1/√2 |10⟩ + 1/√2 |11⟩',
          expectedProbabilities: 'P(10) = 50%, P(11) = 50%'
        },
        takeaways: [
          'Composite state space dimensions multiply exponentially.',
          'Operators act locally on their respective subspaces.',
          'Linearity ensures superposition applies across the full tensor space.'
        ]
      },
      {
        id: 'p3-l3',
        number: 3,
        title: 'Bell States',
        duration: '25 mins',
        summary: 'The 4 maximally entangled Bell basis states {|Φ⁺⟩, |Φ⁻⟩, |Ψ⁺⟩, |Ψ⁻⟩}.',
        concept: `The four Bell states form an orthonormal basis for two qubits called the **Bell basis**. Every Bell state is maximally entangled: measuring either qubit alone yields completely random 50/50 outcomes, yet outcomes between both qubits are 100% correlated or anti-correlated.`,
        math: `The Four Bell States:
|Φ⁺⟩ = (|00⟩ + |11⟩) / √2
|Φ⁻⟩ = (|00⟩ - |11⟩) / √2
|Ψ⁺⟩ = (|01⟩ + |10⟩) / √2
|Ψ⁻⟩ = (|01⟩ - |10⟩) / √2   (Singlet state)`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: 'Bell State Subsystem' },
        demonstration: {
          title: 'Creating |Φ⁻⟩ with Pauli-Z',
          description: 'H on q0, Z on q0, CNOT(q0, q1) produces |Φ⁻⟩.',
          circuit: {
            n: 2,
            ops: [
              { g: 'H', q: [0], s: 0, id: 1 },
              { g: 'Z', q: [0], s: 1, id: 2 },
              { g: 'CX', q: [0, 1], s: 2, id: 3 }
            ]
          },
          expectedState: '|Φ⁻⟩ = (|00⟩ - |11⟩)/√2',
          expectedProbabilities: 'P(00) = 50%, P(11) = 50%'
        },
        takeaways: [
          'The 4 Bell states form a complete orthonormal basis for 2 qubits.',
          'Singlet state |Ψ⁻⟩ is invariant under all identical bilateral rotations U ⊗ U.',
          'Single-qubit Pauli gates on one wire transform between the four Bell states.'
        ]
      },
      {
        id: 'p3-l4',
        number: 4,
        title: 'Creating Bell States Using H and CNOT',
        duration: '25 mins',
        summary: 'Step-by-step entangling circuit analysis and state transformations.',
        concept: `Any of the four Bell states can be prepared from the four computational basis states {|00⟩, |01⟩, |10⟩, |11⟩} using an identical circuit structure: a Hadamard gate on the first qubit followed by a CNOT targeting the second qubit.`,
        math: `Mapping:
|00⟩  ── H ⊗ I ──>  (|0⟩+|1⟩)|0⟩/√2  ── CX ──>  |Φ⁺⟩
|10⟩  ── H ⊗ I ──>  (|0⟩-|1⟩)|0⟩/√2  ── CX ──>  |Φ⁻⟩
|01⟩  ── H ⊗ I ──>  (|0⟩+|1⟩)|1⟩/√2  ── CX ──>  |Ψ⁺⟩
|11⟩  ── H ⊗ I ──>  (|0⟩-|1⟩)|1⟩/√2  ── CX ──>  |Ψ⁻⟩`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: 'Entangled State' },
        demonstration: {
          title: 'Creating |Ψ⁺⟩ from |01⟩',
          description: 'X on q1, H on q0, CNOT(q0, q1) creates |Ψ⁺⟩.',
          circuit: {
            n: 2,
            ops: [
              { g: 'X', q: [1], s: 0, id: 1 },
              { g: 'H', q: [0], s: 1, id: 2 },
              { g: 'CX', q: [0, 1], s: 2, id: 3 }
            ]
          },
          expectedState: '|Ψ⁺⟩ = (|01⟩ + |10⟩)/√2',
          expectedProbabilities: 'P(01) = 50%, P(10) = 50%'
        },
        takeaways: [
          'The H-CNOT circuit entangler is unitary and reversible.',
          'The reverse circuit (CNOT followed by H) is a Bell measurement analyzer.',
          'Input computational bits determine which Bell state is prepared.'
        ]
      },
      {
        id: 'p3-l5',
        number: 5,
        title: 'GHZ States',
        duration: '25 mins',
        summary: 'Multi-qubit maximal entanglement: Greenberger-Horne-Zeilinger states.',
        concept: `The Greenberger-Horne-Zeilinger (GHZ) state extends Bell entanglement to 3 or more qubits. For 3 qubits:

|GHZ⟩ = (|000⟩ + |111⟩) / √2

GHZ states are celebrated for providing an all-or-nothing test against local hidden-variable theories (without statistical inequalities like Bell/CHSH).`,
        math: `3-qubit GHZ State:
|GHZ⟩ = 1/√2 (|000⟩ + |111⟩)

Preparation Algorithm:
1. Initialize |000⟩.
2. Apply H on q0: (|0⟩+|1⟩)|00⟩/√2.
3. Apply CX(0, 1): (|00⟩+|11⟩)|0⟩/√2.
4. Apply CX(1, 2): (|000⟩+|111⟩)/√2.`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: 'GHZ Subsystem' },
        demonstration: {
          title: '3-Qubit GHZ State Preparation',
          description: 'Cascade of 2 CNOT gates following Hadamard creates 3-qubit GHZ state.',
          circuit: {
            n: 3,
            ops: [
              { g: 'H', q: [0], s: 0, id: 1 },
              { g: 'CX', q: [0, 1], s: 1, id: 2 },
              { g: 'CX', q: [1, 2], s: 2, id: 3 }
            ]
          },
          expectedState: '|GHZ⟩ = (|000⟩ + |111⟩)/√2',
          expectedProbabilities: 'P(000) = 50%, P(111) = 50%'
        },
        takeaways: [
          'GHZ represents genuine tripartite (multi-partite) entanglement.',
          'Measuring any single qubit collapses all three qubits to that outcome.',
          'GHZ states are widely utilized in quantum error correction and quantum secret sharing.'
        ]
      },
      {
        id: 'p3-l6',
        number: 6,
        title: 'Reduced Density Matrices',
        duration: '25 mins',
        summary: 'Density operators ρ, pure vs mixed states, partial trace Tr_B(ρ), and purity.',
        concept: `When a subsystem of an entangled system is examined alone, it cannot be described by a statevector; it is in a **mixed state**.
The **density operator** ρ describes both pure and mixed states. To find the state of qubit A, we take the **partial trace** over qubit B:
ρ_A = Tr_B(ρ_AB)`,
        math: `Density Matrix Properties:
1. Hermitian: ρ† = ρ
2. Unit Trace: Tr(ρ) = 1
3. Positive Semi-Definite: ρ ≥ 0

Purity: γ = Tr(ρ²)
- Pure state: γ = 1
- Maximally mixed: γ = 1/d

For Bell state |Φ⁺⟩:
ρ_A = Tr_B(|Φ⁺⟩⟨Φ⁺|) = 1/2 [[1, 0], [0, 1]] = I/2   (Maximally Mixed)`,
        interactive: { type: 'bloch', theta: 0, phi: 0, label: 'Mixed State (Center of Sphere)' },
        demonstration: {
          title: 'Density Matrix of Entangled Pair',
          description: 'Inspect reduced density matrix of Bell state subsystem in studio.',
          circuit: { n: 2, ops: [{ g: 'H', q: [0], s: 0, id: 1 }, { g: 'CX', q: [0, 1], s: 1, id: 2 }] },
          expectedState: 'ρ_A = 0.5 |0⟩⟨0| + 0.5 |1⟩⟨1| (Purity = 0.5, Entropy = 1.0 bit)',
          expectedProbabilities: 'P(00) = 50%, P(11) = 50%'
        },
        takeaways: [
          'An entangled qubit subsystem is in a mixed state with purity < 1.',
          'The Bloch vector for a maximally mixed state has length r = 0 (origin of sphere).',
          'Von Neumann entropy S(ρ) = -Tr(ρ log₂ ρ) measures entanglement entropy.'
        ]
      },
      {
        id: 'p3-l7',
        number: 7,
        title: 'Quantum Correlations and Bell Inequalities',
        duration: '25 mins',
        summary: 'Clauser-Horne-Shimony-Holt (CHSH) inequality, classical bound 2 vs Tsirelson bound 2√2.',
        concept: `John Bell proved in 1964 that no physical theory of local hidden variables can reproduce all quantum predictions. In 1969, the CHSH inequality formalized this into an experimental test:

For any local hidden variable theory: |S| ≤ 2.
Quantum mechanics predicts a maximum correlation of |S| = 2√2 ≈ 2.828 (Tsirelson's bound).`,
        math: `CHSH Parameter:
S = E(a, b) - E(a, b') + E(a', b) + E(a', b')

Classical Local Realistic Limit: |S| ≤ 2
Quantum Maximum: |S_quantum| = 2√2 ≈ 2.828`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: 'CHSH Correlation Angle' },
        demonstration: {
          title: 'CHSH Entangled Measurement Setup',
          description: 'Bell state preparation with measurement basis rotation.',
          circuit: {
            n: 2,
            ops: [
              { g: 'H', q: [0], s: 0, id: 1 },
              { g: 'CX', q: [0, 1], s: 1, id: 2 },
              { g: 'RY', q: [1], s: 2, p: Math.PI / 4, id: 3 }
            ]
          },
          expectedState: 'CHSH optimal measurement configuration',
          expectedProbabilities: 'Correlated quantum probabilities violating classical bound'
        },
        takeaways: [
          'Bell test experiments rule out local hidden-variable realism.',
          'Quantum correlations exceed classical limits up to Tsirelson\'s bound 2√2.',
          'Aspect, Clauser, and Zeilinger won the 2022 Nobel Prize in Physics for Bell test proofs.'
        ]
      },
      {
        id: 'p3-l8',
        number: 8,
        title: 'Practical Challenge: Entangled State Construction',
        duration: '25 mins',
        summary: 'Construct and verify a specific entangled Bell pair and calculate its entanglement entropy.',
        concept: `Apply your entanglement knowledge to synthesize the Singlet state |Ψ⁻⟩ = (|01⟩ - |10⟩)/√2 and verify that its subsystem entropy is exactly 1.0 bit.`,
        math: `Target: |Ψ⁻⟩ = 1/√2 (|01⟩ - |10⟩)`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: 'Singlet State' },
        demonstration: {
          title: 'Singlet State Preparation',
          description: 'X on q0, X on q1, H on q0, CNOT(q0, q1), Z on q0 produces |Ψ⁻⟩.',
          circuit: {
            n: 2,
            ops: [
              { g: 'X', q: [0], s: 0, id: 1 },
              { g: 'X', q: [1], s: 0, id: 2 },
              { g: 'H', q: [0], s: 1, id: 3 },
              { g: 'CX', q: [0, 1], s: 2, id: 4 }
            ]
          },
          expectedState: '|Ψ⁻⟩ = (|01⟩ - |10⟩)/√2',
          expectedProbabilities: 'P(01) = 50%, P(10) = 50%'
        },
        takeaways: [
          'Singlet state is rotationally invariant and anti-correlated.',
          'Mastered bipartite and tripartite entanglement creation.',
          'Ready to advance to Path 04: Quantum Algorithms.'
        ]
      }
    ]
  },
  {
    id: 'path-4',
    number: '04',
    title: 'Quantum Algorithms',
    description: 'Study quantum oracles, phase kickback, Deutsch-Jozsa, Bernstein-Vazirani, Grover’s search, QFT, and Quantum Phase Estimation.',
    level: 'Intermediate to Advanced',
    lessonCount: 10,
    estimatedDuration: '5–6 hours',
    lessons: [
      {
        id: 'p4-l1',
        number: 1,
        title: 'Quantum Parallelism and Interference',
        duration: '25 mins',
        summary: 'Evaluating functions on 2ⁿ inputs simultaneously and using constructive/destructive interference.',
        concept: `A classical computer evaluates a function f(x) on one input at a time. Applying Hadamard gates to n initialized qubits creates a uniform superposition of all 2ⁿ inputs:
1/√(2ⁿ) ∑_{x} |x⟩

Evaluating f on this superposition computes f(x) for all 2ⁿ inputs in a single operational step (**quantum parallelism**). However, measuring this state collapses it to a random single outcome. Quantum algorithms therefore use **quantum interference** to amplify amplitudes of correct answers while cancelling incorrect answers.`,
        math: `Parallel Evaluation:
U_f ( 1/√(2ⁿ) ∑_{x} |x⟩ |0⟩ ) = 1/√(2ⁿ) ∑_{x} |x⟩ |f(x)⟩`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: 'Uniform Superposition' },
        demonstration: {
          title: 'Uniform 2-Qubit Superposition',
          description: 'H on q0 and q1 creates simultaneous superposition of 4 inputs.',
          circuit: { n: 2, ops: [{ g: 'H', q: [0], s: 0, id: 1 }, { g: 'H', q: [1], s: 0, id: 2 }] },
          expectedState: '1/2 (|00⟩ + |01⟩ + |10⟩ + |11⟩)',
          expectedProbabilities: '25% for each basis state'
        },
        takeaways: [
          'Quantum parallelism computes f(x) across 2ⁿ inputs simultaneously.',
          'Quantum interference is required to amplify the probability of desired outcomes.',
          'Algorithms achieve speedup by converting global function properties into measurable phase differences.'
        ]
      },
      {
        id: 'p4-l2',
        number: 2,
        title: 'Quantum Oracles',
        duration: '25 mins',
        summary: 'Bit-oracle vs phase-oracle, reversible function evaluation, and ancilla registers.',
        concept: `A **quantum oracle** is a black-box unitary operator representing a function f: {0, 1}ⁿ → {0, 1}.
- **Bit-Oracle**: U_f |x⟩|y⟩ = |x⟩|y ⊕ f(x)⟩
- **Phase-Oracle**: O_f |x⟩ = (-1)^(f(x)) |x⟩

By preparing the ancilla target qubit in state |-⟩ = (|0⟩ - |1⟩)/√2, the bit-oracle automatically acts as a phase-oracle via **phase kickback**.`,
        math: `Phase Kickback:
U_f |x⟩ |-⟩ = |x⟩ ( |0 ⊕ f(x)⟩ - |1 ⊕ f(x)⟩ ) / √2
If f(x) = 0: |x⟩ |-⟩
If f(x) = 1: |x⟩ (-|-⟩) = -|x⟩ |-⟩
⟹ U_f |x⟩ |-⟩ = (-1)^(f(x)) |x⟩ |-⟩`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: Math.PI, label: '|-⟩ Ancilla State' },
        demonstration: {
          title: 'Phase Kickback Demonstration',
          description: 'Ancilla q1 in |-⟩ kicks phase back onto control q0 via CNOT.',
          circuit: {
            n: 2,
            ops: [
              { g: 'H', q: [0], s: 0, id: 1 },
              { g: 'X', q: [1], s: 0, id: 2 },
              { g: 'H', q: [1], s: 1, id: 3 },
              { g: 'CX', q: [0, 1], s: 2, id: 4 },
              { g: 'H', q: [0], s: 3, id: 5 }
            ]
          },
          expectedState: '|1-⟩ (Control q0 flipped to |1⟩ by kickback)',
          expectedProbabilities: 'P(10) = 50%, P(11) = 50%'
        },
        takeaways: [
          'Bit-oracles compute reversible function evaluations using an ancilla.',
          'Phase kickback transfers the function outcome (-1)^(f(x)) directly into the input register phase.',
          'Oracles provide the core abstraction for Deutsch-Jozsa, Grover, and Simon.'
        ]
      },
      {
        id: 'p4-l3',
        number: 3,
        title: 'Deutsch-Jozsa Algorithm',
        duration: '30 mins',
        summary: 'Determining whether f(x) is constant or balanced in a single query.',
        concept: `The Deutsch-Jozsa algorithm (1992) was the first deterministic quantum algorithm demonstrating an exponential separation over classical deterministic algorithms.

Problem: Given a function f: {0, 1}ⁿ → {0, 1} guaranteed to be either **constant** (same outcome for all inputs) or **balanced** (outputs 0 for half of inputs, 1 for half).
- Classical deterministic requires 2^(n-1) + 1 queries in the worst case.
- Deutsch-Jozsa requires exactly **1 query**.`,
        math: `Algorithm Flow:
1. Initialize |0...0⟩|1⟩.
2. Apply H^(⊗(n+1)): 1/√(2ⁿ) ∑_{x} |x⟩ |-⟩.
3. Query Oracle: 1/√(2ⁿ) ∑_{x} (-1)^(f(x)) |x⟩ |-⟩.
4. Apply H^(⊗n) to input: ∑_{y} ( 1/2ⁿ ∑_{x} (-1)^(f(x) + x·y) ) |y⟩.

For y = 0...0, the amplitude is:
c₀ = 1/2ⁿ ∑_{x} (-1)^(f(x))
- If f is constant: |c₀|² = 1 (measure |0...0⟩ with 100% certainty).
- If f is balanced: c₀ = 0 (measure any non-zero state).`,
        interactive: { type: 'bloch', theta: 0, phi: 0, label: 'Constant = |0⟩' },
        demonstration: {
          title: 'Deutsch-Jozsa Balanced Oracle Test',
          description: '2-qubit Deutsch-Jozsa with balanced oracle (CNOT).',
          circuit: {
            n: 2,
            ops: [
              { g: 'X', q: [1], s: 0, id: 1 },
              { g: 'H', q: [0], s: 1, id: 2 },
              { g: 'H', q: [1], s: 1, id: 3 },
              { g: 'CX', q: [0, 1], s: 2, id: 4 },
              { g: 'H', q: [0], s: 3, id: 5 }
            ]
          },
          expectedState: '|1-⟩ (Non-zero input indicates balanced function)',
          expectedProbabilities: 'Measurement on q0 yields 1 (Balanced)'
        },
        takeaways: [
          'Deutsch-Jozsa solves constant vs balanced in exactly 1 quantum query.',
          'Classical deterministic algorithms require 2^(n-1) + 1 queries.',
          'Relies on constructive interference at |0...0⟩ for constant functions.'
        ]
      },
      {
        id: 'p4-l4',
        number: 4,
        title: 'Bernstein-Vazirani Algorithm',
        duration: '30 mins',
        summary: 'Finding hidden bitstring s · x in 1 query vs n classical queries.',
        concept: `The Bernstein-Vazirani algorithm (1993) finds a hidden bitstring s ∈ {0, 1}ⁿ given an oracle f(x) = s · x = s₀x₀ ⊕ s₁x₁ ⊕ ... ⊕ s_{n-1}x_{n-1} (mod 2).
- Classical: Requires n queries to test each bit individually: f(100...), f(010...), etc.
- Quantum: Solves for all n bits of s in a single query with 100% success probability.`,
        math: `State before final Hadamard:
1/√(2ⁿ) ∑_{x} (-1)^(s · x) |x⟩

Applying H^(⊗n):
H^(⊗n) ( 1/√(2ⁿ) ∑_{x} (-1)^(s · x) |x⟩ ) = |s⟩

The state directly collapses into the exact hidden bitstring s!`,
        interactive: { type: 'bloch', theta: Math.PI, phi: 0, label: 'Hidden Bitstring State' },
        demonstration: {
          title: 'Bernstein-Vazirani Hidden Bitstring s=1',
          description: 'Recovers hidden bitstring s=1 in 1 query.',
          circuit: {
            n: 2,
            ops: [
              { g: 'X', q: [1], s: 0, id: 1 },
              { g: 'H', q: [0], s: 1, id: 2 },
              { g: 'H', q: [1], s: 1, id: 3 },
              { g: 'CX', q: [0, 1], s: 2, id: 4 },
              { g: 'H', q: [0], s: 3, id: 5 }
            ]
          },
          expectedState: '|1⟩ on input wire q0, revealing hidden bit s=1',
          expectedProbabilities: 'P(1) = 100%'
        },
        takeaways: [
          'Bernstein-Vazirani discovers an n-bit secret string in 1 query.',
          'Demonstrates O(1) vs O(n) quantum advantage.',
          'Foundation for Simon’s algorithm and Shor’s algorithm period finding.'
        ]
      },
      {
        id: 'p4-l5',
        number: 5,
        title: 'Simon\'s Algorithm',
        duration: '30 mins',
        summary: 'Exponential speedup for finding period s in f(x) = f(y) ⟺ x ⊕ y ∈ {0, s}.',
        concept: `Simon's algorithm (1994) was the historical inspiration for Shor's factoring algorithm. It demonstrated the first **provable exponential quantum speedup** in the black-box oracle model.
- Classical randomized query complexity: Ω(2^(n/2)) due to the birthday paradox.
- Quantum query complexity: O(n) linear queries.`,
        math: `Given f(x) = f(x ⊕ s).
Measuring the input register yields random vectors y such that:
y · s = 0 (mod 2)

Repeating O(n) times generates n linearly independent equations, which are solved via classical Gaussian elimination over GF(2) to determine s.`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: 'Orthogonal Vector y' },
        demonstration: {
          title: 'Simon Periodicity Step',
          description: 'Superposition entangled with 2-qubit periodic function register.',
          circuit: {
            n: 3,
            ops: [
              { g: 'H', q: [0], s: 0, id: 1 },
              { g: 'H', q: [1], s: 0, id: 2 },
              { g: 'CX', q: [0, 2], s: 1, id: 3 }
            ]
          },
          expectedState: 'Entangled periodic register',
          expectedProbabilities: 'Samples satisfy y · s = 0'
        },
        takeaways: [
          'Simon proved an exponential quantum speedup over randomized classical algorithms.',
          'Uses quantum queries to sample linear equations y · s = 0.',
          'Direct intellectual precursor to Peter Shor’s factoring algorithm.'
        ]
      },
      {
        id: 'p4-l6',
        number: 6,
        title: 'Grover\'s Search',
        duration: '35 mins',
        summary: 'Quadratic speedup for unstructured search in O(√N) iterations.',
        concept: `Searching an unsorted database of N items for a marked item:
- Classical: Requires O(N) queries on average (checking N/2 entries).
- Grover's Search (1996): Finds the marked item in **O(√N)** iterations.

Grover’s algorithm operates by alternating two steps in a 2D plane:
1. **Phase Inversion (Oracle)**: Flips sign of marked state |ω⟩.
2. **Inversion about the Mean (Diffuser)**: Reflects all amplitudes across their average, amplifying |ω⟩.`,
        math: `Grover Diffuser Operator:
D = 2|s⟩⟨s| - I,   where |s⟩ = 1/√N ∑_{x} |x⟩

Optimal Number of Iterations:
R ≈ π/4 √N

Angle of rotation per iteration:
θ ≈ 2/√N radians.`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: 'Grover State Vector' },
        demonstration: {
          title: '2-Qubit Grover Search (Target: |11⟩)',
          description: 'Finds marked item |11⟩ in 1 iteration with 100% probability.',
          circuit: {
            n: 2,
            ops: [
              { g: 'H', q: [0], s: 0, id: 1 },
              { g: 'H', q: [1], s: 0, id: 2 },
              { g: 'CZ', q: [0, 1], s: 1, id: 3 },
              { g: 'H', q: [0], s: 2, id: 4 },
              { g: 'H', q: [1], s: 2, id: 5 },
              { g: 'X', q: [0], s: 3, id: 6 },
              { g: 'X', q: [1], s: 3, id: 7 },
              { g: 'CZ', q: [0, 1], s: 4, id: 8 },
              { g: 'X', q: [0], s: 5, id: 9 },
              { g: 'X', q: [1], s: 5, id: 10 },
              { g: 'H', q: [0], s: 6, id: 11 },
              { g: 'H', q: [1], s: 6, id: 12 }
            ]
          },
          expectedState: '|11⟩ (Amplitude amplified from 25% to 100%)',
          expectedProbabilities: 'P(11) = 100.0%, all others = 0.0%'
        },
        takeaways: [
          'Grover provides a quadratic speedup for any unstructured search problem.',
          'Geometric rotation in a two-dimensional subspace spanned by |ω⟩ and |s⟩.',
          'Over-iterating causes the state to rotate past the target and lowers success probability.'
        ]
      },
      {
        id: 'p4-l7',
        number: 7,
        title: 'Quantum Fourier Transform',
        duration: '30 mins',
        summary: 'The quantum analogue of the Discrete Fourier Transform with O(n²) complexity.',
        concept: `The Quantum Fourier Transform (QFT) transforms quantum amplitude vectors into their frequency spectrum. While the classical Fast Fourier Transform (FFT) requires O(N log N) = O(n 2ⁿ) operations, QFT performs the transformation in only **O(n²)** gates.`,
        math: `QFT Definition on basis state |j⟩:
QFT|j⟩ = 1/√(2ⁿ) ∑_{k=0}^{2ⁿ-1} e^(2πi j k / 2ⁿ) |k⟩

Product representation:
QFT|j₁j₂...jₙ⟩ = 1/√(2ⁿ) (|0⟩ + e^(2πi 0.jₙ) |1⟩) ⊗ ... ⊗ (|0⟩ + e^(2πi 0.j₁j₂...jₙ) |1⟩)`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0.5 * Math.PI, label: 'Fourier State' },
        demonstration: {
          title: '2-Qubit QFT Circuit',
          description: 'Hadamard, Controlled-Phase (CP), and SWAP gate.',
          circuit: {
            n: 2,
            ops: [
              { g: 'H', q: [0], s: 0, id: 1 },
              { g: 'CP', q: [1, 0], s: 1, p: Math.PI / 2, id: 2 },
              { g: 'H', q: [1], s: 2, id: 3 },
              { g: 'SWAP', q: [0, 1], s: 3, id: 4 }
            ]
          },
          expectedState: 'Fourier transformed statevector',
          expectedProbabilities: 'Distributed Fourier phases'
        },
        takeaways: [
          'QFT maps computational basis states to phase representations.',
          'Scales as O(n²) gates compared to classical FFT scaling as O(n 2ⁿ).',
          'Core mathematical engine of Phase Estimation and Shor\'s algorithm.'
        ]
      },
      {
        id: 'p4-l8',
        number: 8,
        title: 'Quantum Phase Estimation',
        duration: '35 mins',
        summary: 'Estimating eigenvalue phase θ where U|u⟩ = e^(2πi θ)|u⟩.',
        concept: `Quantum Phase Estimation (QPE) estimates the unknown phase θ of an eigenvalue of a unitary operator U:
U|u⟩ = e^(2πi θ) |u⟩

QPE is the central subroutine used in Shor's algorithm, HHL algorithm for linear systems, and quantum chemistry simulations.`,
        math: `Phase Estimation Algorithm:
1. Prepare t counting qubits in |0...0⟩ and eigenstate |u⟩ in target register.
2. Apply H^(⊗t) to counting qubits.
3. Apply controlled-U^(2^j) operations.
4. Apply Inverse QFT (QFT†) to counting register.
5. Measure counting register to obtain binary estimate of θ to t bits of precision.`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: 'Estimated Phase State' },
        demonstration: {
          title: '1-Bit Phase Estimation of Z Gate',
          description: 'Estimates phase θ=0.5 of Pauli-Z on |1⟩.',
          circuit: {
            n: 2,
            ops: [
              { g: 'X', q: [1], s: 0, id: 1 },
              { g: 'H', q: [0], s: 1, id: 2 },
              { g: 'CZ', q: [0, 1], s: 2, id: 3 },
              { g: 'H', q: [0], s: 3, id: 4 }
            ]
          },
          expectedState: '|11⟩ (Counting qubit q0 measures 1, corresponding to θ = 0.5)',
          expectedProbabilities: 'P(11) = 100%'
        },
        takeaways: [
          'QPE estimates eigenvalues of unitary operators.',
          'Precision scales with the number of counting qubits t.',
          'Enables exponential speedup for order-finding and molecular Hamiltonian simulation.'
        ]
      },
      {
        id: 'p4-l9',
        number: 9,
        title: 'Shor\'s Algorithm',
        duration: '35 mins',
        summary: 'Polynomial-time integer factorization breaking RSA cryptography in O((log N)³).',
        concept: `Peter Shor (1994) developed a polynomial-time quantum algorithm for factoring integers N = p · q in O((log N)³) time, shattering classical RSA and Diffie-Hellman encryption which rely on the hardness of factoring (best classical general number field sieve takes sub-exponential time).

Shor reduces factorization to **period finding** of the function f(x) = a^x (mod N) using Quantum Phase Estimation.`,
        math: `Period Finding Reduction:
If a^r ≡ 1 (mod N) with even period r and a^(r/2) ≢ -1 (mod N):
(a^(r/2) - 1)(a^(r/2) + 1) = k N
⟹ gcd(a^(r/2) ± 1, N) yields non-trivial prime factors of N!`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: 'Modular Arithmetic Register' },
        demonstration: {
          title: 'Period Finding Toy Circuit',
          description: 'Period finding modular multiplication simulation.',
          circuit: {
            n: 3,
            ops: [
              { g: 'H', q: [0], s: 0, id: 1 },
              { g: 'H', q: [1], s: 0, id: 2 },
              { g: 'CX', q: [0, 2], s: 1, id: 3 },
              { g: 'CX', q: [1, 2], s: 2, id: 4 }
            ]
          },
          expectedState: 'Entangled periodic state',
          expectedProbabilities: 'Periodicity in measured outcomes'
        },
        takeaways: [
          'Shor’s algorithm factors large integers in polynomial time O((log N)³).',
          'Breaks current asymmetric public-key cryptography (RSA, ECC).',
          'Drives the global transition toward Post-Quantum Cryptography (PQC).'
        ]
      },
      {
        id: 'p4-l10',
        number: 10,
        title: 'Practical Algorithm Challenge',
        duration: '30 mins',
        summary: 'Synthesize complete Grover search oracle and diffuser from scratch.',
        concept: `Test your mastery of quantum algorithms by constructing a complete 2-qubit Grover search circuit that amplifies the marked target state |11⟩.`,
        math: `Target: Achieve P(11) ≥ 99% using Oracle O_11 and Diffuser D.`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: 'Target State |11⟩' },
        demonstration: {
          title: 'Full 2-Qubit Grover Solution',
          description: 'Equal superposition, CZ oracle, and H-X-CZ-X-H diffuser.',
          circuit: {
            n: 2,
            ops: [
              { g: 'H', q: [0], s: 0, id: 1 }, { g: 'H', q: [1], s: 0, id: 2 },
              { g: 'CZ', q: [0, 1], s: 1, id: 3 },
              { g: 'H', q: [0], s: 2, id: 4 }, { g: 'H', q: [1], s: 2, id: 5 },
              { g: 'X', q: [0], s: 3, id: 6 }, { g: 'X', q: [1], s: 3, id: 7 },
              { g: 'CZ', q: [0, 1], s: 4, id: 8 },
              { g: 'X', q: [0], s: 5, id: 9 }, { g: 'X', q: [1], s: 5, id: 10 },
              { g: 'H', q: [0], s: 6, id: 11 }, { g: 'H', q: [1], s: 6, id: 12 }
            ]
          },
          expectedState: '|11⟩',
          expectedProbabilities: 'P(11) = 100%'
        },
        takeaways: [
          'Successfully built and simulated an unstructured search algorithm.',
          'Understood oracle design and amplitude amplification.',
          'Ready for Path 05: Quantum Cryptography & Security.'
        ]
      }
    ]
  },
  {
    id: 'path-5',
    number: '05',
    title: 'Quantum Cryptography & Security',
    description: 'Explore the No-Cloning theorem, BB84 quantum key distribution, eavesdropping detection, QBER thresholds, and E91 entanglement protocols.',
    level: 'Advanced',
    lessonCount: 8,
    estimatedDuration: '4–5 hours',
    lessons: [
      {
        id: 'p5-l1',
        number: 1,
        title: 'Introduction to Quantum Cryptography',
        duration: '25 mins',
        summary: 'Information-theoretic security vs computational security, and quantum physical guarantees.',
        concept: `Traditional public key cryptography (RSA, Diffie-Hellman) relies on computational complexity assumptions (e.g., factoring integers is hard). In contrast, **Quantum Key Distribution (QKD)** provides **information-theoretic security** guaranteed by the laws of quantum mechanics.

No eavesdropper (Eve), regardless of available computing power or algorithm advances, can intercept a quantum channel without altering the transmitted quantum states.`,
        math: `Shannon\'s One-Time Pad theorem:
If key k is truly random, secret, and equal in length to message m:
Ciphertext c = m ⊕ k provides unconditional secrecy:
I(m; c) = 0`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: 'Key Qubit' },
        demonstration: {
          title: 'Quantum One-Time Pad Simulation',
          description: 'Information encoded and decrypted via reversible XOR Pauli-X.',
          circuit: { n: 1, ops: [{ g: 'X', q: [0], s: 0, id: 1 }, { g: 'X', q: [0], s: 1, id: 2 }] },
          expectedState: '|0⟩ (Message decrypted)',
          expectedProbabilities: 'P(0) = 100%'
        },
        takeaways: [
          'Quantum cryptography security is rooted in the laws of quantum physics.',
          'One-time pad with quantum distributed keys guarantees unconditional secrecy.',
          'Any measurement attempt by an adversary disturbs the transmission channel.'
        ]
      },
      {
        id: 'p5-l2',
        number: 2,
        title: 'Quantum No-Cloning Theorem',
        duration: '25 mins',
        summary: 'Proof that an unknown arbitrary quantum state cannot be cloned identically.',
        concept: `Published by Wootters and Zurek (1982), the **No-Cloning Theorem** proves that it is mathematically impossible to construct a unitary operator that creates an identical copy of an arbitrary unknown quantum state |ψ⟩:

U |ψ⟩|0⟩ ≠ |ψ⟩|ψ⟩

This principle is the cornerstone of quantum security: an eavesdropper cannot clone quantum signals to store and read later.`,
        math: `Proof by Contradiction:
Assume unitary cloner U exists such that:
U |ψ⟩|0⟩ = |ψ⟩|ψ⟩   and   U |ϕ⟩|0⟩ = |ϕ⟩|ϕ⟩

Take inner product:
⟨Uψ0|Uϕ0⟩ = ⟨ψ0|U† U|ϕ0⟩ = ⟨ψ|ϕ⟩⟨0|0⟩ = ⟨ψ|ϕ⟩
On the other hand:
⟨ψψ|ϕϕ⟩ = (⟨ψ|ϕ⟩)²

Therefore: ⟨ψ|ϕ⟩ = (⟨ψ|ϕ⟩)²
⟹ ⟨ψ|ϕ⟩ = 0 or ⟨ψ|ϕ⟩ = 1.
States can only be cloned if they are identical or mutually orthogonal!`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: 'Unclonable State' },
        demonstration: {
          title: 'Failed Classical Clone Attempt',
          description: 'CNOT copies orthogonal basis states but creates entanglement on superposition states.',
          circuit: { n: 2, ops: [{ g: 'H', q: [0], s: 0, id: 1 }, { g: 'CX', q: [0, 1], s: 1, id: 2 }] },
          expectedState: 'Entangled pair (|00⟩+|11⟩)/√2 instead of product |++⟩',
          expectedProbabilities: 'P(00) = 50%, P(11) = 50%'
        },
        takeaways: [
          'Arbitrary unknown quantum states cannot be duplicated.',
          'Attempting to copy a superposition produces entanglement instead of independent clones.',
          'Guarantees that an eavesdropper cannot silently intercept and replicate key photons.'
        ]
      },
      {
        id: 'p5-l3',
        number: 3,
        title: 'BB84 Protocol',
        duration: '35 mins',
        summary: 'Bennett & Brassard 1984 protocol: conjugate bases, transmission, and key sifting.',
        concept: `The BB84 protocol uses two non-orthogonal bases:
- **Z-basis (Rectilinear +)**: {|0⟩, |1⟩}
- **X-basis (Diagonal ×)**: {|+⟩, |-⟩}

Protocol Steps:
1. Alice generates random bits and chooses a random basis (+ or ×) for each photon.
2. Bob measures each incoming photon in an independently chosen random basis (+ or ×).
3. **Sifting**: Alice and Bob publicly announce their bases (not the bit values!). They discard instances where their bases mismatched (~50% sifted key rate).
4. **Error Estimation**: They compare a subset of bits to detect eavesdropping.`,
        math: `Conjugate Basis Complementarity:
|⟨0|+⟩|² = |⟨0|-⟩|² = 1/2
|⟨1|+⟩|² = |⟨1|-⟩|² = 1/2
If Bob measures in the incorrect basis, his outcome is completely random (50/50).`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: 'BB84 X-Basis Qubit' },
        demonstration: {
          title: 'BB84 Conjugate Basis Measurement',
          description: 'Alice prepares |+⟩ (X-basis); Bob measures in Z-basis.',
          circuit: { n: 1, ops: [{ g: 'H', q: [0], s: 0, id: 1 }, { g: 'M', q: [0], s: 1, id: 2 }] },
          expectedState: 'Random collapse to |0⟩ or |1⟩ with 50/50 probability',
          expectedProbabilities: 'P(0) = 50%, P(1) = 50%'
        },
        takeaways: [
          'BB84 relies on non-orthogonal measurement bases.',
          'Sifting preserves bits where Alice and Bob picked identical bases.',
          'In the absence of noise, matched bases yield 100% agreement.'
        ]
      },
      {
        id: 'p5-l4',
        number: 4,
        title: 'Quantum Key Distribution',
        duration: '30 mins',
        summary: 'Error correction (cascade), privacy amplification, and secret key generation.',
        concept: `Raw sifted keys contain errors from environmental channel noise and potential eavesdropping.
The full QKD pipeline consists of:
1. Quantum Transmission & Measurement.
2. Sifting (public basis reconciliation).
3. **Parameter Estimation**: Calculate Quantum Bit Error Rate (QBER).
4. **Information Reconciliation**: Error correction using classical parity checks.
5. **Privacy Amplification**: Compressing the key via universal hashing to eliminate any partial information leaked to Eve.`,
        math: `Asymptotic Secret Key Generation Rate:
R ≥ 1 - 2 h_2(QBER),   where h_2(p) = -p log₂(p) - (1-p) log₂(1-p) is binary entropy.`,
        interactive: { type: 'bloch', theta: 0, phi: 0, label: 'Reconciled Key State' },
        demonstration: {
          title: 'Key Sifting Simulation',
          description: 'Matching preparation and measurement bases produce 100% correlation.',
          circuit: { n: 1, ops: [{ g: 'X', q: [0], s: 0, id: 1 }, { g: 'M', q: [0], s: 1, id: 2 }] },
          expectedState: '|1⟩ measured deterministically',
          expectedProbabilities: 'P(1) = 100%'
        },
        takeaways: [
          'QKD generates shared symmetric encryption keys.',
          'Information reconciliation corrects channel noise.',
          'Privacy amplification reduces Eve’s mutual information to zero.'
        ]
      },
      {
        id: 'p5-l5',
        number: 5,
        title: 'Eavesdropping and Intercept-Resend Attacks',
        duration: '30 mins',
        summary: 'Intercept-resend attack mechanics, state disturbance, and detection probability.',
        concept: `Consider an eavesdropper, Eve, who intercepts photons in transit. Because she does not know which basis Alice used, she must guess (+ or ×) with 50% probability:
- If Eve guesses correctly: She receives the bit and resends the correct state unnoticed.
- If Eve guesses incorrectly: She collapses the photon into the wrong basis. When Bob measures in Alice's basis, he has a 50% chance of an error.

Overall error introduced per intercepted bit:
P(error) = 1/2 (wrong basis) × 1/2 (wrong outcome) = 25%.`,
        math: `Detection Probability for n sample check bits:
P_detect = 1 - (1 - 1/4)^n = 1 - (3/4)^n

For n = 72 test bits:
P_detect = 1 - (0.75)⁷² > 0.999999999 (over 99.9999999% certainty of detection!).`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: 'Eavesdropped Qubit' },
        demonstration: {
          title: 'Intercept-Resend Induced Error',
          description: 'Alice prepares |0⟩; Eve measures in X-basis; Bob measures in Z-basis.',
          circuit: {
            n: 1,
            ops: [
              { g: 'H', q: [0], s: 0, id: 1 },
              { g: 'H', q: [0], s: 1, id: 2 },
              { g: 'M', q: [0], s: 2, id: 3 }
            ]
          },
          expectedState: 'Interference pattern altered by intermediate measurement',
          expectedProbabilities: 'Errors detected in computational basis'
        },
        takeaways: [
          'An intercept-resend attack induces a 25% error rate on intercepted bits.',
          'Eavesdropping cannot occur without leaving detectable traces in the quantum channel.',
          'Comparing a small sample of test bits detects Eve with near-certainty.'
        ]
      },
      {
        id: 'p5-l6',
        number: 6,
        title: 'Quantum Bit Error Rate (QBER)',
        duration: '25 mins',
        summary: 'Threshold security analysis: Shor-Preskill bound QBER < 11.0% and abort criteria.',
        concept: `The **Quantum Bit Error Rate (QBER)** is the ratio of erroneous bits to total transmitted sifted bits:
QBER = N_error / N_sifted

By the Shor-Preskill security proof, unconditional security is guaranteed as long as:
QBER < 11.0%

If QBER exceeds 11.0%, Alice and Bob assume Eve is eavesdropping and **abort the protocol**, guaranteeing no compromised key is ever used.`,
        math: `QBER Security Threshold:
QBER = (1 - V) / 2,   where V is quantum optical visibility.
Maximum secure threshold: QBER_max ≈ 11.04% (Shor-Preskill bound for 1-way classical communication).`,
        interactive: { type: 'bloch', theta: 0.1 * Math.PI, phi: 0, label: 'Low QBER Margin' },
        demonstration: {
          title: 'QBER Threshold Verification',
          description: 'Testing channel fidelity with small rotational perturbation.',
          circuit: { n: 1, ops: [{ g: 'RY', q: [0], s: 0, p: 0.2, id: 1 }] },
          expectedState: 'Slightly perturbed state simulating optical fiber noise',
          expectedProbabilities: 'P(0) = 99.0%, P(1) = 1.0% (QBER = 1.0% < 11%)'
        },
        takeaways: [
          'QBER monitors channel noise and adversarial eavesdropping.',
          'Threshold for secure key extraction is QBER < 11.0%.',
          'If QBER ≥ 11%, the protocol automatically aborts.'
        ]
      },
      {
        id: 'p5-l7',
        number: 7,
        title: 'E91 Protocol and Entanglement-Based QKD',
        duration: '30 mins',
        summary: 'Artur Ekert 1991 protocol: entangled EPR pairs and Bell inequality violation security.',
        concept: `Proposed by Artur Ekert in 1991, **E91** replaces single photon preparation with entangled Bell pairs emitted from a central source to Alice and Bob.

Security does not rely on Alice's device trustworthiness; instead, Alice and Bob verify that their measurement outcomes violate the CHSH inequality (|S| > 2).
If Eve intercepts or entangles with the photons, the Bell inequality violation collapses, proving Eve's presence immediately.`,
        math: `Ekert Security Guarantee:
If |S| = 2√2: States are pure maximally entangled Bell pairs.
Eve has zero mutual information with the generated key:
I(Eve; Key) = 0`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: 'E91 Entangled Source' },
        demonstration: {
          title: 'E91 Bell Pair Emission',
          description: 'Generates entangled Singlet state for distributed E91 measurement.',
          circuit: { n: 2, ops: [{ g: 'H', q: [0], s: 0, id: 1 }, { g: 'CX', q: [0, 1], s: 1, id: 2 }] },
          expectedState: '|Φ⁺⟩ Bell pair shared between Alice and Bob',
          expectedProbabilities: 'P(00) = 50%, P(11) = 50%'
        },
        takeaways: [
          'E91 uses entangled photon pairs for device-independent security.',
          'CHSH inequality violation proves the channel is free from eavesdropping.',
          'Even if the source is untrusted or hostile, security is mathematically certified.'
        ]
      },
      {
        id: 'p5-l8',
        number: 8,
        title: 'Practical Challenge: Simulating BB84',
        duration: '30 mins',
        summary: 'Complete simulation of Alice-Bob conjugate basis transmission and eavesdropping detection.',
        concept: `Synthesize your quantum security knowledge into a hands-on QKD simulation. Verify conjugate basis transmission, compute the simulated QBER, and verify secrecy.`,
        math: `Objective: Verify that matching bases yield zero error while conjugate measurements induce 50% error rate.`,
        interactive: { type: 'bloch', theta: 0.5 * Math.PI, phi: 0, label: 'BB84 Key Transmission' },
        demonstration: {
          title: 'Full BB84 Transmission Simulation',
          description: 'Hadamard basis preparation, simulated channel, and measurement.',
          circuit: {
            n: 2,
            ops: [
              { g: 'H', q: [0], s: 0, id: 1 },
              { g: 'CX', q: [0, 1], s: 1, id: 2 },
              { g: 'H', q: [0], s: 2, id: 3 },
              { g: 'M', q: [0], s: 3, id: 4 },
              { g: 'M', q: [1], s: 3, id: 5 }
            ]
          },
          expectedState: 'Measured correlated outcomes',
          expectedProbabilities: 'Correlated sifted key distribution'
        },
        takeaways: [
          'Simulated end-to-end Quantum Key Distribution.',
          'Understood information-theoretic security and QBER thresholds.',
          'Completed all 5 core learning paths of the Qubitry quantum curriculum.'
        ]
      }
    ]
  }
];

