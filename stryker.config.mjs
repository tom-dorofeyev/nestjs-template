/** @type {import('@stryker-mutator/api/core').StrykerOptions} */
export default {
  mutate: ['src/**/*.ts', '!src/main.ts', '!src/**/*.module.ts'],
  testRunner: 'jest',
  coverageAnalysis: 'perTest',
  reporters: ['clear-text', 'progress', 'html'],
  thresholds: {
    high: 80,
    low: 60,
    break: 0,
  },
};
