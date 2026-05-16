import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{js,ts}'],
    plugins: {
      import: importPlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    rules: {
      // Modern JS style — keep things tight without leaning on airbnb.
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error',
      'object-shorthand': 'error',
      'no-useless-rename': 'error',
      'no-useless-concat': 'error',
      'no-throw-literal': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],

      // Unused vars: ignore underscore-prefixed args/locals so intentional
      // placeholders don't fail lint.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // NodeNext + bundler handle resolution; eslint-plugin-import shouldn't
      // second-guess them.
      'import/extensions': 'off',
      'import/no-unresolved': 'off',

      // Pragmatic relaxations for this codebase.
      'no-prototype-builtins': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-cond-assign': ['error', 'except-parens'],
    },
  },
  {
    files: ['src/**/__tests__/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];
