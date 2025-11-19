import { FlatCompat } from '@eslint/eslintrc';
import astroParser from 'astro-eslint-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends('plugin:astro/recommended', 'prettier'),
    {
        ignores: ['node_modules/**', 'dist/**', '.astro/**'],
    },
];

export default eslintConfig;
