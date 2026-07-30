# Setup MongoDB

Ensure Docker is running and that port 27018 is available for MongoDB.

Run the pre-start script to prepare your environment:

```bash
$ npm run pre-start
```

This will perform necessary setup actions before you begin.

# Tests

Unit tests use Jest. End-to-end and business-facing acceptance scenarios live
under `test/acceptance` and use Gherkin with Cucumber.js.

```bash
$ npm test
$ npm run test:e2e
$ npm run test:acceptance
```

Add one `.feature` file per behaviour in `test/acceptance/features`, with its
step definitions in `test/acceptance/step-definitions`. Cucumber writes an HTML
report to `coverage/acceptance-report.html` after each acceptance-test run.

# Compile and run the project

Use the following commands to compile and start the project in different modes:

## Development mode

To start the application in development mode:

```bash
$ npm run start
```

## Watch mode

For automatic rebuilding and reloading during development:

```bash
$ npm run dev
```

## Production mode

To start the application in production mode, with optimizations enabled:

```bash
$ npm run start:prod
```
