import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { URL, fileURLToPath } from 'node:url';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));

export function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: 'utf8',
    stdio: 'inherit',
    ...options
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} exited with ${result.status}`);
  }
}

export function writeFixture(root, files) {
  for (const [relativePath, contents] of Object.entries(files)) {
    const target = join(root, relativePath);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, contents);
  }
}

export function withPackedConsumer(prefix, callback) {
  const temporaryRoot = mkdtempSync(join(tmpdir(), prefix));
  const packRoot = join(temporaryRoot, 'package');
  const consumerRoot = join(temporaryRoot, 'consumer');
  mkdirSync(packRoot, { recursive: true });
  mkdirSync(consumerRoot, { recursive: true });

  try {
    const result = spawnSync(
      'npm',
      ['pack', '--json', '--pack-destination', packRoot],
      { cwd: projectRoot, encoding: 'utf8' }
    );
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(result.stderr || 'npm pack failed');

    const [{ filename }] = JSON.parse(result.stdout);
    callback({ consumerRoot, tarball: `file:${join(packRoot, filename)}` });
  } finally {
    rmSync(temporaryRoot, { force: true, recursive: true });
  }
}

export function installConsumer(consumerRoot, extraArgs = []) {
  run(
    'npm',
    [
      'install',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
      '--registry=https://registry.npmjs.org/',
      ...extraArgs
    ],
    { cwd: consumerRoot }
  );
}
