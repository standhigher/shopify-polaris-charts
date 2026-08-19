import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, '**/.worktrees/**', 'tests/browser/**'],
    globals: true,
    setupFiles: ['./src/test/setup.ts']
  }
});
