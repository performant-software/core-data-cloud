// @flow

import js from '@eslint/js';
import babelParser from '@babel/eslint-parser';
import flowtype from 'eslint-plugin-flowtype';
import importPlugin from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import globals from 'globals';

export default [
  importPlugin.flatConfigs.recommended,
  js.configs.recommended,
  react.configs.flat.recommended,
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        __dirname: 'readonly',
        Atomics: 'readonly',
        JSX: 'readonly',
        SharedArrayBuffer: 'readonly',
        TimeoutID: 'readonly',
        process: 'readonly'
      },
      parser: babelParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        requireConfigFile: true,
        babelOptions: {
          parserOpts: {
            plugins: ['jsx']
          }
        }
      },
      sourceType: 'module'
    },
    plugins: {
      react,
      flowtype,
      'jsx-a11y': jsxA11y
    },
    rules: {
      'class-methods-use-this': 'off',
      'comma-dangle': ['error', 'never'],
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
      'import-x/prefer-default-export': 'off',
      'jsx-a11y/media-has-caption': 'off',
      'jsx-quotes': ['error', 'prefer-single'],
      'lines-between-class-members': 'off',
      'max-len': ['error', {
        code: 120,
        ignoreStrings: true
      }],
      'no-underscore-dangle': 'off',
      'no-use-before-define': 'off',
      quotes: ['error', 'single'],
      'quote-props': ['error', 'as-needed', {
        keywords: false,
        unnecessary: true,
        numbers: true
      }],
      'react/display-name': 'off',
      'react/default-props-match-prop-types': 'off',
      'react/destructuring-assignment': 'off',
      'react/jsx-filename-extension': [1, {
        extensions: ['.js', '.jsx']
      }],
      'react/jsx-no-bind': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/no-array-index-key': 'off',
      'react/no-did-update-set-state': 'off',
      'react/prefer-stateless-function': 'off',
      'react/require-default-props': 'off',
      'react/sort-comp': 'off',
      'react/static-property-placement': 'off',
      'semi-style': ['error', 'last']
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  }, {
    ignores: [
      '**/build/*'
    ]
  }
];
