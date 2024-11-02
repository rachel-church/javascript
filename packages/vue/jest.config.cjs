const { name, version } = require('./package.json');

module.exports = {
  displayName: name.replace('@clerk', ''),
  injectGlobals: true,

  roots: ['<rootDir>/src'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    // Error "ReferenceError: Vue is not defined" without this line
    customExportConditions: [],
  },
  setupFilesAfterEnv: ['<rootDir>../../jest.setup-after-env.ts'],

  moduleDirectories: ['node_modules', '<rootDir>/src'],
  transform: {
    '^.+\\.m?tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },

  testRegex: ['/ui/.*/__tests__/.*.test.[jt]sx?$', '/.*.test.[jt]sx?$'],
  testPathIgnorePatterns: ['/node_modules/'],

  globals: {
    PACKAGE_NAME: name,
    PACKAGE_VERSION: version,
  },
};
