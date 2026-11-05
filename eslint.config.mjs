import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import checkFile from 'eslint-plugin-check-file';

const TOOL_DIRECTIVE = /^\s*(eslint|@ts-|global\s|prettier-ignore)/;

const noComments = {
  rules: {
    'no-comments': {
      meta: { type: 'suggestion' },
      create(context) {
        return {
          Program() {
            for (const comment of context.sourceCode.getAllComments()) {
              if (TOOL_DIRECTIVE.test(comment.value)) continue;
              context.report({
                loc: comment.loc,
                message:
                  'Comments are not allowed. Make the code explain itself.',
              });
            }
          },
        };
      },
    },
  },
};

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'src/generated/**',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'typeLike', format: ['PascalCase'] },
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: { regex: '^I[A-Z]', match: false },
        },
        {
          selector: 'variable',
          modifiers: ['const', 'global'],
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'has', 'can', 'should'],
        },
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
      ],
    },
  },
  {
    plugins: { 'check-file': checkFile, local: noComments },
    rules: {
      'local/no-comments': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'max-lines': ['error', { max: 200, skipBlankLines: true }],
      'check-file/folder-naming-convention': [
        'error',
        {
          'src/app/**/': 'NEXT_JS_APP_ROUTER_CASE',
          'src/!(app)/**/': 'KEBAB_CASE',
        },
      ],
      'check-file/filename-naming-convention': [
        'error',
        {
          'src/components/**/*.tsx': 'PASCAL_CASE',
          'src/hooks/**/*.ts': 'CAMEL_CASE',
          'src/{lib,services,constants,config,types}/**/*.ts': 'CAMEL_CASE',
        },
        { ignoreMiddleExtensions: true },
      ],
    },
  },
  {
    files: ['src/hooks/**/*.ts'],
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        { 'src/hooks/**/*.ts': 'use+([A-Z])*' },
      ],
    },
  },
]);
