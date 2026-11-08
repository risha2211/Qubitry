import { useMemo } from 'react'; import { simulate, probabilities, sampleCounts } from '@qubitry/quantum-core';
export function useSimulation(n, ops, shots, seed) {
  const sv = useMemo(() => simulate(n, ops), [n, ops]), probs = useMemo(() => probabilities(sv), [sv]);
  const counts = useMemo(() => sampleCounts(probs, shots, seed), [probs, shots, seed]);
  return { sv, probs, counts };
}
