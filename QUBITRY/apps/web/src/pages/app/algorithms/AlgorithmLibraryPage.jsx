import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRESETS, buildCircuit } from '@qubitry/quantum-algorithms';
import { useCircuit } from '../../../stores/CircuitContext.jsx';
import { nextId } from '@qubitry/quantum-core';

export default function AlgorithmLibraryPage() {
  const nav = useNavigate();
  const { setCirc } = useCircuit();
  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Interactive Oracle Builder state
  const [showOracleBuilder, setShowOracleBuilder] = useState(false);
  const [truthTable, setTruthTable] = useState([0, 1, 1, 0]); // f(00)=0, f(01)=1, f(10)=1, f(11)=0

  const categories = ['All', 'Foundations', 'Oracle', 'Search', 'Fourier'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Research'];

  const filteredPresets = useMemo(() => {
    return PRESETS.filter(p => {
      // Category match
      let catMatch = true;
      if (selectedCat === 'Foundations') catMatch = ['bell', 'ghz', 'superposition', 'adder', 'tp'].includes(p.id);
      else if (selectedCat === 'Oracle') catMatch = ['deutsch', 'dj-balanced', 'dj-constant', 'simon'].includes(p.id);
      else if (selectedCat === 'Search') catMatch = ['g2', 'g3'].includes(p.id);
      else if (selectedCat === 'Fourier') catMatch = ['qft', 'inv-qft', 'qpe', 'shor-toy'].includes(p.id);

      // Level match
      const levelMatch = selectedLevel === 'All' || p.level === selectedLevel;

      // Search match
      const searchMatch =
        searchTerm === '' ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());

      return catMatch && levelMatch && searchMatch;
    });
  }, [selectedCat, selectedLevel, searchTerm]);

  // Construct custom oracle circuit from truth table
  const handleLoadCustomOracle = () => {
    // 3 qubits: q0, q1 inputs; q2 ancilla in |->
    const ops = [
      { g: 'X', q: [2], s: 0, id: nextId() },
      { g: 'H', q: [0], s: 1, id: nextId() },
      { g: 'H', q: [1], s: 1, id: nextId() },
      { g: 'H', q: [2], s: 1, id: nextId() }
    ];

    let s = 2;
    // For each minterm where f(x0, x1) == 1, add controlled gate
    // index 0: 00 -> X on q0, q1, CCX(0,1,2), X on q0, q1
    if (truthTable[0] === 1) {
      ops.push({ g: 'X', q: [0], s, id: nextId() });
      ops.push({ g: 'X', q: [1], s, id: nextId() });
      s++;
      ops.push({ g: 'CCX', q: [0, 1, 2], s, id: nextId() });
      s++;
      ops.push({ g: 'X', q: [0], s, id: nextId() });
      ops.push({ g: 'X', q: [1], s, id: nextId() });
      s++;
    }
    // index 1: 01 -> x0=0, x1=1
    if (truthTable[1] === 1) {
      ops.push({ g: 'X', q: [1], s, id: nextId() });
      s++;
      ops.push({ g: 'CCX', q: [0, 1, 2], s, id: nextId() });
      s++;
      ops.push({ g: 'X', q: [1], s, id: nextId() });
      s++;
    }
    // index 2: 10 -> x0=1, x1=0
    if (truthTable[2] === 1) {
      ops.push({ g: 'X', q: [0], s, id: nextId() });
      s++;
      ops.push({ g: 'CCX', q: [0, 1, 2], s, id: nextId() });
      s++;
      ops.push({ g: 'X', q: [0], s, id: nextId() });
      s++;
    }
    // index 3: 11
    if (truthTable[3] === 1) {
      ops.push({ g: 'CCX', q: [0, 1, 2], s, id: nextId() });
      s++;
    }

    // Final Hadamards on input register
    ops.push({ g: 'H', q: [0], s, id: nextId() });
    ops.push({ g: 'H', q: [1], s, id: nextId() });

    const onesCount = truthTable.reduce((a, b) => a + b, 0);
    const isConstant = onesCount === 0 || onesCount === 4;
    const isBalanced = onesCount === 2;

    const customPreset = {
      n: 3,
      note: {
        name: `Custom Boolean Oracle [f=${truthTable.join('')}]`,
        description: `Custom 2-input truth table: f(00)=${truthTable[0]}, f(01)=${truthTable[1]}, f(10)=${truthTable[2]}, f(11)=${truthTable[3]}. Property: ${isConstant ? 'CONSTANT' : isBalanced ? 'BALANCED' : 'NEITHER (bi-modal)'}.`,
        expected: isConstant ? 'Input register q0, q1 returns |00⟩' : isBalanced ? 'Input register q0, q1 is never |00⟩' : 'Mixed outcomes',
        type: 'Circuit Simulation',
        level: 'Intermediate'
      },
      ops
    };

    setCirc(customPreset);
    nav('/studio');
  };

  return (
    <div className="w">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <div>
          <h2>Algorithm Library</h2>
          <p className="m" style={{ margin: '4px 0 0' }}>
            Curriculum catalog: each algorithm opens an exact, editable circuit in Circuit Studio with honest complexity metadata.
          </p>
        </div>
        <button
          className="pri"
          onClick={() => setShowOracleBuilder(!showOracleBuilder)}
        >
          {showOracleBuilder ? 'Close Oracle Builder' : '⚡ Open Oracle Builder'}
        </button>
      </div>

      {/* Interactive Oracle Builder Panel */}
      {showOracleBuilder && (
        <div className="card" style={{ marginBottom: 20, borderColor: 'var(--c)' }}>
          <b style={{ color: 'var(--c)' }}>Interactive Reversible Boolean Oracle Builder</b>
          <p className="m" style={{ fontSize: 12, margin: '4px 0 10px' }}>
            Define an arbitrary 2-bit truth table f: {`{0,1}² → {0,1}`}. The compiler synthesizes a reversible phase-kickback quantum circuit using Toffoli decomposition.
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
            {['f(00)', 'f(01)', 'f(10)', 'f(11)'].map((label, idx) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="mono" style={{ fontSize: 12 }}>{label} =</span>
                <select
                  value={truthTable[idx]}
                  onChange={e => {
                    const next = [...truthTable];
                    next[idx] = +e.target.value;
                    setTruthTable(next);
                  }}
                  style={{ padding: '3px 6px', fontSize: 12 }}
                >
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                </select>
              </div>
            ))}
            <div className="tag" style={{ color: 'var(--ok)' }}>
              Type: {truthTable.reduce((a, b) => a + b, 0) === 0 || truthTable.reduce((a, b) => a + b, 0) === 4 ? 'Constant' : truthTable.reduce((a, b) => a + b, 0) === 2 ? 'Balanced' : 'Biased'}
            </div>
          </div>

          <button className="pri" onClick={handleLoadCustomOracle}>
            Synthesize Circuit &amp; Open in Studio →
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: 16, padding: '10px 14px' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: 4 }}>
            {categories.map(cat => (
              <button
                key={cat}
                className={selectedCat === cat ? 'on' : ''}
                onClick={() => setSelectedCat(cat)}
                style={{ fontSize: 12, padding: '4px 8px' }}
              >
                {cat}
              </button>
            ))}
          </div>

          <span style={{ color: 'var(--b)' }}>|</span>

          {/* Level Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--m)' }}>Difficulty:</span>
            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value)}
              style={{ fontSize: 12, padding: '3px 8px' }}
            >
              {levels.map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div style={{ flex: 1, minWidth: 180 }}>
            <input
              type="text"
              placeholder="Search algorithms..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', fontSize: 12, padding: '4px 8px' }}
            />
          </div>
        </div>
      </div>

      {/* Algorithm Grid */}
      <div className="g3">
        {filteredPresets.map(p => (
          <div className="card" key={p.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                <span className="tag" style={{ color: 'var(--c)' }}>{p.type}</span>
                <span className="tag">{p.level}</span>
                <span className="tag" style={{ color: 'var(--m)' }}>{p.n} Qubits</span>
              </div>
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>{p.name}</h3>
              <p className="m" style={{ fontSize: 12, lineHeight: 1.5 }}>{p.description}</p>
            </div>

            <div style={{ marginTop: 12 }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ok)', marginBottom: 8 }}>
                Expected: {p.expected}
              </div>
              <button
                className="pri"
                style={{ width: '100%', fontSize: 12 }}
                onClick={() => {
                  setCirc(buildCircuit(p));
                  nav('/studio');
                }}
              >
                Open in Circuit Studio →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
