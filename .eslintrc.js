module.exports = {
    env: {
        browser: true,
        es6: true,
        commonjs: true
    },
    extends: ['eslint:recommended'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
        ecmaFeatures: {
            jsx: false
        },
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    plugins: [],
    rules: {}
};
