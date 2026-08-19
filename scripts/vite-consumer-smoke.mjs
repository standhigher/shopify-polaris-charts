import {
  createViteManifest,
  viteEntrySource,
  viteIndexSource
} from './framework-smoke-fixtures.mjs';
import {
  installConsumer,
  run,
  withPackedConsumer,
  writeFixture
} from './consumer-smoke-utils.mjs';

withPackedConsumer('standhigher-charts-vite-', ({ consumerRoot, tarball }) => {
  writeFixture(consumerRoot, {
    'package.json': `${JSON.stringify(createViteManifest(tarball), null, 2)}\n`,
    'index.html': viteIndexSource,
    'src/main.jsx': viteEntrySource
  });
  installConsumer(consumerRoot);
  run('npm', ['run', 'build'], { cwd: consumerRoot });
});
