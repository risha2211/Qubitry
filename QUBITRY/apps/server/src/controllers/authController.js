import bcrypt from 'bcryptjs';
import { UserStore } from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

async function verifyPassword(user, password) {
  try {
    if (typeof user.comparePassword === 'function') {
      return await user.comparePassword(password);
    }
    if (user.password) {
      return await bcrypt.compare(password, user.password);
    }
  } catch (err) {
    console.error('[VerifyPassword Error]:', err);
  }
  return false;
}

export async function register(req, res) {
  try {
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required.'
      });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters long.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // Check existing email
    const existingEmail = await UserStore.findByEmail(email);
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    // Check existing username
    const existingName = await UserStore.findByUsername(username);
    if (existingName) {
      return res.status(409).json({
        success: false,
        message: 'Username is already taken. Please choose another.'
      });
    }

    const user = await UserStore.create({ username, email, password });
    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'User account created successfully.',
      token,
      user: {
        id: user._id || user.id,
        username: user.username,
        email: user.email,
        role: user.role || 'user'
      }
    });
  } catch (err) {
    console.error('[Auth Register Error]:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal server error registering account.'
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    const user = await UserStore.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.'
      });
    }

    const isMatch = await verifyPassword(user, password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.'
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id || user.id,
        username: user.username,
        email: user.email,
        role: user.role || 'user'
      }
    });
  } catch (err) {
    console.error('[Auth Login Error]:', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Internal server error logging in.'
    });
  }
}

export async function getMe(req, res) {
  try {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id || req.user.id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role || 'user'
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile.'
    });
  }
}
