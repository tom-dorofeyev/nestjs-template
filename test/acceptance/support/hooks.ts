import { After, Before } from '@cucumber/cucumber';
import { Test } from '@nestjs/testing';
import { AppController } from '../../../src/app.controller';
import { ApiWorld } from './world';

Before(async function (this: ApiWorld) {
  const module = await Test.createTestingModule({
    controllers: [AppController],
  }).compile();

  this.app = module.createNestApplication();
  await this.app.init();
});

After(async function (this: ApiWorld) {
  await this.app?.close();
});
