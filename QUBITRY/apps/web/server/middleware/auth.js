import jwt from 'jsonwebtoken';
import { UserStore } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'qubitry_super_quantum_jwt_secret_key_2026_risha';

export async function requireAuth(req, res, next) {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token missing. Please log in.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await UserStore.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session or user not found. Please log in again.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    });
  }
}

export async function optionalAuth(req, res, next) {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await UserStore.findById(decoded.id);
      if (user) req.user = user;
    }
    next();
  } catch {
    // Non-blocking for optional auth
    next();
  }
}

export function generateToken(user) {
  const payload = {
    id: user._id || user.id,
    username: user.username,
    email: user.email,
    role: user.role || 'user'
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

