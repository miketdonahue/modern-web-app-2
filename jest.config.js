module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', 'setup-enzyme.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/setup-enzyme.ts'],
  testMatch: ['**/__tests__/**/*.ts?(x)'],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
};
