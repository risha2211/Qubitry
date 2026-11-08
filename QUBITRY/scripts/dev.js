import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const qubitryDir = path.resolve(__dirname, '..');

const isWindows = process.platform === 'win32';

console.log('🚀 Starting Qubitry Platform (Backend + Frontend)...');

// 1. Start Express Backend
const serverDir = path.join(qubitryDir, 'apps', 'server');
const serverProc = spawn('node', ['src/server.js'], {
  cwd: serverDir,
  stdio: 'inherit',
  shell: isWindows,
  env: { ...process.env, PORT: '5000' }
});

serverProc.on('error', (err) => {
  console.error('[Backend Error]:', err);
});

// 2. Start Vite Frontend
const webDir = path.join(qubitryDir, 'apps', 'web');
const webProc = spawn(isWindows ? 'npm.cmd' : 'npm', ['run', 'dev'], {
  cwd: webDir,
  stdio: 'inherit',
  shell: isWindows,
  env: { ...process.env }
});

webProc.on('error', (err) => {
  console.error('[Frontend Error]:', err);
});

function cleanup() {
  console.log('\n🛑 Shutting down Qubitry services...');
  serverProc.kill();
  webProc.kill();
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
