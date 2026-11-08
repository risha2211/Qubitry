# Qubitry

An interactive quantum circuit studio, exact browser-based statevector simulator, and structured learning platform.

Developed by Risha Kanthe

---

## Why I Built Qubitry

Most quantum computing tools fall into two camps: Python SDKs (like IBM Qiskit or Google Cirq) that require setting up a local Python environment, or simple toy visualizers that only show isolated, pre-calculated gates.

Qubitry bridges that gap by running an exact, noiseless linear algebra quantum simulator directly inside your browser. You can construct multi-qubit circuits on an interactive canvas, immediately watch the statevector and 3D Bloch sphere evolve in real time, step through execution gate-by-gate, test your understanding through hands-on challenges evaluated by physical quantum state fidelity, and follow a structured 44-lesson curriculum from foundational physics to quantum algorithms.

---

## Core Features & System Tour

### 1. Circuit Studio
The heart of Qubitry is an interactive quantum workstation supporting 1 to 6 qubits:
- **Interactive Wire Canvas**: Place, drag, reorder, and remove gates on individual qubit registers ($q_0 \dots q_5$) with coordinates and timing columns.
- **Complete Gate Library**:
  - *Single-Qubit Unitaries*: Hadamard ($H$), Pauli- $X$ (NOT), Pauli- $Y$, Pauli- $Z$, Phase ($S$, $T$, $P$), Arbitrary Rotations ($R_x(\theta)$, $R_y(\theta)$, $R_z(\theta)$ ), Identity ($I$), Reset ($|0\rangle$), and Measurement ($M$).
  - *Multi-Qubit Unitaries*: Controlled-NOT ($CX$), Controlled- $Y$ ($CY$), Controlled- $Z$ ($CZ$), Controlled-Phase ($CP$), Controlled-$R_z$ ($CR_z$), SWAP, Toffoli ($CCX$), and Fredkin ($CSWAP$).
- **Statevector Inspector**: View the full complex statevector $|\psi\rangle \in \mathbb{C}^{2^n}$ with exact real ($\alpha$) and imaginary ($\beta$) amplitudes, phase angles, and Born rule measurement probabilities ($P(x) = |c_x|^2$).
- **3D Interactive Bloch Sphere**: Rotatable 3D coordinate frame displaying polar ($\theta$) and azimuthal ($\phi$) angles alongside the statevector's expectation values $\langle X \rangle, \langle Y \rangle, \langle Z \rangle$.
- **Step-by-Step Simulation Snapshots**: Scrub through execution moment-by-moment using hotkeys (`N` for next step, `P` for previous step) to watch intermediate state collapse, phase kickback, and quantum interference happen live.
- **Measurement Sampling**: Monte Carlo shot sampler (1024 shots default, customizable seed) generating statistical measurement histograms.
- **Multi-Format Code Export**: 1-click export of any circuit to:
  - **IBM Qiskit (Python 3)**
  - **Google Cirq (Python 3)**
  - **OpenQASM 2.0**
  - **Quirk shareable URL**

---

### 2. Algorithm Library
A library of 15+ quantum algorithms and experimental circuits, categorized and sorted by difficulty level (Beginner, Intermediate, Advanced, Research) with full circuit descriptions and expected outcomes:

#### Foundations (Beginner)
- **Bell State ($|\Phi^+\rangle$)**: Canonical 2-qubit maximally entangled state $(|00\rangle + |11\rangle)/\sqrt{2}$.
- **GHZ State**: Tripartite Greenberger–Horne–Zeilinger entanglement $(|000\rangle + |111\rangle)/\sqrt{2}$.
- **Uniform Superposition**: Transversal Hadamard transformation creating an unbiased $2^n$ basis state superposition.
- **Quantum Half-Adder**: Reversible quantum arithmetic using Toffoli ($CCX$) and CNOT ($CX$) gates for bit addition without measurement.
- **Quantum Teleportation**: Complete protocol transmitting an unknown single-qubit quantum state using a shared Bell pair and classical feedforward.

