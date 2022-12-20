const { pathsToModuleNameMapper } = require('ts-jest');

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: '<rootDir>/test-setup.ts',
  globalTeardown: '<rootDir>/test-teardown.ts',
  moduleNameMapper: pathsToModuleNameMapper({
    '@cms/*': ['src/*'],
    '@ormconfig': ['ormconfig.ts'],
  }),
  modulePaths: ['<rootDir>'],
};
