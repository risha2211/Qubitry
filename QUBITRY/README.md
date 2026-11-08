# Qubitry

An interactive quantum circuit studio, exact browser-based statevector simulator, and structured learning platform.

*Developed by [Risha Kanthe](https://github.com/risha2211) — Semester 6 Project.*

---

## Why I Built Qubitry

Most quantum computing tools fall into two camps: Python SDKs (like Qiskit or Cirq) that require setting up an environment, or simple toy visualizers that only show isolated gates.

Qubitry bridges that gap by running an exact, noiseless linear algebra quantum simulator directly in the browser. You can construct multi-qubit circuits, immediately watch the statevector and 3D Bloch sphere evolve, test your understanding through hands-on challenges evaluated by quantum state fidelity, and follow a progressive 44-lesson curriculum from basics to quantum algorithms.

---

## What's Inside

### 1. Circuit Studio
- **1 to 6 Qubits**: Clean multi-wire canvas with drag-and-drop or coordinate placement.
- **Full Gate Set**:
  - *Single-qubit unitaries*: Hadamard ($H$), Pauli-$X$ (NOT), Pauli-$Y$, Pauli-$Z$, Phase ($S$, $T$, $P(\phi)$), Rotations ($R_x(\theta)$, $R_y(\theta)$, $R_z(\theta)$), Identity ($I$), Reset ($|0\rangle$), Measurement ($M$).
  - *Multi-qubit unitaries*: CNOT ($CX$), Controlled-$Y$ ($CY$), Controlled-$Z$ ($CZ$), Controlled-Phase ($CP$), Controlled-$R_z$ ($CR_z$), SWAP, Toffoli ($CCX$), Fredkin ($CSWAP$).
- **Statevector Inspector & 3D Bloch Sphere**: Drag-to-rotate 3D sphere coordinate frame, exact complex amplitudes ($\alpha|0\rangle + \beta|1\rangle$), and Born rule probability distributions.
- **Step-by-Step Timeline**: Step through execution gate-by-gate to inspect intermediate wavefunction states.
- **Code Export**: 1-click export to **Qiskit (Python)**, **Google Cirq**, **OpenQASM 2.0**, and **Quirk URL**.
- **Keyboard Shortcuts**: Pro-editing hotkeys for undo/redo, copy/paste, and quick gate placement (press `?` in Studio for full reference).

### 2. Structured Learning (44 Lessons across 5 Paths)
- **Path 01 — Foundations of Quantum Computing** (10 lessons): Hilbert spaces, Dirac bra-ket notation, superposition, and measurement.
- **Path 02 — Quantum Gates & Circuit Construction** (8 lessons): Unitary evolution, single-qubit rotations, Clifford group, and universality.
- **Path 03 — Entanglement & Quantum Information** (8 lessons): Tensor products, Bell states, quantum teleportation, superdense coding, and partial trace.
- **Path 04 — Quantum Algorithms** (10 lessons): Deutsch-Jozsa, Bernstein-Vazirani, Simon's algorithm, Grover's search, and Quantum Phase Estimation (QPE).
- **Path 05 — Quantum Cryptography & Security** (8 lessons): BB84 protocol, E91 entanglement, Post-Quantum Cryptography (PQC), and Quantum Error Correction.
- **Interactive Demonstrations**: Every lesson includes an interactive Bloch sphere and an **"Open in Circuit Studio"** button to experiment with the circuit instantly.

### 3. Exercises & Quantum State Fidelity Challenges
- **5 Practice Categories**: Conceptual Quizzes, State Prediction, Mathematical Problems, Algorithm Challenges, and Circuit Building Challenges.
- **Physical Fidelity Evaluator**: Circuit challenges evaluate mathematical state overlap rather than rigid gate string matching:
  $$F = |\langle\psi_{\text{target}} | \psi_{\text{user}}\rangle|^2 \ge 0.999$$
  If your circuit prepares the target state (regardless of global phase $e^{i\theta}$ or gate order), you pass!

### 4. Research Labs
Interactive mini-environments covering:
- **Optimization**: Variational Quantum Eigensolver (VQE) and QAOA Max-Cut.
- **Quantum Machine Learning**: Parameterized Quantum Circuits (PQC) and variational classifiers.
- **Quantum Information**: Bell state generation and CHSH inequality testing ($S > 2$).
- **Cryptography**: BB84 photon polarization simulation with eavesdropper (Eve) detection via QBER.
- **Hardware & Reliability**: Noise channels (bit/phase flip, depolarizing) and syndrome decoding.

### 5. Cloud Workspace & Backend
- User authentication with JWT (register/login).
- Cloud circuit saving, forking, and JSON import/export (MongoDB Atlas with fallback local file store).
- Progress tracking, bookmarked lessons, recent activity feed, and achievement badges.

---

## Project Architecture

```text
QUBITRY/
├── apps/
│   ├── web/                    # React 18 + Vite frontend
│   │   ├── src/components/     # BlochSphere, Canvas, ShortcutsModal, AuthModal
│   │   ├── src/data/           # 44-lesson curriculum & 5 exercise datasets
│   │   ├── src/pages/          # Studio, Learn, Exercises, Workspace, Labs, Docs
│   │   └── src/stores/         # AuthContext, CircuitContext, ProgressContext
│   └── server/                 # Express.js MERN Backend
│       ├── src/config/         # MongoDB Atlas connection & resilient local fallback
│       ├── src/controllers/    # Auth, Circuit, and Progress controllers
│       └── src/routes/         # /api/auth, /api/circuits, /api/progress
├── packages/
│   ├── quantum-core/           # Linear algebra statevector simulator (pure JS, tested)
│   └── quantum-algorithms/     # Presets (Grover, Deutsch-Jozsa, QFT, Teleportation)
└── scripts/
    └── dev.js                  # Cross-platform concurrent runner (server + web)
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Setup & Run
```bash
# 1. Clone repository
git clone https://github.com/risha2211/QUBITRY.git
cd QUBITRY

# 2. Install dependencies
npm run setup

# 3. Start development servers (starts both backend on :5000 and frontend on :5173)
npm run dev
```

- **Frontend:** `http://localhost:5173`
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

## Keyboard Shortcuts in Circuit Studio

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + Z` / `Ctrl + Shift + Z` | Undo / Redo |
| `Ctrl + C` / `Ctrl + V` / `Ctrl + X` | Copy / Paste / Cut selected gate(s) |
| `Delete` / `Backspace` | Delete selected gate(s) |
| `Ctrl + A` | Select all gates |
| `Esc` | Deselect / Cancel |
| `H`, `X`, `Y`, `Z`, `S`, `T`, `M` | Select gate tool |
| `Shift + Enter` | Run simulation |
| `Ctrl + R` | Reset circuit |
| `?` | Open shortcuts reference |

---

## Conventions
- **Qubit Ordering**: Qubit 0 is the least-significant bit (matching IBM Qiskit and standard quantum literature). Bitstrings are formatted as $|q_{n-1} \dots q_0\rangle$.
- **Statevector**: Pure statevector $|\psi\rangle \in \mathbb{C}^{2^n}$ normalized such that $\sum |c_x|^2 = 1$.

---

## Author
**Risha Kanthe**  
GitHub: [@risha2211](https://github.com/risha2211)
