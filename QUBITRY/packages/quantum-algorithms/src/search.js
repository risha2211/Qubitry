import { layer } from './util.js';
const ccz = [[['H',[2]]],[['CCX',[0,1,2]]],[['H',[2]]]];
const diffuser3 = [layer('H',3), layer('X',3), ...ccz, layer('X',3), layer('H',3)];
export const search = [
 { id:'g2', name:'Grover search (2 qubits)', type:'Circuit Simulation', level:'Intermediate', n:2,
   cols:[layer('H',2),[['CZ',[0,1]]],layer('H',2),layer('X',2),[['CZ',[0,1]]],layer('X',2),layer('H',2)],
   description:'One Grover iteration marking |11⟩; for N=4 the success probability is exactly 1.', expected:'P(11)=1' },
 { id:'g3', name:'Grover search (3 qubits, 2 iterations)', type:'Circuit Simulation', level:'Intermediate', n:3,
   cols:[layer('H',3), ...ccz, ...diffuser3, ...ccz, ...diffuser3],
   description:'Marks |111⟩ with CCZ = H·Toffoli·H. Optimal iterations ≈ ⌊π/4·√8⌋ = 2.', expected:'P(111)≈0.9453' }
];
