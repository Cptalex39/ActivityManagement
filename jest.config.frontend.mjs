export default {
  rootDir: '.',
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  setupFiles: ['<rootDir>/src/jest-polyfills.js'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests-frontend.js'],
  testMatch: ['**/src/test-frontend/**/*.test.js'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx|mjs|ts|tsx)$': 'babel-jest',
  },
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage-frontend',
};
