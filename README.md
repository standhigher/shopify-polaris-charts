# @standhigher/charts

Reusable React chart components for Shopify App dashboards built with Polaris.

This package provides a lightweight component library foundation for
Polaris-style chart experiences. Phase 1 chart components will be added in
later tasks; this scaffold only defines the package entry, build, and test
tooling.

## Installation

```bash
npm install @standhigher/charts react react-dom @shopify/polaris recharts
```

## Basic Usage

```tsx
import { packageName } from '@standhigher/charts';

console.log(packageName);
```

## Local Development

```bash
npm install
npm run test
npm run test:watch
npm run typecheck
npm run build
npm run pack:dry-run
```

Storybook scripts are available for later component work:

```bash
npm run storybook
npm run build-storybook
```
