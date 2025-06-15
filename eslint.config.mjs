import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ignores: ['dist/**', 'node_modules/**', '*.js'],
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            globals: {
                console: 'readonly',
                process: 'readonly',
                require: 'readonly',
                module: 'writable',
                exports: 'writable',
                __dirname: 'readonly',
                __filename: 'readonly',
            },
        },
        rules: {
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-require-imports': 'error',
            'no-console': 'off',
            'no-undef': 'error',
        },
    },
];
