module.exports = {
    parser: '@typescript-eslint/parser',
    env: { node: true },
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:prettier/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        project: './tsconfig.json'
    },
    rules: {
        'import/order': ['error', {
            'newlines-between': 'always',
            'groups': [
                'external',
                'internal',
            ],
            'alphabetize': {
                'order': 'asc',
                'caseInsensitive': false
            }
        }],
        'no-void': ["error", { "allowAsStatement": true }],
        'no-console': 'off',
        'no-restricted-syntax': ['error', 'FunctionDeclaration[generator=true]'],
        'max-classes-per-file': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-misused-promises': ['error', { 'checksVoidReturn': false }],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
    },
};