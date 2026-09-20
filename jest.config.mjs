// jest.config.mjs
export default {
  rootDir: '.',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/test/old_version/',
    '<rootDir>/.stryker-tmp/', 
  ],

  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|scss|sass)$': '<rootDir>/src/test/mocks/styleMock.js',
  },

  transform: {
    '^.+\\.(js|jsx|ts|tsx|mjs)$': 'babel-jest',
  },

  transformIgnorePatterns: [
    '<rootDir>/node_modules/',
  ],

  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/old_version/**',
  ],
  coverageDirectory: '<rootDir>/coverage',
};







