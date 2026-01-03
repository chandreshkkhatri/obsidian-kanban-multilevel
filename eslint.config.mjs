import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import obsidianmd from 'eslint-plugin-obsidianmd';
import globals from 'globals';
import sdl from '@microsoft/eslint-plugin-sdl';
import importPlugin from 'eslint-plugin-import';

// Patches typescript-eslint plugin to support legacy rules referenced by obsidianmd
if (tseslint.plugin && tseslint.plugin.rules && !tseslint.plugin.rules['ban-types']) {
    tseslint.plugin.rules['ban-types'] = {
        meta: { 
            type: 'suggestion',
            docs: { description: 'Legacy ban-types rule shim' }
        },
        create: (context) => ({}) // No-op
    };
}

// Use the imported obsidianmd plugin directly
const obsidianRules = { ...obsidianmd.configs.recommended };

export default tseslint.config(
    { ignores: ['src/docs/**', 'node_modules/**', 'dist/**', 'build/**', 'src/components/Editor/flatpickr/**'] },

    eslint.configs.recommended,
    ...tseslint.configs.recommended,

    // Apply Obsidian plugin and rules
    {
        files: ['**/*.ts', '**/*.tsx'],
        plugins: { 
            react,
            obsidianmd,
            '@microsoft/sdl': sdl,
            'import': importPlugin
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
            // Apply Obsidian rules
            ...obsidianRules,
            
            // Existing TypeScript rules (preserved from original config)
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/require-await': 'error',
            '@typescript-eslint/await-thenable': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/member-delimiter-style': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/no-use-before-define': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-this-alias': 'off',
            '@typescript-eslint/no-inferrable-types': 'off',
            
            // Disable new stricter typescript-eslint v8 rules
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-function-type': 'off',
            '@typescript-eslint/restrict-template-expressions': 'off',
            '@typescript-eslint/no-base-to-string': 'off',
            '@typescript-eslint/unbound-method': 'off',
            '@typescript-eslint/no-deprecated': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/no-unnecessary-type-assertion': 'off',
            '@typescript-eslint/no-redundant-type-constituents': 'off',
            '@typescript-eslint/prefer-promise-reject-errors': 'off',
            '@typescript-eslint/no-for-in-array': 'off',
            '@typescript-eslint/restrict-plus-operands': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            
            // Explicitly disable the removed rule to avoid confusion
            '@typescript-eslint/ban-types': 'off',

            // Set obsidianmd's security rules to warn
            '@microsoft/sdl/no-inner-html': 'warn',
            'no-restricted-globals': 'warn',
            
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
            '@typescript-eslint/no-unused-vars': 'warn',
            
            // Obsidian rules adjustments
            'obsidianmd/sample-names': 'off',
            'obsidianmd/prefer-file-manager-trash-file': 'warn',
            'obsidianmd/no-static-styles-assignment': 'warn',
            'obsidianmd/no-forbidden-elements': 'warn',
            'obsidianmd/platform': 'warn',
            'obsidianmd/hardcoded-config-path': 'warn',
            'obsidianmd/no-sample-code': 'warn',
            'obsidianmd/no-tfile-tfolder-cast': 'warn',
            'obsidianmd/vault/iterate': 'warn',
            'obsidianmd/detach-leaves': 'warn',
            'obsidianmd/no-plugin-as-component': 'warn',
            'obsidianmd/no-view-references-in-plugin': 'warn',
            'obsidianmd/object-assign': 'warn',
            'obsidianmd/prefer-abstract-input-suggest': 'warn',
            'obsidianmd/regex-lookbehind': 'warn',
            'obsidianmd/validate-manifest': 'warn',
            'obsidianmd/validate-license': 'warn',
            'obsidianmd/commands/no-command-in-command-id': 'warn',
            'obsidianmd/commands/no-command-in-command-name': 'warn',
            'obsidianmd/commands/no-default-hotkeys': 'warn',
            'obsidianmd/commands/no-plugin-id-in-command-id': 'warn',
            'obsidianmd/commands/no-plugin-name-in-command-name': 'warn',
            'obsidianmd/settings-tab/no-manual-html-headings': 'warn',
            'obsidianmd/settings-tab/no-problematic-settings-headings': 'warn',
            
            // Import rules from obsidianmd
            'import/no-extraneous-dependencies': 'warn',
            'no-restricted-imports': 'warn',
        }
    }
);