#### Oracle Algorithms (Intermediate)
- **Deutsch's Algorithm**: Evaluates whether a 1-bit Boolean function $f(x)$ is constant or balanced using a single quantum query.
- **Deutsch-Jozsa (Balanced & Constant)**: Generalization to $n$-qubit inputs distinguishing balanced from constant functions in exactly 1 query (versus $2^{n-1}+1$ classical queries).
- **Bernstein-Vazirani Algorithm**: Recovers an unknown $n$-bit hidden string $s$ in a single query via phase kickback.
- **Simon's Problem**: Finds the hidden period $s$ of a function with exponential speedup over classical query complexity.

#### Search & Amplification (Advanced)
- **Grover's 2-Qubit Search**: Complete oracle and diffuser implementation amplifying target state $|11\rangle$ to 100% probability in 1 iteration.
- **Grover's 3-Qubit Search**: Unstructured search across $N=8$ items demonstrating quadratic speedup $\mathcal{O}(\sqrt{N})$.

#### Fourier Transforms & Phase Estimation (Advanced to Research)
- **Quantum Fourier Transform (QFT)**: 3-qubit discrete quantum Fourier transform using Hadamard and controlled phase rotations.
- **Inverse QFT ($QFT^\dagger$)**: Unitary inverse mapping frequency-domain amplitudes back to the computational basis.
- **Quantum Phase Estimation (QPE)**: Estimates the unknown phase eigenvalue $\theta$ of a unitary operator $U|\psi\rangle = e^{2\pi i \theta}|\psi\rangle$.
- **Shor's Algorithm (Toy Period-Finding)**: Modular exponentiation and phase extraction demonstrating polynomial-time order finding.

#### Custom Oracle Generator
An integrated interactive truth-table generator allows defining arbitrary 2-input Boolean functions $f: \{0,1\}^2 \to \{0,1\}$ via truth table toggles. Qubitry automatically synthesizes the reversible multi-controlled gate circuit and loads it into Circuit Studio.

---

### 3. Structured Learning (44 Lessons across 5 Paths)
A structured, self-paced curriculum designed to take users from zero knowledge to advanced quantum algorithms:

- **PATH 01 — Foundations of Quantum Computing** (10 lessons · Beginner · 3–4 hrs): Physical qubits, Hilbert spaces, Dirac bra-ket notation, state vectors, superposition, and measurement.
- **PATH 02 — Quantum Gates & Circuit Construction** (8 lessons · Beginner to Intermediate · 3 hrs): Unitary evolution, single-qubit rotations, Clifford group, multi-qubit tensor products, and universality.
- **PATH 03 — Entanglement & Quantum Information** (8 lessons · Intermediate · 3–4 hrs): Non-separable states, Bell pairs, entanglement entropy, partial trace, teleportation, and superdense coding.
- **PATH 04 — Quantum Algorithms** (10 lessons · Intermediate to Advanced · 5–6 hrs): Phase kickback, Deutsch-Jozsa, Bernstein-Vazirani, Simon's algorithm, Grover's search, and Quantum Phase Estimation.
- **PATH 05 — Quantum Cryptography & Security** (8 lessons · Advanced · 4–5 hrs): BB84 protocol, E91 entanglement, Post-Quantum Cryptography (PQC), and Quantum Error Correction (Shor 9-qubit and Steane 7-qubit codes).

**Interactive Lesson Format**:
Every lesson includes:
1. Core Concept explanation.
2. Mathematical formulation with Dirac notation and matrix equations.
3. Interactive 3D Bloch sphere with state presets ($|0\rangle, |1\rangle, |+\rangle, |-\rangle, |+i\rangle$) and Born probability readouts.
4. Practical Demonstration with a **"🔬 Open in Circuit Studio"** button that automatically seeds the circuit into Circuit Studio.
5. Key Takeaways recap and progress tracking.

---

