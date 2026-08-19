// @vitest-environment node

import { readFileSync } from 'node:fs';

describe('v1 CI compatibility contract', () => {
  it('covers supported Node versions and separates expensive release gates', () => {
    const workflow = readFileSync('.github/workflows/ci.yml', 'utf8');

    expect(workflow).toContain('node-version: [20, 22, 24]');
    expect(workflow).toContain('npm run peer:smoke');
    expect(workflow).toContain('npm run next:smoke');
    expect(workflow).toContain('npm run vite:smoke');
    expect(workflow).toContain('npm run test:browser');
    expect(workflow).toContain('playwright install --with-deps chromium firefox webkit');
    expect(workflow).toContain('npm run benchmark:analytics');
    expect(workflow).toContain('npm run pack:dry-run');
  });
});
