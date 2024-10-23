import globals from 'globals';
import pluginJs from '@eslint/js';
import prettier from 'eslint-plugin-prettier'; // Import the Prettier plugin

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node, // Use Node.js globals
      },
    },
    plugins: {
      prettier, // Define the Prettier plugin here
    },
    rules: {
      indent: ['error', 2], // Enforce 2-space indentation
      'linebreak-style': ['error', 'unix'], // Enforce Unix line endings
      quotes: ['error', 'single'], // Enforce single quotes
      semi: ['error', 'always'], // Require semicolons
      'prettier/prettier': 'error', // Show Prettier errors as ESLint errors
      // Additional rules can be added as needed
    },
  },
  pluginJs.configs.recommended,
];
