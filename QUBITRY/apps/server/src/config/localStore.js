import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.resolve(__dirname, '../../.qubitry_local_db.json');

// Default initial state
const defaultData = {
  users: [
    {
      _id: 'user_default_1',
      id: 'user_default_1',
      username: 'Risha',
      email: 'risha@qubitry.org',
      // bcrypt hash for 'password123'
      password: '$2a$10$wT0lU8Fk5P5m6FzM0mH8Ou8Z9G6F3o9R6gVw0q6L8Z3xX2r9s3a4K',
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  circuits: [
    {
      _id: 'circuit_default_bell',
      id: 'circuit_default_bell',
      title: 'Bell State Superposition |Φ⁺⟩',
      description: 'Canonical maximally entangled Bell pair prepared on qubits q0 and q1.',
      qubits: 2,
      ops: [
        { g: 'H', q: [0], s: 0, p: 0, id: 1 },
        { g: 'CX', q: [0, 1], s: 1, p: 0, id: 2 }
      ],
      userId: 'user_default_1',
      author: 'Risha',
      tags: ['entanglement', 'bell-state', 'superposition'],
      isPublic: true,
      shots: 1024,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  progress: {}
};

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[LocalStore Read Error]:', err);
    return defaultData;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[LocalStore Write Error]:', err);
  }
}

export const localDB = {
  getUsers() {
    return readDb().users || [];
  },
  saveUser(user) {
    const db = readDb();
    const existingIdx = db.users.findIndex(u => u.id === user.id || u.email === user.email);
    if (existingIdx >= 0) {
      db.users[existingIdx] = { ...db.users[existingIdx], ...user };
    } else {
      db.users.push(user);
    }
    writeDb(db);
    return user;
  },
  getCircuits() {
    return readDb().circuits || [];
  },
  saveCircuit(circuit) {
    const db = readDb();
    const existingIdx = db.circuits.findIndex(c => c.id === circuit.id || c._id === circuit._id);
    if (existingIdx >= 0) {
      db.circuits[existingIdx] = { ...db.circuits[existingIdx], ...circuit };
    } else {
      db.circuits.unshift(circuit);
    }
    writeDb(db);
    return circuit;
  },
  deleteCircuit(id, userId) {
    const db = readDb();
    const initialLen = db.circuits.length;
    db.circuits = db.circuits.filter(c => !((c.id === id || c._id === id) && (c.userId === userId || c.userId === 'user_default_1')));
    writeDb(db);
    return db.circuits.length < initialLen;
  },
  getProgress(userId) {
    const db = readDb();
    return (db.progress && db.progress[userId]) || null;
  },
  saveProgress(userId, progressData) {
    const db = readDb();
    if (!db.progress) db.progress = {};
    db.progress[userId] = { ...(db.progress[userId] || {}), ...progressData, updatedAt: new Date().toISOString() };
    writeDb(db);
    return db.progress[userId];
  }
};

