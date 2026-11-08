export const bitstring = (i, n) => i.toString(2).padStart(n, '0');

export const probabilities = sv => Array.from(sv.re, (r, i) => r * r + sv.im[i] * sv.im[i]);

/**
 * Computes single-qubit reduced density matrix via partial trace,
 * and extracts the exact Bloch vector [x, y, z].
 * rho = [[rho00, rho01], [rho10, rho11]]
 * x = 2 * Re(rho01), y = -2 * Im(rho01), z = rho00 - rho11
 */
export function blochVector(sv, n, q) {
  let x = 0, y = 0, z = 0;
  const N = 1 << n;
  for (let i = 0; i < N; i++) {
    if ((i >> q & 1) !== 0) continue;
    const j = i | (1 << q);
    x += 2 * (sv.re[i] * sv.re[j] + sv.im[i] * sv.im[j]);
    y -= 2 * (sv.im[i] * sv.re[j] - sv.re[i] * sv.im[j]);
    z += (sv.re[i]**2 + sv.im[i]**2) - (sv.re[j]**2 + sv.im[j]**2);
  }
  return [x, y, z];
}

export function angles(v) {
  const r = Math.hypot(...v);
  return {
    r,
    theta: r > 1e-9 ? Math.acos(Math.max(-1, Math.min(1, v[2] / r))) * 180 / Math.PI : 0,
    phi: (Math.atan2(v[1], v[0]) * 180 / Math.PI + 360) % 360
  };
}

/**
 * Computes the 2x2 reduced density matrix rho_q = Tr_{others}(|psi><psi|)
 * Returns { re: [[r00, r01], [r10, r11]], im: [[i00, i01], [i10, i11]], purity }
 */
export function singleQubitDensityMatrix(sv, n, q) {
  let r00 = 0, r11 = 0;
  let r01 = 0, i01 = 0;
  const N = 1 << n;

  for (let i = 0; i < N; i++) {
    if ((i >> q & 1) !== 0) continue;
    const j = i | (1 << q);
    r00 += sv.re[i]**2 + sv.im[i]**2;
    r11 += sv.re[j]**2 + sv.im[j]**2;
    // rho01 = sum a_i * conj(a_j) = (re_i + i*im_i)(re_j - i*im_j)
    r01 += sv.re[i]*sv.re[j] + sv.im[i]*sv.im[j];
    i01 += sv.im[i]*sv.re[j] - sv.re[i]*sv.im[j];
  }

  // Purity = Tr(rho^2) = r00^2 + r11^2 + 2*(r01^2 + i01^2)
  const purity = r00*r00 + r11*r11 + 2 * (r01*r01 + i01*i01);

  return {
    re: [[r00, r01], [r01, r11]],
    im: [[0, i01], [-i01, 0]],
    purity
  };
}

/**
 * Computes the von Neumann entanglement entropy S(rho_A) = -Tr(rho_A * log2(rho_A))
 * for a single-qubit subsystem q of a pure statevector.
 * For a 2x2 density matrix, eigenvalues are lambda_{1,2} = (1 +/- r) / 2
 * where r is the length of the Bloch vector.
 */
export function subsystemEntropy(sv, n, q) {
  const v = blochVector(sv, n, q);
  const r = Math.min(1.0, Math.hypot(...v));
  if (r >= 0.999999) return 0; // Pure / separable state

  const l1 = (1 + r) / 2;
  const l2 = (1 - r) / 2;
  let s = 0;
  if (l1 > 1e-12) s -= l1 * Math.log2(l1);
  if (l2 > 1e-12) s -= l2 * Math.log2(l2);
  return Math.max(0, s);
}

/**
 * Formats a statevector into mathematical Dirac notation |psi> = sum c_i |i>
 */
export function formatDirac(sv, n) {
  const terms = [];
  const N = 1 << n;
  for (let i = 0; i < N; i++) {
    const r = sv.re[i];
    const im = sv.im[i];
    const mag = Math.hypot(r, im);
    if (mag > 1e-4) {
      let coeff = '';
      if (Math.abs(im) < 1e-4) {
        coeff = r.toFixed(3);
      } else if (Math.abs(r) < 1e-4) {
        coeff = `${im > 0 ? '' : '-'}${Math.abs(im).toFixed(3)}i`;
      } else {
        coeff = `(${r.toFixed(3)} ${im > 0 ? '+' : '-'} ${Math.abs(im).toFixed(3)}i)`;
      }
      terms.push(`${coeff}|${bitstring(i, n)}⟩`);
    }
  }
  return terms.length > 0 ? terms.join(' + ') : '|0...0⟩';
}

export function mulberry32(a) {
  return () => {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Seeded sampling of measurement outcomes from exact probabilities -> {index: count}
export function sampleCounts(probs, shots, seed) {
  const r = mulberry32(seed), cum = [];
  let a = 0;
  probs.forEach(p => { a += p; cum.push(a); });
  const m = {};
  for (let k = 0; k < shots; k++) {
    const u = r() * a;
    let i = 0;
    while (i < probs.length - 1 && cum[i] < u) i++;
    m[i] = (m[i] || 0) + 1;
  }
  return m;
}
