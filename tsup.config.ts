import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['app.ts'],
    format: ['cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
});
