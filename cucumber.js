/** @type {import('@cucumber/cucumber').Configuration} */
module.exports = {
  default: {
    paths: ['test/acceptance/features/**/*.feature'],
    requireModule: ['ts-node/register'],
    require: [
      'test/acceptance/support/**/*.ts',
      'test/acceptance/step-definitions/**/*.ts',
    ],
    format: ['progress', 'html:coverage/acceptance-report.html'],
    publishQuiet: true,
  },
};
