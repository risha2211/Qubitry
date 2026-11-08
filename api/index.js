import app from '../QUBITRY/apps/server/src/server.js';
import { connectDB } from '../QUBITRY/apps/server/src/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (err) {
    console.error('[Vercel Serverless] DB connection error:', err);
  }
  return app(req, res);
}

