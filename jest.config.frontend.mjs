export default {
  rootDir: '.',
  testEnvironment: 'jest-fixed-jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests-frontend.js'],
  testMatch: ['**/src/test-frontend/**/*.test.js'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx|mjs|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(msw|rettime|@mswjs)/)',
  ],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage-frontend',
};
