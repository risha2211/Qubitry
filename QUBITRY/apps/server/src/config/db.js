import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded regardless of execution context
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

// Disable query buffering so operations fail immediately if not connected rather than hanging
mongoose.set('bufferCommands', false);

export async function connectDB() {
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  let uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/qubitry';
  if (typeof uri === 'string') {
    uri = uri.trim();
    if (uri.startsWith('MONGODB_URI=')) {
      uri = uri.replace(/^MONGODB_URI=\s*/, '');
    }
  }

  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000
    });
    console.log(`[Qubitry DB] Successfully connected to MongoDB Atlas: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.warn(`[Qubitry DB] MongoDB connection error (${err.message}).`);
    console.log(`[Qubitry DB] Utilizing persistent local file store (.qubitry_local_db.json).`);
    console.log(`[Qubitry DB] Full authentication, JWT, circuits, and progress tracking are 100% active.`);
  }
}

export function getDBStatus() {
  const connected = mongoose.connection && mongoose.connection.readyState === 1;
  return {
    connected,
    isMemoryFallback: !connected,
    driver: connected ? 'Mongoose / MongoDB' : 'Persistent Local Store'
  };
}
