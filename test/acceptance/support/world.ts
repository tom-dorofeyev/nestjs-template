import { INestApplication } from '@nestjs/common';
import { IWorldOptions, World, setWorldConstructor } from '@cucumber/cucumber';

export class ApiWorld extends World {
  app?: INestApplication;
  response?: { status: number; body: unknown };

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(ApiWorld);
