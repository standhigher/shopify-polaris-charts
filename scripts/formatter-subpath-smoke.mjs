import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  installConsumer,
  run,
  withPackedConsumer,
  writeFixture
} from './consumer-smoke-utils.mjs';

withPackedConsumer('standhigher-charts-formatters-', ({ consumerRoot, tarball }) => {
  writeFixture(consumerRoot, {
    'package.json': `${JSON.stringify(
      {
        private: true,
        type: 'module',
        dependencies: { '@standhigher/charts': tarball }
      },
      null,
      2
    )}\n`,
    'index.mjs': `import { formatMoney } from '@standhigher/charts/formatters';
const value = formatMoney(1250, { currency: 'USD', locale: 'en-US' });
if (value !== '$1,250.00') throw new Error(\`Unexpected formatter output: \${value}\`);
`
  });
  installConsumer(consumerRoot, ['--legacy-peer-deps']);

  for (const peer of ['react', 'react-dom', 'recharts']) {
    if (existsSync(join(consumerRoot, 'node_modules', peer))) {
      throw new Error(`Formatter-only consumer unexpectedly installed ${peer}`);
    }
  }

  run('node', ['index.mjs'], { cwd: consumerRoot });
});
