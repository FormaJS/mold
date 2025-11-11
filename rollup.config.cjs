const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const _terserMod = require('@rollup/plugin-terser');
const terser = _terserMod.terser || _terserMod.default || _terserMod;

module.exports = [
    // ESM bundle (main entry)
    {
        input: 'src/index.js',
        output: {
            file: 'dist/index.mjs',
            format: 'es',
            sourcemap: false,
            exports: 'named',
        },
        plugins: [resolve(), commonjs(), terser()],
        external: ['@formajs/formajs'],
    },
    // CJS bundle (for older Node.js or bundlers like Webpack)
    {
        input: 'src/index.js',
        output: {
            file: 'dist/index.cjs',
            format: 'cjs',
            sourcemap: false,
            exports: 'named',
        },
        plugins: [resolve(), commonjs(), terser()],
        external: ['@formajs/formajs'],
    },
];
