import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { getDBStatus } from '../config/db.js';
import { localDB } from '../config/localStore.js';

// Mongoose User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
      type: String,
      enum: ['user', 'researcher', 'admin'],
      default: 'user'
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving in Mongoose
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method on instance
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON representation
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

export const UserStore = {
  async findByEmail(email) {
    const status = getDBStatus();
    const cleanEmail = email.toLowerCase().trim();
    if (status.connected) {
      try {
        return await UserModel.findOne({ email: cleanEmail });
      } catch (e) {
        console.warn('[UserStore] Fallback to local store on Mongoose error:', e.message);
      }
    }
    const users = localDB.getUsers();
    return users.find(u => u.email.toLowerCase() === cleanEmail) || null;
  },

  async findByUsername(username) {
    const status = getDBStatus();
    const cleanName = username.trim();
    if (status.connected) {
      try {
        return await UserModel.findOne({ username: cleanName });
      } catch (e) {
        console.warn('[UserStore] Fallback to local store on Mongoose error:', e.message);
      }
    }
    const users = localDB.getUsers();
    return users.find(u => u.username.toLowerCase() === cleanName.toLowerCase()) || null;
  },

  async findById(id) {
    const status = getDBStatus();
    if (status.connected) {
      try {
        return await UserModel.findById(id).select('-password');
      } catch (e) {
        console.warn('[UserStore] Fallback to local store on Mongoose error:', e.message);
      }
    }
    const users = localDB.getUsers();
    const u = users.find(x => String(x.id || x._id) === String(id));
    if (!u) return null;
    const { password, ...safe } = u;
    return safe;
  },

  async create({ username, email, password }) {
    const status = getDBStatus();
    if (status.connected) {
      try {
        const newUser = new UserModel({ username, email, password });
        await newUser.save();
        return newUser;
      } catch (e) {
        console.warn('[UserStore] Fallback to local store on Mongoose save error:', e.message);
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const userObj = {
      _id: id,
      id,
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localDB.saveUser(userObj);
    return userObj;
  }
};
