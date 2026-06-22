import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import unicorn from 'eslint-plugin-unicorn';
import prettier from 'eslint-plugin-prettier/recommended';
import eslintConfigPrettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.js'],
          defaultProject: 'tsconfig.json',
        },
      },
    },
    ignores: ['node_modules', 'dist', 'public'],
    rules: {
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          arrayLiteralTypeAssertions: 'allow-as-parameter',
        },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'explicit', overrides: { constructors: 'off' } },
      ],
      '@typescript-eslint/member-ordering': 'error',
      'class-methods-use-this': 'error',
    },
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: true,
    },
  },
  unicorn.configs.recommended,
  {
    rules: {
      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/prefer-global-this': 'off',
      'prefer-global-this': 'off',
      'unicorn/prefer-add-event-listener': 'off',
      'unicorn/require-array-join-separator': 'off',
    },
  },
  prettier,
  eslintConfigPrettier,
];
