import {
  createNextManifest,
  nextChartSource,
  nextLayoutSource,
  nextPageSource
} from './framework-smoke-fixtures.mjs';
import {
  installConsumer,
  run,
  withPackedConsumer,
  writeFixture
} from './consumer-smoke-utils.mjs';

withPackedConsumer('standhigher-charts-next-', ({ consumerRoot, tarball }) => {
  writeFixture(consumerRoot, {
    'package.json': `${JSON.stringify(createNextManifest(tarball), null, 2)}\n`,
    'app/chart.jsx': nextChartSource,
    'app/layout.jsx': nextLayoutSource,
    'app/page.jsx': nextPageSource
  });
  installConsumer(consumerRoot);
  run('npm', ['run', 'build'], { cwd: consumerRoot });
});
