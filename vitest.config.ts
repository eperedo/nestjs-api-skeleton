import { defineConfig } from 'vitest/config';
import path from 'node:path';
import swc from 'unplugin-swc';

const prismaRoot = path.resolve(__dirname, 'src/generated/prisma');

export default defineConfig({
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      './enums.js': path.resolve(prismaRoot, 'enums.ts'),
      './internal/class.js': path.resolve(prismaRoot, 'internal/class.ts'),
      './internal/prismaNamespace.js': path.resolve(
        prismaRoot,
        'internal/prismaNamespace.ts',
      ),
    },
  },
  test: {
    include: ['src/**/*.spec.ts'],
    environment: 'node',
    globals: true,
    setupFiles: [path.resolve(__dirname, 'test/vitest.setup.ts')],
  },
});
