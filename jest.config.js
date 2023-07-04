module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom-sixteen',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  globalSetup: '<rootDir>/jest-puppeteer.setup.js',
};
