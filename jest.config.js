/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  testMatch: ['**/src/**/*.test.{js,ts}'],
  transform: {},
  coverageProvider: 'v8',
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  coverageReporters: ['text', 'lcov'],
};
