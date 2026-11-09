import javascript from '@eslint/js';
import {defineConfig, globalIgnores} from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default defineConfig([
  globalIgnores([
    '**/node_modules/**',
    '**/build/**',
    '**/.docusaurus*/**',
    'artifacts/**',
    'website/documents/**',
  ]),
  {
    files: ['**/*.{js,jsx}'],
    extends: [javascript.configs.recommended, prettier],
    languageOptions: {ecmaVersion: 'latest', sourceType: 'module', globals: globals.nodeBuiltin},
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: 'error',
      'no-unused-vars': ['error', {ignoreRestSiblings: true}],
    },
  },
  {
    files: ['packages/theme/src/app/**/*.{js,jsx}', 'packages/theme/src/theme/**/*.{js,jsx}'],
    languageOptions: {globals: globals.browser, parserOptions: {ecmaFeatures: {jsx: true}}},
    plugins: {'react-hooks': reactHooks},
    rules: {'react-hooks/rules-of-hooks': 'error', 'react-hooks/exhaustive-deps': 'error'},
  },
]);
