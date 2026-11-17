const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const prismaBin = path.join(
  __dirname,
  '..',
  'node_modules',
  'prisma',
  'build',
  'index.js'
);

const isWindows = process.platform === 'win32';
const args = ['generate', '--schema=prisma/schema.prisma'];

let result;
if (fs.existsSync(prismaBin)) {
  result = spawnSync(process.execPath, [prismaBin, ...args], {
    stdio: 'inherit',
    env: process.env,
  });
} else {
  const cmd = isWindows ? 'npx.cmd' : 'npx';
  result = spawnSync(cmd, ['prisma', ...args], {
    stdio: 'inherit',
    env: process.env,
  });
}

if (result.status !== 0) {
  if (process.env.VERCEL || process.env.CI) {
    console.error('\n❌ Prisma generation failed during CI/Vercel build.');
    process.exit(result.status || 1);
  }

  const clientDir = path.join(__dirname, '..', 'node_modules', '.prisma', 'client');
  const clientPath = path.join(clientDir, 'index.js');

  // Clean up any stray .tmp files left by aborted rename attempts
  try {
    if (fs.existsSync(clientDir)) {
      const files = fs.readdirSync(clientDir);
      for (const file of files) {
        if (file.includes('.tmp')) {
          try {
            fs.unlinkSync(path.join(clientDir, file));
          } catch {}
        }
      }
    }
  } catch {}

  if (fs.existsSync(clientPath)) {
    console.warn(
      '\n⚠️ [Notice] `query_engine-windows.dll.node` is currently locked by a running process (e.g. `bun dev` or `next dev`).'
    );
    console.warn(
      'Proceeding with the existing generated Prisma Client for this build.\n'
    );
    process.exit(0);
  } else {
    console.error('\n❌ Prisma Client has not been generated and engine is inaccessible.');
    process.exit(result.status || 1);
  }
}
