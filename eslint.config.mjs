import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  { ignores: ['node_modules/**', 'playwright-report/**', 'test-results/**'] },
  {
    files: ['**/*.mjs'],
    languageOptions: { globals: globals.node },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-constant-condition': 'error',
      'no-unreachable': 'error',
      'no-dupe-keys': 'error'
    }
  },
  { files: ['tests/browser/*.mjs', 'scripts/measure-training.mjs'], languageOptions: { globals: globals.browser } }
]);
