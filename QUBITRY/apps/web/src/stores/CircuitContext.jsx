import { createContext, useContext, useState } from 'react';
import { PRESETS, buildCircuit } from '@qubitry/quantum-algorithms';
const Ctx = createContext(null);
export const CircuitProvider = ({ children }) => { const [circ, setCirc] = useState(() => buildCircuit(PRESETS[0])); return <Ctx.Provider value={{ circ, setCirc }}>{children}</Ctx.Provider>; };
export const useCircuit = () => useContext(Ctx);
