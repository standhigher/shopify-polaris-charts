import { join } from 'node:path';

import {
  PEER_MATRICES,
  TYPESCRIPT_VERSIONS,
  createPeerManifest,
  createTypeManifest,
  peerConsumerSource,
  typeConsumerSource,
  typeScriptConfig
} from './peer-matrix-fixtures.mjs';
import {
  installConsumer,
  run,
  withPackedConsumer,
  writeFixture
} from './consumer-smoke-utils.mjs';

withPackedConsumer('standhigher-charts-matrix-', ({ consumerRoot, tarball }) => {
  for (const matrix of PEER_MATRICES) {
    const matrixRoot = join(consumerRoot, `react-${matrix.react}`);
    writeFixture(matrixRoot, {
      'package.json': `${JSON.stringify(createPeerManifest(tarball, matrix), null, 2)}\n`,
      'index.mjs': peerConsumerSource
    });
    installConsumer(matrixRoot);
    run('node', ['index.mjs'], { cwd: matrixRoot });
  }

  for (const version of TYPESCRIPT_VERSIONS) {
    const matrixRoot = join(consumerRoot, `typescript-${version}`);
    writeFixture(matrixRoot, {
      'package.json': `${JSON.stringify(createTypeManifest(tarball, version), null, 2)}\n`,
      'consumer.tsx': typeConsumerSource,
      'tsconfig.json': typeScriptConfig
    });
    installConsumer(matrixRoot);
    run('npm', ['run', 'typecheck'], { cwd: matrixRoot });
  }
});
