import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./setupTests.tsx'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      // Only collect coverage for files imported by tests — don't penalise untested app pages
      all: false,
      exclude: [
        'node_modules/',
        '.next/',
        'vitest.config.ts',
        'setupTests.tsx',
        'postcss.config.mjs',
        'tailwind.config.ts',
        '**/*.config.*',
      ],
      thresholds: {
        statements: 15,
        branches: 20,
        functions: 5,
        lines: 20,
      },
    },
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