### 4. Exercises & Quantum State Fidelity Challenges
Independent practice and assessments divided into 5 distinct categories:
- **Conceptual Quizzes**: Multiple-choice assessments testing theoretical foundations, Born rule probability calculations, and unitary matrix properties with instant scientific explanations.
- **State Prediction**: Analyze quantum circuit diagrams and predict resultant state vectors, relative phases, and measurement outcome distributions.
- **Mathematical Problems**: Solve matrix multiplications, inner products $\langle\phi|\psi\rangle$, tensor products, and normalization constants.
- **Algorithm Challenges**: Query complexity proofs, oracle discrimination problems, and phase kickback analysis.
- **Circuit Building Challenges**: Hands-on circuit construction challenges evaluated using physical **Quantum State Fidelity**:
  $$F = |\langle\psi_{\text{target}} | \psi_{\text{user}}\rangle|^2 \ge 0.999$$
  The simulator calculates the inner product between your circuit's output wavefunction and the target state. If $F \ge 0.999$ (invariant under global phase $e^{i\theta}$), you pass, earn points, and unlock achievements!

---

### 5. My Workspace & Cloud Persistence
A centralized personal hub for managing your quantum projects:
- **Personalized Dashboard**: Greets you with `Hi, {user.username}!` when signed in.
- **Learning & Progress Hub**:
  - Live curriculum progress percentage, lessons completed, and remaining milestones.
  - **Continue Learning Card**: One-click jump to resume your active lesson.
  - **Quantum Achievements Showcase**: 6 unlockable badges (*First Steps*, *Superposition Explorer*, *Circuit Builder*, *Entangled*, *Algorithm Explorer*, *Learning Milestone*).
  - **Bookmarked Lessons**: Quick-access list to resume saved lessons.
  - **Recent Activity Feed**: Chronological timeline of completed lessons, passed challenges, and earned achievements.
  - **Category Performance Breakdown**: Progress bars across all 5 exercise categories.
- **Quantum Circuits & Cloud Storage**:
  - **Save Active Studio Circuit**: Save current circuits with title, description, and custom tags.
  - **Cloud Circuit Management**: Search, filter by tags, fork circuits, load directly into Circuit Studio, export to QASM/Qiskit/Cirq, or delete.
  - **JSON Circuit Importer**: Drawer to paste raw circuit JSON or exported data and import it straight into your cloud workspace.

---

### 6. Research Labs
Dedicated interactive experimentation spaces for advanced quantum topics:
- **Optimization Lab**: Variational Quantum Eigensolver (VQE) for molecular ground state approximation and QAOA for Max-Cut graph partitioning.
- **Quantum Machine Learning (QML)**: Parameterized Quantum Circuits (PQC), quantum kernel feature maps, and variational classification.
- **Quantum Information Lab**: Bell state generation and CHSH inequality violation tests ($S > 2$).
- **Cryptography Lab**: BB84 photon polarization protocol with eavesdropper (Eve) detection via Quantum Bit Error Rate (QBER).
- **Hardware & Reliability Lab**: Noise channels (bit flip, phase flip, depolarizing) and active syndrome decoding with quantum error correction codes.

---

### 7. Documentation & Reference
An interactive reference manual built into the application:
- Mathematical matrices and unitary definitions for all single-qubit, controlled, and multi-qubit operators.
- Dirac bra-ket reference guide with inner product, outer product, and tensor product rules.
- Hardware physical specifications, noiseless simulation limits (up to 6 qubits), and convention notes.

---

## Complete Keyboard Shortcuts Reference

Qubitry includes comprehensive keyboard shortcuts designed for rapid circuit construction and simulation:

### Editing
| Shortcut | Action |
| :--- | :--- |
| `Ctrl + Z` | Undo last action |
| `Ctrl + Shift + Z` | Redo |
| `Ctrl + C` | Copy selected gate(s) |
| `Ctrl + V` | Paste gate(s) |
| `Ctrl + X` | Cut selected gate(s) |
| `Delete` / `Backspace` | Delete selected gate(s) |
| `Ctrl + A` | Select all gates |
| `Esc` | Deselect / cancel current action |

