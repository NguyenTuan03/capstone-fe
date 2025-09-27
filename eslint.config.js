// eslint.config.js
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

/** @type {import('eslint').Linter.FlatConfig[]} */
const eslintConfig = [
  // Next + TS
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  {
    settings: {
      'import/resolver': {
        typescript: { project: ['./tsconfig.json'] },
      },
    },
  },
  { ignores: ['node_modules/**', '.next/**', 'dist/**', 'out/**'] },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-unused-expressions': 'off',
      'import/no-anonymous-default-export': 'off',
    },
  },
];

export default eslintConfig;
