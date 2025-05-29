// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
// Import stylistic rules plugin for code style
import stylistic from '@stylistic/eslint-plugin'
// Import plugin to sort imports
import simpleImportSort from 'eslint-plugin-simple-import-sort'
// Import plugin to prevent accidental .only in tests
import noOnlyTests from 'eslint-plugin-no-only-tests'

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    plugins: {
      '@stylistic': stylistic
    }
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort
    }
  },
  {
    plugins: {
      'no-only-tests': noOnlyTests
    }
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // Enforce single quotes for strings
      '@stylistic/quotes': ['error', 'single'],
      // Disallow semicolons
      '@stylistic/semi': ['error', 'never'],
      // Enforce 2-space indentation
      '@stylistic/indent': ['error', 2],
      // Require spaces inside curly braces in objects
      '@stylistic/object-curly-spacing': ['error', 'always'],

      // Sort imports into custom groups for better organization
      'simple-import-sort/imports': ['error', {
        groups: [['reflect-metadata'], ['^\\u0000'], ['^node:'], ['^@?\\w'], ['/db'], ['/controllers'], ['/services'], ['/handlers'], ['/middleware'], ['^../(?!.*(utils))'], ['^./(?!.*(utils))'], ['^'], ['/utils']]
      }],
      // Enforce sorted exports
      'simple-import-sort/exports': 'error',

      // Disallow .only in tests to prevent accidental commits
      'no-only-tests/no-only-tests': 'error',
      // Allow regexes as they are, don't enforce escaping
      'no-useless-escape': 'off',
      // Require spaces inside curly braces in objects (duplicate for compatibility)
      'object-curly-spacing': ['error', 'always'],
      // Require spaces around infix operators (e.g., +, -, =)
      'space-infix-ops': 'error',
      // Require space before and after keywords (e.g., if, else)
      'keyword-spacing': ['error', {
        'before': true,
        'after': true
      }],
      // Disallow spaces inside parentheses
      'space-in-parens': ['error', 'never'],
      // Enforce spacing for unary operators (e.g., typeof, !)
      'space-unary-ops': ['error', {
        'words': true,
        'nonwords': false
      }],
      // Require space before opening a curly brace in blocks
      'space-before-blocks': ['error', 'always'],
      // Require space before a function parenthesis
      "space-before-function-paren": ["error", "always"],
      // Require a space after commas, but not before
      'comma-spacing': ['error', {
        before: false,
        after: true
      }],
      // Enforce spacing in type annotations (TypeScript)
      "@stylistic/type-annotation-spacing": ["error", {
        "before": true,
        "after": true,
        "overrides": {
          "colon": {
            "before": false,
            "after": true
          }
        }
      }],
      // Disallow trailing spaces except on blank lines and in comments
      "@stylistic/no-trailing-spaces": ["error", {
        "skipBlankLines": true,
        "ignoreComments": false
      }],
      // Limit consecutive empty lines
      "no-multiple-empty-lines": ["error", {
        "max": 1,
        "maxEOF": 1,
        "maxBOF": 0
      }],
      // Disallow console usage except for specific methods
      'no-console': ['error', { allow: ['info', 'error', 'warn', 'assert', 'debug'] }],
      // Disable duplicate type annotation spacing rule from typescript-eslint
      '@typescript-eslint/type-annotation-spacing': 'off',
      // Allow unused variables if they start with _ (common for placeholders)
      "@typescript-eslint/no-unused-vars": [
        "error",
        { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }
      ],
      // Enforce using 'import type' instead of regular imports for types
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
      }],
    }
  },
);