// vitest.config.js
import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    resolve: {
        alias: {
            '@formajs/formajs': path.resolve(__dirname, '../forma/src/index.js'),
        },
    },
    test: {
        setupFiles: ['./test/setup.js'],
        coverage: {
            provider: 'v8', // 'v8' ou 'istanbul'
            reporter: ['text', 'html', 'lcov'],
            include: ['src/**'],
            exclude: ['src/**/*.test.js'],
            thresholds: { lines: 80, branches: 70 },
        },
        // globals: false,
    },
});
