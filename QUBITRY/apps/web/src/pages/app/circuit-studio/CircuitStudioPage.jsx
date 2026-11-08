import { useState, useRef, useEffect } from 'react';
import { useCircuit } from '../../../stores/CircuitContext.jsx';
import { useSimulation } from '../../../hooks/useSimulation.js';
import GateLibrary from './GateLibrary.jsx';
import CircuitCanvas from './CircuitCanvas.jsx';
import ResultsPanel from './ResultsPanel.jsx';
import ShortcutsModal from './ShortcutsModal.jsx';
import SaveCircuitModal from './SaveCircuitModal.jsx';
import ExportCircuitModal from './ExportCircuitModal.jsx';
import { nextId, GATES } from '@qubitry/quantum-core';

export default function CircuitStudioPage() {
  const { circ, setCirc } = useCircuit();
  const { n, ops, note } = circ;

  const [tool, setTool] = useState('H');
  const [par, setPar] = useState(0.5);
  const [selectedOpIds, setSelectedOpIds] = useState([]);
  const [shots, setShots] = useState(1024);
  const [seed, setSeed] = useState(42);
  const [msg, setMsg] = useState('');

  // View and UI States
  const [zoom, setZoom] = useState(1.0);
  const [showGateLibrary, setShowGateLibrary] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [resultsTab, setResultsTab] = useState('prob');
  const [stepIdx, setStepIdx] = useState(null);

  // Undo / Redo Stacks & Clipboard
  const pastOpsRef = useRef([]);
  const futureOpsRef = useRef([]);
  const [pastCount, setPastCount] = useState(0);
  const [futureCount, setFutureCount] = useState(0);
  const clipboardRef = useRef([]);

  // Dynamic references to guarantee hotkeys always access fresh state
  const opsRef = useRef(ops);
  useEffect(() => { opsRef.current = ops; }, [ops]);

  const selectedOpIdsRef = useRef(selectedOpIds);
  useEffect(() => { selectedOpIdsRef.current = selectedOpIds; }, [selectedOpIds]);

  const zoomRef = useRef(zoom);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);

  const stepIdxRef = useRef(stepIdx);
  useEffect(() => { stepIdxRef.current = stepIdx; }, [stepIdx]);

  const resultsTabRef = useRef(resultsTab);
  useEffect(() => { resultsTabRef.current = resultsTab; }, [resultsTab]);

  const sim = useSimulation(n, ops, shots, seed);

  // Push state snapshot before modifying operations
  const pushUndoState = () => {
    const current = opsRef.current;
    pastOpsRef.current = [...pastOpsRef.current.slice(-30), current];
    futureOpsRef.current = [];
    setPastCount(pastOpsRef.current.length);
    setFutureCount(0);
  };

  // 1. CIRCUIT EDITING HANDLERS
  const handleUndo = () => {
    if (pastOpsRef.current.length === 0) {
      setMsg('Nothing to undo.');
      return;
    }
    const previous = pastOpsRef.current[pastOpsRef.current.length - 1];
    pastOpsRef.current = pastOpsRef.current.slice(0, -1);
    futureOpsRef.current = [...futureOpsRef.current, opsRef.current];
    setPastCount(pastOpsRef.current.length);
    setFutureCount(futureOpsRef.current.length);

    setCirc(c => ({ ...c, ops: previous }));
    setSelectedOpIds([]);
    setMsg('Undid last action (Ctrl+Z).');
  };

  const handleRedo = () => {
    if (futureOpsRef.current.length === 0) {
      setMsg('Nothing to redo.');
      return;
    }
    const next = futureOpsRef.current[futureOpsRef.current.length - 1];
    futureOpsRef.current = futureOpsRef.current.slice(0, -1);
    pastOpsRef.current = [...pastOpsRef.current, opsRef.current];
    setPastCount(pastOpsRef.current.length);
    setFutureCount(futureOpsRef.current.length);

    setCirc(c => ({ ...c, ops: next }));
    setSelectedOpIds([]);
    setMsg('Redid action (Ctrl+Shift+Z).');
  };

  const handleCopy = () => {
    const currentOps = opsRef.current;
    const currentSel = selectedOpIdsRef.current;
    const targets = currentOps.filter(o => currentSel.includes(o.id));
    if (targets.length > 0) {
      clipboardRef.current = targets.map(o => ({ ...o }));
      setMsg(`Copied ${targets.length} gate(s) to clipboard (Ctrl+C).`);
    } else {
      setMsg('No gates selected to copy. Click a gate on the circuit to select.');
    }
  };

  const handleCut = () => {
    const currentOps = opsRef.current;
    const currentSel = selectedOpIdsRef.current;
    const targets = currentOps.filter(o => currentSel.includes(o.id));
    if (targets.length > 0) {
      clipboardRef.current = targets.map(o => ({ ...o }));
      pushUndoState();
      const targetIds = new Set(targets.map(o => o.id));
      const nextOps = currentOps.filter(o => !targetIds.has(o.id));
      setCirc(c => ({ ...c, ops: nextOps }));
      setSelectedOpIds([]);
      setMsg(`Cut ${targets.length} gate(s) (Ctrl+X).`);
    } else {
      setMsg('No gates selected to cut.');
    }
  };

  const handlePaste = () => {
    const currentClip = clipboardRef.current;
    if (!currentClip || currentClip.length === 0) {
      setMsg('Clipboard is empty. Select gate(s) and press Ctrl+C first.');
      return;
    }
    pushUndoState();
    const currentOps = opsRef.current;
    const minS = Math.min(...currentClip.map(o => o.s ?? 0));

    // Target column
    const selTargets = currentOps.filter(o => selectedOpIdsRef.current.includes(o.id));
    let targetStartS;
    if (selTargets.length > 0) {
      targetStartS = Math.max(...selTargets.map(o => o.s ?? 0)) + 1;
    } else {
      const circuitMaxS = currentOps.reduce((m, o) => Math.max(m, o.s ?? 0), -1);
      targetStartS = circuitMaxS + 1;
    }

    const offsetS = Math.max(0, targetStartS - minS);
    const newOps = currentClip.map(o => ({
      ...o,
      id: nextId(),
      s: (o.s ?? 0) + offsetS
    }));

    setCirc(c => ({
      ...c,
      ops: [...c.ops, ...newOps]
    }));
    setSelectedOpIds(newOps.map(o => o.id));
    setMsg(`Pasted ${newOps.length} gate(s) at column ${targetStartS + 1} (Ctrl+V).`);
  };

  const handleDeleteSelected = () => {
    const currentOps = opsRef.current;
    const currentSel = selectedOpIdsRef.current;
    if (currentSel.length === 0) return;
    pushUndoState();
    const deleteIds = new Set(currentSel);
    const nextOps = currentOps.filter(o => !deleteIds.has(o.id));
    setCirc(c => ({ ...c, ops: nextOps }));
    setMsg(`Deleted ${currentSel.length} gate(s) (Del).`);
    setSelectedOpIds([]);
  };

  const handleSelectAll = () => {
    const currentOps = opsRef.current;
    if (currentOps.length === 0) {
      setMsg('Circuit has no gates to select.');
      return;
    }
    setSelectedOpIds(currentOps.map(o => o.id));
    setMsg(`Selected all ${currentOps.length} gate(s) (Ctrl+A).`);
  };

  const handleDeselect = () => {
    setSelectedOpIds([]);
    setMsg('Deselected gates (Esc).');
  };

  const handleResetCircuit = () => {
    if (opsRef.current.length === 0) return;
    pushUndoState();
    setCirc(c => ({ ...c, note: null, ops: [] }));
    setSelectedOpIds([]);
    setStepIdx(null);
    setMsg('Reset circuit: all gates cleared (Ctrl+R).');
  };

  // 2. SIMULATION CONTROLS HANDLERS
  const handleToggleSimulation = () => {
    setResultsTab('timeline');
    const totalSnapshots = opsRef.current.length + 1;
    setStepIdx(current => {
      const next = current === null ? 0 : (current + 1) % totalSnapshots;
      setMsg(`Simulation step ${next}/${totalSnapshots - 1} (Space).`);
      return next;
    });
  };

  const handleRunCircuit = () => {
    setStepIdx(null);
    setResultsTab('prob');
    setMsg('Simulated circuit to completion (Shift+Enter).');
  };

  const handleResample = () => {
    const newSeed = Math.floor(Math.random() * 100000) + 1;
    setSeed(newSeed);
    setResultsTab('counts');
    setMsg(`Ran measurement sampling with seed ${newSeed} (Ctrl+Enter).`);
  };

  const handleNextStep = () => {
    setResultsTab('timeline');
    const totalSnapshots = opsRef.current.length + 1;
    setStepIdx(current => {
      const next = current === null ? 0 : Math.min(totalSnapshots - 1, current + 1);
      setMsg(`Simulation step ${next}/${totalSnapshots - 1} (N).`);
      return next;
    });
  };

  const handlePrevStep = () => {
    setResultsTab('timeline');
    const totalSnapshots = opsRef.current.length + 1;
    setStepIdx(current => {
      const prev = current === null ? totalSnapshots - 1 : Math.max(0, current - 1);
      setMsg(`Simulation step ${prev}/${totalSnapshots - 1} (P).`);
      return prev;
    });
  };

  // 3. VIEW AND NAVIGATION HANDLERS
  const handleZoomIn = () => {
    setZoom(z => {
      const next = Math.min(2.0, +(z + 0.15).toFixed(2));
      setMsg(`Zoom in: ${Math.round(next * 100)}% (Ctrl++)`);
      return next;
    });
  };

  const handleZoomOut = () => {
    setZoom(z => {
      const next = Math.max(0.5, +(z - 0.15).toFixed(2));
      setMsg(`Zoom out: ${Math.round(next * 100)}% (Ctrl+-)`);
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoom(1.0);
    setMsg('Zoom reset to 100% (Ctrl+0).');
  };

  const handleFitCircuit = () => {
    const maxS = opsRef.current.reduce((m, o) => Math.max(m, o.s ?? 0), 0);
    const cols = Math.max(12, maxS + 4);
    const svgWidth = 64 + cols * 52 + 40;
    const fit = Math.max(0.5, Math.min(1.2, +(820 / svgWidth).toFixed(2)));
    setZoom(fit);
    setMsg(`Fit circuit to view: ${Math.round(fit * 100)}% (F).`);
  };

  // Live angle modifier for rotation gates
  const handleParChange = newPar => {
    setPar(newPar);
    const targetId = selectedOpIds[0];
    if (targetId) {
      setCirc(c => ({
        ...c,
        note: null,
        ops: c.ops.map(o =>
          o.id === targetId ? { ...o, p: newPar * Math.PI } : o
        )
      }));
      const currentOp = ops.find(o => o.id === targetId);
      if (currentOp) {
        setMsg(`Updated ${currentOp.g} angle to ${newPar.toFixed(2)}π rad (${(newPar * 180).toFixed(1)}°)`);
      }
    } else {
      const lastOp = ops[ops.length - 1];
      if (lastOp && GATES[lastOp.g]?.a) {
        setCirc(c => ({
          ...c,
          note: null,
          ops: c.ops.map(o =>
            o.id === lastOp.id ? { ...o, p: newPar * Math.PI } : o
          )
        }));
        setMsg(`Updated ${lastOp.g} angle to ${newPar.toFixed(2)}π rad (${(newPar * 180).toFixed(1)}°)`);
      }
    }
  };

  const insertSubroutine = sub => {
    pushUndoState();
    const currentMaxStep = ops.reduce((m, o) => Math.max(m, o.s ?? 0), -1);
    const startStep = currentMaxStep + 1;

    const newOps = sub.ops.map(o => ({
      ...o,
      s: startStep + (o.s ?? 0),
      id: nextId()
    }));

    setCirc(c => ({
      ...c,
      n: Math.max(c.n, sub.qubits),
      ops: [...c.ops, ...newOps]
    }));
    setSelectedOpIds(newOps.map(o => o.id));
    setMsg(`Inserted subroutine: ${sub.name}`);
  };

  // GLOBAL KEYDOWN LISTENER FOR ALL SHORTCUTS
  useEffect(() => {
    const handleKeyDown = e => {
      const targetTag = e.target?.tagName;
      const isInputActive = targetTag === 'INPUT' || targetTag === 'TEXTAREA' || targetTag === 'SELECT';

      // Escape key clears selection / dismisses modal or blurs input
      if (e.key === 'Escape') {
        if (isInputActive) e.target.blur();
        handleDeselect();
        setShowShortcuts(false);
        return;
      }

      // If user is actively typing in an input field, do not hijack typing keys
      if (isInputActive) return;

      const isCtrl = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;
      const key = e.key;

      // --- 1. Circuit Editing Shortcuts ---
      // Undo: Ctrl+Z (without shift)
      if (isCtrl && !isShift && (key === 'z' || key === 'Z')) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if ((isCtrl && isShift && (key === 'z' || key === 'Z')) || (isCtrl && (key === 'y' || key === 'Y'))) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Copy: Ctrl+C
      if (isCtrl && (key === 'c' || key === 'C')) {
        e.preventDefault();
        handleCopy();
        return;
      }

      // Paste: Ctrl+V
      if (isCtrl && (key === 'v' || key === 'V')) {
        e.preventDefault();
        handlePaste();
        return;
      }

      // Cut: Ctrl+X
      if (isCtrl && (key === 'x' || key === 'X')) {
        e.preventDefault();
        handleCut();
        return;
      }

      // Select All: Ctrl+A
      if (isCtrl && (key === 'a' || key === 'A')) {
        e.preventDefault();
        handleSelectAll();
        return;
      }

      // Delete / Backspace: delete selected
      if (!isCtrl && (key === 'Delete' || key === 'Backspace')) {
        e.preventDefault();
        handleDeleteSelected();
        return;
      }

      // --- 3. Simulation Controls Shortcuts ---
      // Reset circuit: Ctrl+R (e.preventDefault avoids browser reload!)
      if (isCtrl && (key === 'r' || key === 'R')) {
        e.preventDefault();
        handleResetCircuit();
        return;
      }

      // Run measurement sampling: Ctrl+Enter
      if (isCtrl && key === 'Enter') {
        e.preventDefault();
        handleResample();
        return;
      }

      // Run circuit to completion: Shift+Enter
      if (isShift && !isCtrl && key === 'Enter') {
        e.preventDefault();
        handleRunCircuit();
        return;
      }

      // Run / pause simulation step: Space
      if (!isCtrl && (key === ' ' || e.code === 'Space')) {
        e.preventDefault();
        handleToggleSimulation();
        return;
      }

      // Next simulation step: N
      if (!isCtrl && (key === 'n' || key === 'N')) {
        e.preventDefault();
        handleNextStep();
        return;
      }

      // Previous simulation step: P
      if (!isCtrl && (key === 'p' || key === 'P')) {
        e.preventDefault();
        handlePrevStep();
        return;
      }

      // --- 4. View & Navigation Shortcuts ---
      // Zoom in: Ctrl++ or Ctrl+=
      if (isCtrl && (key === '+' || key === '=')) {
        e.preventDefault();
        handleZoomIn();
        return;
      }

      // Zoom out: Ctrl+- or Ctrl+_
      if (isCtrl && (key === '-' || key === '_')) {
        e.preventDefault();
        handleZoomOut();
        return;
      }

      // Reset zoom: Ctrl+0
      if (isCtrl && key === '0') {
        e.preventDefault();
        handleResetZoom();
        return;
      }

      // Fit circuit: F
      if (!isCtrl && (key === 'f' || key === 'F')) {
        e.preventDefault();
        handleFitCircuit();
        return;
      }

      // Open shortcuts reference: ? or Shift+/
      if (key === '?' || (isShift && key === '/')) {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
        return;
      }

      // Toggle gate library: G
      if (!isCtrl && (key === 'g' || key === 'G')) {
        e.preventDefault();
        setShowGateLibrary(prev => !prev);
        return;
      }

      // Open Bloch sphere visualization: B
      if (!isCtrl && (key === 'b' || key === 'B')) {
        e.preventDefault();
        setResultsTab('bl');
        setMsg('Opened Bloch sphere visualization tab (B).');
        return;
      }

      // --- 2. Gate Placement Shortcuts ---
      if (!isCtrl && !e.altKey && !e.metaKey) {
        const upper = key.toUpperCase();
        const GATE_KEYS = {
          I: 'I',
          H: 'H',
          X: 'X',
          Y: 'Y',
          Z: 'Z',
          S: 'S',
          T: 'T',
          M: 'M',
          R: 'Reset'
        };
        if (GATE_KEYS[upper]) {
          e.preventDefault();
          const gate = GATE_KEYS[upper];
          setTool(gate);
          setMsg(`Selected ${GATES[gate]?.name || gate} gate (${upper}). Click a wire to place.`);
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const selectedOp = ops.find(o => selectedOpIds.includes(o.id)) || null;

  return (
    <div className="w">
      {note && (
        <div className="card" style={{ marginBottom: 12, borderColor: 'var(--a)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <b style={{ color: 'var(--c)' }}>{note.name}</b>
              <span className="tag" style={{ marginLeft: 8 }}>{note.type}</span>
              <span className="tag">{note.level}</span>
            </div>
            <button
              style={{ fontSize: 11, padding: '2px 8px' }}
              onClick={() => setCirc(c => ({ ...c, note: null }))}
            >
              Dismiss
            </button>
          </div>
          <div className="m" style={{ margin: '4px 0' }}>{note.description}</div>
          <div className="mono" style={{ fontSize: 12, color: 'var(--ok)' }}>
            Expected Outcome: {note.expected}
          </div>
        </div>
      )}

      {/* Main Studio Grid */}
      <div
        className="studio"
        style={{
          display: 'grid',
          gridTemplateColumns: showGateLibrary ? '230px 1fr' : '1fr',
          gap: 14,
          alignItems: 'start'
        }}
      >
        {/* Left Gate Library Sidebar */}
        {showGateLibrary && (
          <GateLibrary
            tool={tool}
            setTool={setTool}
            par={par}
            setPar={handleParChange}
            selectedOp={selectedOp}
            setSelectedOpId={id => setSelectedOpIds(id ? [id] : [])}
            n={n}
            setN={v => {
              pushUndoState();
              setCirc(c => ({
                n: v,
                note: null,
                ops: c.ops.filter(o => o.q.every(q => q < v))
              }));
            }}
            shots={shots}
            setShots={setShots}
            seed={seed}
            setSeed={setSeed}
            undo={handleUndo}
            redo={handleRedo}
            canUndo={pastCount > 0}
            canRedo={futureCount > 0}
            clear={handleResetCircuit}
            insertSubroutine={insertSubroutine}
          />
        )}

        {/* Right Studio Canvas & Results Panel */}
        <div style={{ minWidth: 0 }}>
          {/* Circuit Canvas Studio Toolbar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
              flexWrap: 'wrap',
              gap: 8,
              background: 'var(--bg)',
              border: '1px solid var(--b)',
              borderRadius: 8,
              padding: '6px 12px'
            }}
          >
            {/* Left: Library Toggle, Undo/Redo & Selection Tools */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowGateLibrary(v => !v)}
                style={{
                  fontSize: 11,
                  padding: '3px 8px',
                  background: showGateLibrary ? 'var(--e)' : 'transparent',
                  borderColor: 'var(--b)'
                }}
                title="Toggle Gate Library sidebar (G)"
              >
                {showGateLibrary ? '◧ Hide Library' : '◨ Show Library'} <span className="mono" style={{ opacity: 0.6 }}>G</span>
              </button>

              <div style={{ width: 1, height: 16, background: 'var(--b)', margin: '0 2px' }} />

              <button
                onClick={handleUndo}
                disabled={pastCount === 0}
                style={{
                  fontSize: 11,
                  padding: '3px 8px',
                  opacity: pastCount === 0 ? 0.4 : 1,
                  cursor: pastCount === 0 ? 'not-allowed' : 'pointer'
                }}
                title="Undo last action (Ctrl+Z)"
              >
                ↺ Undo
              </button>
              <button
                onClick={handleRedo}
                disabled={futureCount === 0}
                style={{
                  fontSize: 11,
                  padding: '3px 8px',
                  opacity: futureCount === 0 ? 0.4 : 1,
                  cursor: futureCount === 0 ? 'not-allowed' : 'pointer'
                }}
                title="Redo action (Ctrl+Shift+Z)"
              >
                ↻ Redo
              </button>

              {selectedOpIds.length > 0 && (
                <>
                  <div style={{ width: 1, height: 16, background: 'var(--b)', margin: '0 2px' }} />
                  <span
                    className="tag mono"
                    style={{
                      fontSize: 11,
                      color: 'var(--c)',
                      borderColor: 'rgba(101, 213, 208, 0.4)',
                      background: 'rgba(101, 213, 208, 0.08)'
                    }}
                  >
                    {selectedOpIds.length} selected
                  </span>
                  <button onClick={handleCopy} style={{ fontSize: 11, padding: '3px 6px' }} title="Copy selected (Ctrl+C)">
                    Copy
                  </button>
                  <button onClick={handleCut} style={{ fontSize: 11, padding: '3px 6px' }} title="Cut selected (Ctrl+X)">
                    Cut
                  </button>
                  <button onClick={handleDeleteSelected} style={{ fontSize: 11, padding: '3px 6px', color: 'var(--er)', borderColor: 'var(--b)' }} title="Delete selected (Del)">
                    Delete
                  </button>
                  <button onClick={handleDeselect} style={{ fontSize: 11, padding: '3px 6px' }} title="Deselect (Esc)">
                    ✕
                  </button>
                </>
              )}
            </div>

            {/* Right: Zoom Controls & Shortcuts Reference Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'var(--p)', borderRadius: 6, border: '1px solid var(--b)', padding: '1px 3px' }}>
                <button
                  onClick={handleZoomOut}
                  style={{ border: 'none', background: 'transparent', padding: '2px 6px', fontSize: 12, cursor: 'pointer' }}
                  title="Zoom out (Ctrl+-)"
                >
                  −
                </button>
                <button
                  onClick={handleResetZoom}
                  style={{ border: 'none', background: 'transparent', padding: '2px 4px', fontSize: 11, minWidth: 38, textAlign: 'center', cursor: 'pointer', fontFamily: 'JetBrains Mono' }}
                  title="Reset zoom to 100% (Ctrl+0)"
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button
                  onClick={handleZoomIn}
                  style={{ border: 'none', background: 'transparent', padding: '2px 6px', fontSize: 12, cursor: 'pointer' }}
                  title="Zoom in (Ctrl++)"
                >
                  +
                </button>
                <button
                  onClick={handleFitCircuit}
                  style={{ border: 'none', background: 'transparent', padding: '2px 6px', fontSize: 10, cursor: 'pointer', borderLeft: '1px solid var(--b)' }}
                  title="Fit circuit to view (F)"
                >
                  Fit
                </button>
              </div>

              {/* Cloud Save & Multi-Format Export Buttons */}
              <button
                onClick={() => setShowSaveModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '3px 9px',
                  fontSize: 12,
                  borderColor: 'rgba(85, 185, 149, 0.4)',
                  color: 'var(--ok)',
                  background: 'rgba(85, 185, 149, 0.08)'
                }}
                title="Save circuit to cloud workspace"
              >
                <span>☁ Save</span>
              </button>

              <button
                onClick={() => setShowExportModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '3px 9px',
                  fontSize: 12,
                  borderColor: 'var(--b)'
                }}
                title="Export circuit to QASM, Qiskit, Cirq, or JSON"
              >
                <span>⤓ Export</span>
              </button>

              {/* Shortcuts Reference Button matching Image 4 & 5 */}
              <button
                onClick={() => setShowShortcuts(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '3px 9px',
                  fontSize: 12,
                  fontWeight: 600,
                  borderColor: 'var(--c)',
                  color: 'var(--c)',
                  background: 'rgba(101, 213, 208, 0.08)'
                }}
                title="Open Keyboard Shortcuts Reference (?)"
              >
                <span>⌨ Shortcuts</span>
                <kbd
                  className="mono"
                  style={{
                    fontSize: 10,
                    padding: '1px 5px',
                    background: '#182131',
                    border: '1px solid #283344',
                    borderRadius: 3,
                    color: '#ECEEF4'
                  }}
                >
                  ?
                </kbd>
              </button>
            </div>
          </div>

          <CircuitCanvas
            circ={circ}
            setCirc={setCirc}
            tool={tool}
            setTool={setTool}
            par={par}
            setPar={setPar}
            selectedOpId={selectedOpIds[0] || null}
            setSelectedOpId={id => setSelectedOpIds(id ? [id] : [])}
            selectedOpIds={selectedOpIds}
            setSelectedOpIds={setSelectedOpIds}
            setMsg={setMsg}
            zoom={zoom}
            pushUndoState={pushUndoState}
          />

          <div
            className="mono"
            style={{
              fontSize: 12,
              margin: '6px 0',
              color: msg ? 'var(--w)' : 'var(--m)'
            }}
          >
            {msg || `Tool: ${tool}. Click a wire coordinate to place gate. ${ops.length} gate(s), ${n} qubit(s). Press '?' for all keyboard shortcuts.`}
          </div>

          <ResultsPanel
            n={n}
            ops={ops}
            sim={sim}
            shots={shots}
            seed={seed}
            tab={resultsTab}
            setTab={setResultsTab}
            stepIdx={stepIdx}
            setStepIdx={setStepIdx}
          />
        </div>
      </div>

      {/* Shortcuts Modal Reference Popup */}
      <ShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      {/* Cloud Save Circuit Modal */}
      <SaveCircuitModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        circ={circ}
        shots={shots}
        onSaved={saved => setMsg(`Circuit "${saved.title}" saved to your cloud workspace!`)}
      />

      {/* Multi-Format Export Modal */}
      <ExportCircuitModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        circ={circ}
        shots={shots}
      />
    </div>
  );
}
