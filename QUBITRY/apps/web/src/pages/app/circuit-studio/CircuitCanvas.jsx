import { useState } from 'react';
import { GATES, PI, nextId } from '@qubitry/quantum-core';

const X = s => 64 + s * 52;
const Y = q => 36 + q * 56;
const F = 'JetBrains Mono, monospace';

const Box = ({ x, y, t, sub, fill = '#182131', stroke = '#A99AFF', strokeWidth = '1.2', isSelected = false }) => (
  <g style={{ cursor: 'pointer' }}>
    {isSelected && (
      <rect
        x={x - 21}
        y={y - 18}
        width="42"
        height="36"
        rx="6"
        fill="none"
        stroke="#65D5D0"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
    )}
    <rect
      x={x - 17}
      y={y - 14}
      width="34"
      height="28"
      rx="4"
      fill={isSelected ? '#142a35' : fill}
      stroke={isSelected ? '#65D5D0' : stroke}
      strokeWidth={isSelected ? '2' : strokeWidth}
    />
    <text x={x} y={y + 4} textAnchor="middle" fill="#ECEEF4" fontSize="12" fontFamily={F} fontWeight={isSelected ? '600' : '400'}>
      {t}
    </text>
    {sub && (
      <text x={x} y={y + 24} textAnchor="middle" fill={isSelected ? '#65D5D0' : '#929CAD'} fontSize="9" fontFamily={F} fontWeight="bold">
        {sub}
      </text>
    )}
  </g>
);

function Op({ o, isSelected, onSelect }) {
  const d = GATES[o.g] || { k: 1 };
  const x = X(o.s);
  const ys = o.q.map(Y);
  const k = o.q.length;
  const mainColor = isSelected ? '#65D5D0' : '#A99AFF';

  return (
    <g onClick={onSelect} style={{ cursor: 'pointer' }}>
      {/* Multi-qubit vertical connecting wire */}
      {k > 1 && (
        <line
          x1={x}
          x2={x}
          y1={Math.min(...ys)}
          y2={Math.max(...ys)}
          stroke={mainColor}
          strokeWidth={isSelected ? '3' : '2'}
        />
      )}

      {o.q.map((q, i) => {
        const y = Y(q);
        const isTarget = i === k - 1;

        // Measurement gate glyph
        if (o.g === 'M') {
          return (
            <g key={i}>
              {isSelected && (
                <rect
                  x={x - 21}
                  y={y - 18}
                  width="42"
                  height="36"
                  rx="6"
                  fill="none"
                  stroke="#65D5D0"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              )}
              <rect
                x={x - 17}
                y={y - 14}
                width="34"
                height="28"
                rx="4"
                fill={isSelected ? '#142a35' : '#111722'}
                stroke={mainColor}
                strokeWidth={isSelected ? '2' : '1.5'}
              />
              {/* Meter arc */}
              <path d={`M${x - 10} ${y + 6} A 10 10 0 0 1 ${x + 10} ${y + 6}`} fill="none" stroke={mainColor} strokeWidth="1.2" />
              {/* Meter pointer needle */}
              <line x1={x} y1={y + 6} x2={x + 6} y2={y - 4} stroke={mainColor} strokeWidth="1.5" />
            </g>
          );
        }

        // Reset gate
        if (o.g === 'Reset') {
          return <Box key={i} x={x} y={y} t="|0⟩" stroke={isSelected ? '#65D5D0' : '#55B995'} fill="#111722" isSelected={isSelected} />;
        }

        // SWAP gate: two crosses
        if (o.g === 'SWAP') {
          return (
            <g key={i}>
              {isSelected && (
                <circle cx={x} cy={y} r="14" fill="#142a35" stroke="#65D5D0" strokeWidth="1.5" strokeDasharray="3 3" />
              )}
              <text x={x} y={y + 7} textAnchor="middle" fill={mainColor} fontSize="22" fontWeight="bold">
                ×
              </text>
            </g>
          );
        }

        // Fredkin (CSWAP): control dot on first qubit, crosses on targets
        if (o.g === 'CSWAP') {
          if (i === 0) {
            return <circle key={i} cx={x} cy={y} r={isSelected ? '7' : '5'} fill={mainColor} />;
          }
          return (
            <g key={i}>
              {isSelected && (
                <circle cx={x} cy={y} r="14" fill="#142a35" stroke="#65D5D0" strokeWidth="1.5" strokeDasharray="3 3" />
              )}
              <text x={x} y={y + 7} textAnchor="middle" fill={mainColor} fontSize="22" fontWeight="bold">
                ×
              </text>
            </g>
          );
        }

        // Controlled operations
        if (!isTarget) {
          // Control circle
          return <circle key={i} cx={x} cy={y} r={isSelected ? '7' : '5'} fill={mainColor} />;
        }

        // Target qubit rendering
        if (d.b === 'X') {
          // Target of CNOT or Toffoli: circle with plus symbol ⊕
          return (
            <g key={i}>
              {isSelected && (
                <circle cx={x} cy={y} r="15" fill="#142a35" stroke="#65D5D0" strokeWidth="1.5" strokeDasharray="3 3" />
              )}
              <circle cx={x} cy={y} r="12" fill="#0B0E14" stroke={mainColor} strokeWidth={isSelected ? '3' : '2'} />
              <path d={`M${x - 12} ${y}H${x + 12}M${x} ${y - 12}V${y + 12}`} stroke={mainColor} strokeWidth={isSelected ? '3' : '2'} />
            </g>
          );
        }

        if (d.b === 'Z') {
          return <circle key={i} cx={x} cy={y} r={isSelected ? '7' : '5'} fill={mainColor} />;
        }

        const label = d.b || o.g;
        const sub = d.a ? `${+(o.p / PI).toFixed(2)}π` : '';
        return <Box key={i} x={x} y={y} t={label} sub={sub} stroke={mainColor} isSelected={isSelected} />;
      })}
    </g>
  );
}

