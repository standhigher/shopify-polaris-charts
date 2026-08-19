import { spawnSync } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const LEGACY_RECHARTS_VERSION = '2.15.4';
const REQUIRED_EXPORTS = Object.freeze([
  'ComparisonChart',
  'ConversionChart',
  'FunnelChart',
  'TrendChart',
  'revenueTrendPreset'
]);

export function createLegacySmokeManifest(packageTarball) {
  return {
    dependencies: {
      '@standhigher/charts': packageTarball,
      react: '18.3.1',
      'react-dom': '18.3.1',
      'react-is': '18.3.1',
      recharts: LEGACY_RECHARTS_VERSION
    },
    private: true,
    type: 'module'
  };
}

export function validateLegacyExports(packageModule) {
  for (const exportName of REQUIRED_EXPORTS) {
    if (packageModule[exportName] === undefined) {
      throw new Error(`Missing legacy smoke export: ${exportName}`);
    }
  }
}

function runCommand(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: globalThis.process.env
  });

  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(' ')} failed with status ${result.status}\n${result.stdout}\n${result.stderr}`
    );
  }

  return result.stdout;
}

export async function runLegacySmoke(projectDirectory = globalThis.process.cwd()) {
  const temporaryDirectory = await mkdtemp(join(tmpdir(), 'standhigher-charts-recharts2-'));

  try {
    const packOutput = runCommand(
      'npm',
      ['pack', '--json', '--pack-destination', temporaryDirectory],
      projectDirectory
    );
    const [{ filename }] = JSON.parse(packOutput);
    const tarballPath = resolve(temporaryDirectory, filename);
    const manifest = createLegacySmokeManifest(`file:${tarballPath}`);

    await writeFile(
      join(temporaryDirectory, 'package.json'),
      `${JSON.stringify(manifest, null, 2)}\n`,
      'utf8'
    );
    runCommand(
      'npm',
      ['install', '--ignore-scripts', '--no-audit', '--no-fund', '--registry=https://registry.npmjs.org/'],
      temporaryDirectory
    );
    const packageEntry = pathToFileURL(
      join(temporaryDirectory, 'node_modules/@standhigher/charts/dist/index.js')
    ).href;
    const packageModule = await import(packageEntry);

    validateLegacyExports(packageModule);
    return {
      packageVersion: packageModule.packageVersion,
      react: manifest.dependencies.react,
      recharts: manifest.dependencies.recharts
    };
  } finally {
    await rm(temporaryDirectory, { force: true, recursive: true });
  }
}

async function main() {
  const result = await runLegacySmoke();
  globalThis.console.log(
    `Recharts legacy smoke passed: @standhigher/charts@${result.packageVersion}, React ${result.react}, Recharts ${result.recharts}`
  );
}

const invokedPath = globalThis.process.argv[1] ? resolve(globalThis.process.argv[1]) : '';

if (invokedPath === fileURLToPath(import.meta.url)) {
  await main();
}
