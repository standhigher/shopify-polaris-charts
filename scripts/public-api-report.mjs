import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const PUBLIC_API_REPORTS = Object.freeze([
  Object.freeze({ built: 'dist/index.d.ts', report: 'docs/public-api/index.d.ts' }),
  Object.freeze({ built: 'dist/formatters.d.ts', report: 'docs/public-api/formatters.d.ts' })
]);

export function checkPublicApi({ root = resolve('.'), write = false } = {}) {
  for (const { built, report } of PUBLIC_API_REPORTS) {
    const builtPath = join(root, built);
    const reportPath = join(root, report);

    if (!existsSync(builtPath)) {
      throw new Error(`Missing built declaration: ${built}. Run npm run build first.`);
    }

    const declaration = readFileSync(builtPath);
    if (write) {
      mkdirSync(dirname(reportPath), { recursive: true });
      writeFileSync(reportPath, declaration);
      continue;
    }

    if (!existsSync(reportPath) || !declaration.equals(readFileSync(reportPath))) {
      throw new Error(`Public API report is out of date: ${report}. Review the API change, then run npm run api:write.`);
    }
  }
}

const invokedPath = globalThis.process.argv[1] ? resolve(globalThis.process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  checkPublicApi({ write: globalThis.process.argv.includes('--write') });
  globalThis.console.log(globalThis.process.argv.includes('--write')
    ? 'Public API reports updated.'
    : 'Public API reports match built declarations.');
}
