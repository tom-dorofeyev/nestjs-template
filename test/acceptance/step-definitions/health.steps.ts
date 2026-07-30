import { Then, When } from '@cucumber/cucumber';
import { strict as assert } from 'node:assert';
import * as request from 'supertest';
import { ApiWorld } from '../support/world';

When('I request the health endpoint', async function (this: ApiWorld) {
  assert.ok(this.app, 'The Nest application was not initialized');

  const response = await request(this.app.getHttpServer()).get('/health');
  this.response = { status: response.status, body: response.body };
});

Then('the response status is {int}', function (this: ApiWorld, status: number) {
  assert.equal(this.response?.status, status);
});

Then('the response body is', function (this: ApiWorld, expectedBody: string) {
  assert.deepEqual(this.response?.body, JSON.parse(expectedBody));
});
