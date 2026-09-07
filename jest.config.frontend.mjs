export default {
  rootDir: '.',
  testEnvironment: 'jest-fixed-jsdom',
  setupFiles: [],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests-frontend.js'],
  testMatch: ['**/src/test-frontend/**/*.test.js'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|scss|sass)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.(js|jsx|mjs|ts|tsx)$': ['babel-jest', { presets: [['@babel/preset-react', { runtime: 'automatic' }]] }],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(msw|rettime|until-async|@mswjs|@open-draft|@gianlucascisciolo|react-bootstrap|@react-bootstrap)/)',
  ],
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage-frontend',
  collectCoverageFrom: [
    '<rootDir>/src/react_redux/views/**/*.{js,jsx}',
    '!<rootDir>/src/Main.jsx',
    '!<rootDir>/src/index.js'
  ],
};

