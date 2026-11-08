import { CircuitStore } from '../models/Circuit.js';
import { toOpenQASM, toQiskit, toCirq, toJSON } from '../utils/exporters.js';

export async function createCircuit(req, res) {
  try {
    const { title, description, qubits, ops, tags, isPublic, shots } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Circuit title is required.'
      });
    }

    const n = Number(qubits) || 2;
    if (n < 1 || n > 6) {
      return res.status(400).json({
        success: false,
        message: 'Qubit count must be between 1 and 6.'
      });
    }

    const userId = req.user._id || req.user.id;
    const author = req.user.username || 'User';

    const newCircuit = await CircuitStore.create({
      title: title.trim(),
      description: description || '',
      qubits: n,
      ops: Array.isArray(ops) ? ops : [],
      tags: Array.isArray(tags) ? tags : [],
      isPublic: !!isPublic,
      shots: Number(shots) || 1024,
      userId,
      author
    });

    return res.status(201).json({
      success: true,
      message: 'Circuit saved to your cloud workspace.',
      circuit: newCircuit
    });
  } catch (err) {
    console.error('[Create Circuit Error]:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Failed to save circuit.'
    });
  }
}

export async function getCircuits(req, res) {
  try {
    const userId = req.user ? (req.user._id || req.user.id) : null;
    const { search, tag } = req.query;

    const circuits = await CircuitStore.listByUser(userId, { search, tag });

    return res.status(200).json({
      success: true,
      count: circuits.length,
      circuits
    });
  } catch (err) {
    console.error('[Get Circuits Error]:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve circuits.'
    });
  }
}

export async function getCircuitById(req, res) {
  try {
    const { id } = req.params;
    const circuit = await CircuitStore.findById(id);

    if (!circuit) {
      return res.status(404).json({
        success: false,
        message: 'Circuit not found.'
      });
    }

    const userId = req.user ? (req.user._id || req.user.id) : null;
    if (!circuit.isPublic && circuit.userId !== userId && circuit.userId !== 'system') {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this private circuit.'
      });
    }

    return res.status(200).json({
      success: true,
      circuit
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve circuit.'
    });
  }
}

export async function updateCircuit(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;
    const { title, description, qubits, ops, tags, isPublic, shots } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description;
    if (qubits !== undefined) updates.qubits = Number(qubits);
    if (ops !== undefined) updates.ops = ops;
    if (tags !== undefined) updates.tags = tags;
    if (isPublic !== undefined) updates.isPublic = !!isPublic;
    if (shots !== undefined) updates.shots = Number(shots);

    const updated = await CircuitStore.update(id, userId, updates);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Circuit not found or you lack permission to update it.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Circuit updated successfully.',
      circuit: updated
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update circuit.'
    });
  }
}

export async function deleteCircuit(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    const deleted = await CircuitStore.delete(id, userId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Circuit not found or you lack permission to delete it.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Circuit deleted successfully.'
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete circuit.'
    });
  }
}

export async function forkCircuit(req, res) {
  try {
    const { id } = req.params;
    const source = await CircuitStore.findById(id);

    if (!source) {
      return res.status(404).json({
        success: false,
        message: 'Source circuit not found.'
      });
    }

    const userId = req.user._id || req.user.id;
    const forked = await CircuitStore.create({
      title: `${source.title} (Fork)`,
      description: source.description || `Forked from ${source.title}`,
      qubits: source.qubits,
      ops: [...(source.ops || [])],
      tags: [...(source.tags || []), 'forked'],
      isPublic: false,
      shots: source.shots || 1024,
      userId,
      author: req.user.username || 'User'
    });

    return res.status(201).json({
      success: true,
      message: 'Circuit forked to your workspace.',
      circuit: forked
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fork circuit.'
    });
  }
}

export async function exportCircuit(req, res) {
  try {
    const { id } = req.params;
    const { format = 'qasm', download = 'false' } = req.query;

    const circuit = await CircuitStore.findById(id);
    if (!circuit) {
      return res.status(404).json({
        success: false,
        message: 'Circuit not found.'
      });
    }

    let code = '';
    let mimeType = 'text/plain';
    let fileExt = 'txt';

    switch (format.toLowerCase()) {
      case 'qasm':
      case 'openqasm':
        code = toOpenQASM(circuit, 2);
        fileExt = 'qasm';
        break;
      case 'qasm3':
        code = toOpenQASM(circuit, 3);
        fileExt = 'qasm';
        break;
      case 'qiskit':
      case 'python':
        code = toQiskit(circuit);
        mimeType = 'text/x-python';
        fileExt = 'py';
        break;
      case 'cirq':
        code = toCirq(circuit);
        mimeType = 'text/x-python';
        fileExt = 'py';
        break;
      case 'json':
      default:
        code = toJSON(circuit);
        mimeType = 'application/json';
        fileExt = 'json';
        break;
    }

    if (download === 'true') {
      const safeTitle = (circuit.title || 'circuit').replace(/[^a-zA-Z0-9_-]/g, '_');
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.${fileExt}"`);
      return res.send(code);
    }

    return res.status(200).json({
      success: true,
      format,
      filename: `${(circuit.title || 'circuit').replace(/[^a-zA-Z0-9_-]/g, '_')}.${fileExt}`,
      code
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to export circuit.'
    });
  }
}

export async function importCircuit(req, res) {
  try {
    const { data, title } = req.body;
    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'Import data is required (JSON format).'
      });
    }

    let parsed = typeof data === 'string' ? JSON.parse(data) : data;
    const circuitData = parsed.circuit || parsed;

    const userId = req.user._id || req.user.id;
    const author = req.user.username || 'User';

    const newCircuit = await CircuitStore.create({
      title: title || circuitData.title || 'Imported Quantum Circuit',
      description: circuitData.description || 'Imported into Qubitry Workspace',
      qubits: Math.max(1, Math.min(6, circuitData.qubits || circuitData.n || 2)),
      ops: Array.isArray(circuitData.ops) ? circuitData.ops : [],
      tags: Array.isArray(circuitData.tags) ? circuitData.tags : ['imported'],
      isPublic: false,
      shots: circuitData.shots || 1024,
      userId,
      author
    });

    return res.status(201).json({
      success: true,
      message: 'Circuit imported successfully.',
      circuit: newCircuit
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid circuit JSON format.'
    });
  }
}