### Gate Selection Hotkeys
| Shortcut | Action |
| :--- | :--- |
| `I` | Select Identity gate |
| `H` | Select Hadamard gate |
| `X` | Select Pauli-X gate |
| `Y` | Select Pauli-Y gate |
| `Z` | Select Pauli-Z gate |
| `S` | Select S Phase gate |
| `T` | Select T Phase gate |
| `M` | Select Measurement gate |
| `R` | Select Reset ($|0\rangle$) gate |

### Simulation Controls
| Shortcut | Action |
| :--- | :--- |
| `Space` | Run / pause simulation step |
| `Shift + Enter` | Run circuit to completion |
| `Ctrl + Enter` | Run measurement sampling (Monte Carlo) |
| `Ctrl + R` | Reset circuit |
| `N` | Next simulation step (scrub timeline forward) |
| `P` | Previous simulation step (scrub timeline backward) |

### View & Navigation
| Shortcut | Action |
| :--- | :--- |
| `B` | Open Bloch sphere visualization |
| `F` | Fit circuit to view |
| `G` | Toggle gate library sidebar |
| `Ctrl + +` | Zoom in canvas |
| `Ctrl + -` | Zoom out canvas |
| `Ctrl + 0` | Reset zoom to 100% |
| `?` | Open keyboard shortcuts reference modal |

---

## Project Architecture

```text
QUBITRY/
├── apps/
│   ├── web/                    # React 18 + Vite frontend
│   │   ├── src/components/     # BlochSphere, Canvas, ShortcutsModal, AuthModal
│   │   ├── src/data/           # 44-lesson curriculum & 5 exercise datasets
│   │   ├── src/pages/          # Studio, Algorithms, Learn, Exercises, Workspace, Labs, Docs
│   │   └── src/stores/         # AuthContext, CircuitContext, ProgressContext
│   └── server/                 # Express.js MERN Backend
│       ├── src/config/         # MongoDB Atlas connection & resilient local fallback
│       ├── src/controllers/    # Auth, Circuit, and Progress controllers
│       └── src/routes/         # /api/auth, /api/circuits, /api/progress
├── packages/
│   ├── quantum-core/           # Exact linear algebra statevector engine (pure JS, tested)
│   │   ├── src/simulator.js    # Matrix unitaries, applyOp, simulateStepByStep
│   │   ├── src/analysis.js     # Bloch vector, angles, entropy, Born probabilities
│   │   └── src/codegen.js      # Qiskit, Cirq, OpenQASM 2.0 exporters
│   └── quantum-algorithms/     # Presets (Grover, Deutsch-Jozsa, QFT, Teleportation, etc.)
└── scripts/
    └── dev.js                  # Cross-platform concurrent runner (server + web)
```

---

## Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)

### Setup & Run
```bash
# 1. Clone repository
git clone https://github.com/risha2211/Qubitry.git
cd Qubitry

# 2. Install dependencies across all workspaces
npm run setup

# 3. Start development servers (starts Express on :5000 and Vite on :5173)
npm run dev
```

- **Web Application:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`
- **Health Check:** `http://localhost:5000/api/health`

### Tests & Build
```bash
# Run simulator unit test suite (17 tests covering gate algebra, fidelity, and unitary evolution)
npm test

# Build production bundle
npm run build
```

---

## Conventions & Physics Specs
- **Qubit Ordering**: Qubit 0 is the least-significant bit (matching IBM Qiskit and standard quantum literature). Bitstrings are formatted as $|q_{n-1} \dots q_0\rangle$.
- **State Representation**: Pure statevectors $|\psi\rangle \in \mathbb{C}^{2^n}$ normalized such that $\sum |c_x|^2 = 1$.
- **Simulation**: Ideal, noiseless unitary operations with optional stochastic projective measurement collapse according to the Born rule.

---

## Author
**Risha Kanthe**  
GitHub: [@risha2211](https://github.com/risha2211)
