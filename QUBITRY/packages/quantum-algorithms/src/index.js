import { nextId } from '../../quantum-core/src/gates.js';
import { foundations } from './foundations.js';
import { oracle } from './oracle.js';
import { search } from './search.js';
import { fourier } from './fourier.js';

export { foundations, oracle, search, fourier };

export const PRESETS = [...foundations, ...oracle, ...search, ...fourier];

// Convert a preset's column spec into circuit operations
export const buildCircuit = preset => ({
  n: preset.n,
  note: preset,
  ops: preset.cols.flatMap((c, s) =>
    c.map(([g, q, p]) => ({
      g,
      q,
      p: p || 0,
      s,
      id: nextId()
    }))
  )
});