export default function CircuitCanvas({
  circ,
  setCirc,
  tool,
  setTool,
  par,
  setPar,
  selectedOpId,
  setSelectedOpId,
  selectedOpIds = [],
  setSelectedOpIds,
  setMsg,
  zoom = 1.0,
  pushUndoState
}) {
  const { n, ops } = circ;
  const [pend, setPend] = useState(null);
  const maxStep = ops.reduce((m, o) => Math.max(m, o.s ?? 0), 0);
  const cols = Math.max(12, maxStep + 4);

  const edit = f => setCirc(c => ({ ...c, note: null, ops: f(c.ops) }));

  const handleGateClick = (op, e) => {
    e?.stopPropagation?.();
    if (tool === 'Erase') {
      pushUndoState?.();
      setSelectedOpIds?.(prev => prev.filter(id => id !== op.id));
      setSelectedOpId?.(null);
      edit(o => o.filter(x => x.id !== op.id));
      setMsg(`Erased ${op.g} gate.`);
      return;
    }

    // Multi-selection with Shift or Ctrl
    if (e?.shiftKey || e?.ctrlKey || e?.metaKey) {
      if (setSelectedOpIds) {
        setSelectedOpIds(prev => {
          const exists = prev.includes(op.id);
          const next = exists ? prev.filter(id => id !== op.id) : [...prev, op.id];
          setMsg(`${next.length} gate(s) selected.`);
          return next;
        });
      }
    } else {
      setSelectedOpIds?.([op.id]);
      setSelectedOpId?.(op.id);
      const meta = GATES[op.g];
      if (meta?.a) {
        setTool?.(op.g);
        setPar?.(+(op.p / PI).toFixed(4));
        setMsg(`Selected ${op.g} gate (θ = ${(op.p / PI).toFixed(2)}π). Use Angle slider to modify in real time!`);
      } else {
        setMsg(`Selected ${op.g} gate on wire q[${op.q.join(',')}].`);
      }
    }
  };

  function cell(q, s, e) {
    const existingOp = ops.find(o => o.s === s && o.q.includes(q));

    if (existingOp) {
      return handleGateClick(existingOp, e);
    }

    if (tool === 'Erase') return;

    const d = GATES[tool] || { k: 1 };
    let pd = pend && pend.s === s ? pend.qs : [];
    if (pd.includes(q)) {
      return setMsg('Each qubit wire in a multi-qubit gate must be distinct.');
    }

    pd = [...pd, q];
    if (pd.length < d.k) {
      setPend({ s, qs: pd });
      return setMsg(`Placing ${d.name || tool}: click ${d.k - pd.length} more qubit(s) in this column.`);
    }

    pushUndoState?.();
    const newId = nextId();
    setPend(null);
    setSelectedOpIds?.([newId]);
    setSelectedOpId?.(newId);
    setMsg(
      d.a
        ? `Placed ${d.name || tool}. Adjust the Angle slider in the left panel to modify its angle in real time!`
        : `Placed ${d.name || tool} gate on wire q[${pd.join(', ')}].`
    );

    edit(o => [
      ...o,
      {
        g: tool,
        q: pd,
        p: d.a ? par * PI : 0,
        s,
        id: newId
      }
    ]);
  }

  const rawWidth = X(cols) + 40;
  const rawHeight = Y(n - 1) + 48;

  return (
    <div
      className="cv"
      style={{
        overflowX: 'auto',
        overflowY: 'hidden',
        background: 'var(--p)',
        border: '1px solid var(--b)',
        borderRadius: 8,
        padding: '12px 14px',
        position: 'relative'
      }}
      onClick={() => {
        if (!pend) {
          setSelectedOpIds?.([]);
          setSelectedOpId?.(null);
        }
      }}
    >
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: '0 0',
          width: `${rawWidth}px`,
          minHeight: `${rawHeight}px`,
          marginBottom: zoom > 1 ? `${rawHeight * (zoom - 1)}px` : 0,
          marginRight: zoom > 1 ? `${rawWidth * (zoom - 1)}px` : 0,
          transition: 'transform 0.12s ease-out'
        }}
      >
        <svg
          width={rawWidth}
          height={rawHeight}
          role="img"
          aria-label="Interactive Quantum Circuit Canvas"
          style={{ display: 'block' }}
        >
          {/* Wires */}
          {Array.from({ length: n }, (_, q) => (
            <g key={q}>
              <text x="8" y={Y(q) + 4} fill="#ECEEF4" fontSize="12" fontFamily={F} fontWeight="600">
                q[{q}]
              </text>
              <line
                x1="46"
                x2={X(cols) + 20}
                y1={Y(q)}
                y2={Y(q)}
                stroke="#2c3a50"
                strokeWidth="1.5"
              />
            </g>
          ))}

          {/* Clickable wire grid cells */}
          {Array.from({ length: n }, (_, q) =>
            Array.from({ length: cols }, (_, s) => (
              <rect
                key={`${q}-${s}`}
                className="cell"
                x={X(s) - 22}
                y={Y(q) - 22}
                width="44"
                height="44"
                onClick={e => {
                  e.stopPropagation();
                  cell(q, s, e);
                }}
              />
            ))
          )}

          {/* Gates */}
          {ops.map(o => (
            <Op
              key={o.id}
              o={o}
              isSelected={selectedOpIds ? selectedOpIds.includes(o.id) : o.id === selectedOpId}
              onSelect={e => handleGateClick(o, e)}
            />
          ))}

          {/* Multi-qubit placement pending indicator */}
          {pend &&
            pend.qs.map(q => (
              <rect
                key={'p' + q}
                x={X(pend.s) - 20}
                y={Y(q) - 18}
                width="40"
                height="36"
                fill="none"
                stroke="#65D5D0"
                strokeDasharray="4"
                strokeWidth="1.5"
                pointerEvents="none"
              />
            ))}
        </svg>
      </div>
    </div>
  );
}
