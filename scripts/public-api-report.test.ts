// @vitest-environment node

import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { checkPublicApi } from './public-api-report.mjs';

describe('public API report', () => {
  it('writes and then verifies both declaration entries byte-for-byte', () => {
    const root = mkdtempSync(join(tmpdir(), 'charts-api-report-'));
    mkdirSync(join(root, 'dist'), { recursive: true });
    writeFileSync(join(root, 'dist/index.d.ts'), 'export declare const root = true;\n');
    writeFileSync(join(root, 'dist/formatters.d.ts'), 'export declare const formatter = true;\n');

    expect(() => checkPublicApi({ root, write: false })).toThrow(/docs\/public-api\/index\.d\.ts/);
    checkPublicApi({ root, write: true });
    expect(readFileSync(join(root, 'docs/public-api/index.d.ts'), 'utf8')).toBe('export declare const root = true;\n');
    expect(() => checkPublicApi({ root, write: false })).not.toThrow();

    writeFileSync(join(root, 'dist/formatters.d.ts'), 'export declare const formatter = false;\n');
    expect(() => checkPublicApi({ root, write: false })).toThrow(/docs\/public-api\/formatters\.d\.ts/);
  });
});
