import mongoose from 'mongoose';
import { getDBStatus } from '../config/db.js';
import { localDB } from '../config/localStore.js';

// Mongoose Circuit Schema
const circuitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Circuit title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    qubits: {
      type: Number,
      required: true,
      min: [1, 'Must have at least 1 qubit'],
      max: [6, 'Simulator supports up to 6 qubits']
    },
    ops: {
      type: [
        {
          g: { type: String, required: true },
          q: { type: [Number], required: true },
          s: { type: Number, required: true },
          p: { type: Number, default: 0 },
          id: { type: mongoose.Schema.Types.Mixed }
        }
      ],
      default: []
    },
    userId: {
      type: mongoose.Schema.Types.Mixed,
      ref: 'User',
      required: true
    },
    author: {
      type: String,
      default: 'Anonymous'
    },
    tags: {
      type: [String],
      default: []
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    shots: {
      type: Number,
      default: 1024
    }
  },
  {
    timestamps: true
  }
);

export const CircuitModel = mongoose.models.Circuit || mongoose.model('Circuit', circuitSchema);

export const CircuitStore = {
  async listByUser(userId, { search = '', tag = '' } = {}) {
    const status = getDBStatus();
    if (status.connected) {
      try {
        const query = {
          $or: [{ userId }, { isPublic: true }]
        };
        if (search) query.title = { $regex: search, $options: 'i' };
        if (tag) query.tags = tag;
        return await CircuitModel.find(query).sort({ updatedAt: -1 });
      } catch (e) {
        console.warn('[CircuitStore] Fallback to local store:', e.message);
      }
    }

    let items = localDB.getCircuits().filter(
      c => c.userId === userId || c.isPublic || c.userId === 'user_default_1'
    );

    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        c =>
          (c.title || '').toLowerCase().includes(q) ||
          (c.description || '').toLowerCase().includes(q)
      );
    }

    if (tag) {
      items = items.filter(c => Array.isArray(c.tags) && c.tags.includes(tag));
    }

    return items.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
  },

  async findById(id) {
    const status = getDBStatus();
    if (status.connected) {
      try {
        return await CircuitModel.findById(id);
      } catch (e) {
        console.warn('[CircuitStore] Fallback to local store:', e.message);
      }
    }
    const circuits = localDB.getCircuits();
    return circuits.find(c => String(c.id || c._id) === String(id)) || null;
  },

  async create(data) {
    const status = getDBStatus();
    if (status.connected) {
      try {
        const newCircuit = new CircuitModel(data);
        await newCircuit.save();
        return newCircuit;
      } catch (e) {
        console.warn('[CircuitStore] Fallback to local store:', e.message);
      }
    }

    const id = `circuit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newCircuit = {
      _id: id,
      id,
      title: data.title,
      description: data.description || '',
      qubits: data.qubits,
      ops: [...(data.ops || [])],
      userId: data.userId,
      author: data.author || 'User',
      tags: data.tags || [],
      isPublic: !!data.isPublic,
      shots: data.shots || 1024,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return localDB.saveCircuit(newCircuit);
  },

  async update(id, userId, updates) {
    const status = getDBStatus();
    if (status.connected) {
      try {
        const circuit = await CircuitModel.findOne({ _id: id, userId });
        if (circuit) {
          Object.assign(circuit, updates);
          await circuit.save();
          return circuit;
        }
      } catch (e) {
        console.warn('[CircuitStore] Fallback to local store:', e.message);
      }
    }

    const circuits = localDB.getCircuits();
    const existing = circuits.find(c => String(c.id || c._id) === String(id));
    if (!existing) return null;
    if (existing.userId !== userId && existing.userId !== 'user_default_1') return null;

    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return localDB.saveCircuit(updated);
  },

  async delete(id, userId) {
    const status = getDBStatus();
    if (status.connected) {
      try {
        const res = await CircuitModel.findOneAndDelete({ _id: id, userId });
        if (res) return true;
      } catch (e) {
        console.warn('[CircuitStore] Fallback to local store:', e.message);
      }
    }
    return localDB.deleteCircuit(String(id), userId);
  }
};
