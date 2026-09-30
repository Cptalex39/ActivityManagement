// jest.config.mjs
export default {
  rootDir: '.',
  testEnvironment: 'jest-fixed-jsdom',
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js',
    '<rootDir>/src/setupTests-frontend.js',
  ],

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
    '^.+\\.(js|jsx|mjs|ts|tsx)$': [
      'babel-jest',
      { presets: [['@babel/preset-react', { runtime: 'automatic' }]] },
    ],
  },

  transformIgnorePatterns: [
    '/node_modules/(?!(@gianlucascisciolo/riutilizzoreact|react-bootstrap|@open-draft|msw|@mswjs|until-async|rettime|@bundled-es-modules|strict-event-emitter|outvariant|headers-polyfill|is-node-process)/)',
  ],

  collectCoverage: false,
  coverageDirectory: '<rootDir>/coverage-totale',
  collectCoverageFrom: [
    '<rootDir>/src/react_redux/**/*.{js,jsx}',
    //'<rootDir>/src/react_redux/actions/**/*.{js}',
    //'<rootDir>/src/react_redux//**/*.{js}',
    '!<rootDir>/src/Main.jsx',
    '!<rootDir>/src/index.js',
  ],
};