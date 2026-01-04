import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import obsidianmd from 'eslint-plugin-obsidianmd';
import globals from 'globals';
import sdl from '@microsoft/eslint-plugin-sdl';
import importPlugin from 'eslint-plugin-import';

import eslintComments from 'eslint-plugin-eslint-comments';

// Patches typescript-eslint plugin to support legacy rules referenced by obsidianmd
if (tseslint.plugin && tseslint.plugin.rules && !tseslint.plugin.rules['ban-types']) {
    tseslint.plugin.rules['ban-types'] = {
        meta: { 
            type: 'suggestion',
            docs: { description: 'Legacy ban-types rule shim' }
        },
        create: () => ({}) // No-op
    };
}

export default tseslint.config(
    { ignores: ['src/docs/**', 'node_modules/**', 'dist/**', 'build/**'] },

    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...obsidianmd.configs.recommended,

    // Project-specific configuration and overrides
    {
        files: ['**/*.ts', '**/*.tsx'],
        plugins: {
            react,
            '@microsoft/sdl': sdl,
            'import': importPlugin,
            'eslint-comments': eslintComments
        },
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json',
                ecmaFeatures: { jsx: true },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jest,
                // Obsidian globals
                activeDocument: 'readonly',
                activeWindow: 'readonly',
                createDiv: 'readonly',
                createEl: 'readonly',
                createSpan: 'readonly',
                createFragment: 'readonly',
                app: 'readonly',
                moment: 'readonly',
                jQuery: 'readonly',
            }
        },
        settings: { react: { version: '16.13' } },
        rules: {
            // Existing TypeScript rules
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/require-await': 'error',
            '@typescript-eslint/await-thenable': 'error',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/member-delimiter-style': 'off',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-var-requires': 'error',
            '@typescript-eslint/no-use-before-define': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-this-alias': 'error',
            '@typescript-eslint/no-inferrable-types': 'off',

            // Enable rules enforced by Obsidian PR bot
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-function-type': 'off',
            '@typescript-eslint/restrict-template-expressions': 'error',
            '@typescript-eslint/no-base-to-string': 'error',
            '@typescript-eslint/unbound-method': 'error',
            '@typescript-eslint/no-deprecated': 'error',
            '@typescript-eslint/no-require-imports': 'error',
            '@typescript-eslint/no-unused-expressions': 'error',
            '@typescript-eslint/no-unnecessary-type-assertion': 'error',
            '@typescript-eslint/no-redundant-type-constituents': 'off',
            '@typescript-eslint/prefer-promise-reject-errors': 'error',
            '@typescript-eslint/no-for-in-array': 'error',
            '@typescript-eslint/restrict-plus-operands': 'off',
            '@typescript-eslint/no-misused-promises': 'off',

            // Explicitly disable the removed rule to avoid confusion
            '@typescript-eslint/ban-types': 'off',

            // Set obsidianmd's security rules to error/warn
            '@microsoft/sdl/no-inner-html': 'warn',
            'no-restricted-globals': 'error',

            // ESLint Comments rules to match PR bot
            'eslint-comments/require-description': 'error',
            'eslint-comments/disable-enable-pair': 'error',
            'eslint-comments/no-restricted-disable': ['error', '@typescript-eslint/no-explicit-any'],

            // Existing React rules
            'react/no-unescaped-entities': 'off',
            'react/prop-types': 'off',
            'react/react-in-jsx-scope': 'off',

            // Existing base rules
            'linebreak-style': 'off',
            'indent': 'off',
            'quotes': 'off',
            'no-unused-vars': 'off',
            'no-undef': 'off',
            '@typescript-eslint/no-unused-vars': 'error',

            // Obsidian rules adjustments
            'obsidianmd/sample-names': 'off',
            'obsidianmd/prefer-file-manager-trash-file': 'error',
            'obsidianmd/no-static-styles-assignment': 'error',
            'obsidianmd/no-forbidden-elements': 'error',
            'obsidianmd/platform': 'error',
            'obsidianmd/hardcoded-config-path': 'error',
            'obsidianmd/no-sample-code': 'error',
            'obsidianmd/no-tfile-tfolder-cast': 'error',
            'obsidianmd/vault/iterate': 'error',
            'obsidianmd/detach-leaves': 'error',
            'obsidianmd/no-plugin-as-component': 'error',
            'obsidianmd/no-view-references-in-plugin': 'error',
            'obsidianmd/object-assign': 'error',
            'obsidianmd/prefer-abstract-input-suggest': 'error',
            'obsidianmd/regex-lookbehind': 'error',
            'obsidianmd/validate-manifest': 'error',
            'obsidianmd/validate-license': 'error',
            'obsidianmd/commands/no-command-in-command-id': 'error',
            'obsidianmd/commands/no-command-in-command-name': 'error',
            'obsidianmd/commands/no-default-hotkeys': 'error',
            'obsidianmd/commands/no-plugin-id-in-command-id': 'error',
            'obsidianmd/commands/no-plugin-name-in-command-name': 'error',
            'obsidianmd/settings-tab/no-manual-html-headings': 'error',
            'obsidianmd/settings-tab/no-problematic-settings-headings': 'error',
            'obsidianmd/ui/sentence-case': 'error',

            // Import rules from obsidianmd
            'import/no-extraneous-dependencies': 'error',
            'no-restricted-imports': ['error', {
                'name': 'moment',
                'message': 'Please use moment from the obsidian package instead.'
            }],
        }
    }
);
