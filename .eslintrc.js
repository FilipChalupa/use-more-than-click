module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	parser: '@typescript-eslint/parser',
	extends: [
		'plugin:react/recommended',
		'standard-with-typescript',
		'prettier',
		'plugin:prettier/recommended',
	],
	overrides: [],
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
		project: ['tsconfig.json'],
	},
	plugins: ['react', 'react-hooks', 'prettier', '@typescript-eslint'],
	rules: {
		'prettier/prettier': ['error'],
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		'comma-dangle': 'off',
		'@typescript-eslint/consistent-type-assertions': 'off',
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
}
