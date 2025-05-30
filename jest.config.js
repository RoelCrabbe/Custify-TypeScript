/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    testEnvironment: 'node',
    verbose: false,
    transform: {
        '^.+.tsx?$': ['ts-jest', {}],
    },
};
