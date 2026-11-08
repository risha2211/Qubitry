import { useState, useRef } from 'react'; import { PI, angles } from '@qubitry/quantum-core';
// Dragging rotates the VIEW only; the state vector `v` is a prop.
export default function BlochSphere({ v, size = 280 }) {
  const [vw, setVw] = useState([.6, .35]), drag = useRef(null), R = size * .38, c = size / 2;
  const pr = (x, y, z) => { const [a, p] = vw, u = x*Math.cos(a) - y*Math.sin(a), b = x*Math.sin(a) + y*Math.cos(a); return [c + R*u, c - R*(b*Math.sin(p) + z*Math.cos(p))]; };
  const ring = f => 'M' + Array.from({ length: 65 }, (_, i) => pr(...f(i / 64 * 2 * PI)).map(n => n.toFixed(1)).join(' ')).join('L');
  const tip = pr(...v), text = { fill: '#929CAD', fontSize: 11, fontFamily: 'JetBrains Mono' };
  return <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', maxWidth: size, touchAction: 'none', cursor: 'grab' }} tabIndex={0} role="img" aria-label="Bloch sphere; drag or use arrow keys to rotate the view"
    onPointerDown={e => { drag.current = [e.clientX, e.clientY]; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerUp={() => drag.current = null}
    onPointerMove={e => { if (!drag.current) return; const dx = e.clientX - drag.current[0], dy = e.clientY - drag.current[1]; drag.current = [e.clientX, e.clientY]; setVw(([a, p]) => [a + dx*.01, Math.max(-1.4, Math.min(1.4, p + dy*.01))]); }}
    onKeyDown={e => { const d = { ArrowLeft:[-.1,0], ArrowRight:[.1,0], ArrowUp:[0,-.1], ArrowDown:[0,.1] }[e.key]; if (d) { e.preventDefault(); setVw(([a, p]) => [a + d[0], p + d[1]]); } }}>
    <circle cx={c} cy={c} r={R} fill="#111722" stroke="#283344" />
    {[t => [Math.cos(t), Math.sin(t), 0], t => [Math.cos(t), 0, Math.sin(t)], t => [0, Math.cos(t), Math.sin(t)]].map((f, i) => <path key={i} d={ring(f)} fill="none" stroke="#283344" />)}
    {[[[1,0,0],'x'],[[0,1,0],'y']].map(([p, t]) => { const q = pr(...p); return <g key={t}><line x1={c} y1={c} x2={q[0]} y2={q[1]} stroke="#283344" /><text x={q[0]+4} y={q[1]-4} {...text}>{t}</text></g>; })}
    <line x1={c} y1={c} x2={pr(0,0,1)[0]} y2={pr(0,0,1)[1]} stroke="#283344" />
    <text x={pr(0,0,1.2)[0]+4} y={pr(0,0,1.2)[1]} {...text}>|0⟩</text><text x={pr(0,0,-1.3)[0]+4} y={pr(0,0,-1.3)[1]} {...text}>|1⟩</text>
    <line x1={c} y1={c} x2={tip[0]} y2={tip[1]} stroke="#65D5D0" strokeWidth="2.5" /><circle cx={tip[0]} cy={tip[1]} r="5" fill="#65D5D0" />
  </svg>;
}
export function BlochReadout({ v }) {
  const a = angles(v), flat = a.r < 1e-6, pole = flat || a.theta < 1e-6 || Math.abs(a.theta - 180) < 1e-6;
  return <div className="mono m" style={{ fontSize: 12 }}>{`r=${a.r.toFixed(3)} θ=${flat ? '–' : a.theta.toFixed(1) + '°'} φ=${pole ? '–' : a.phi.toFixed(1) + '°'}`}</div>;
}
