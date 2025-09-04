import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Connection } from 'mongoose';
import { Queue } from 'bullmq';
import { getConnectionToken } from '@nestjs/mongoose';
import { getQueueToken } from '@nestjs/bullmq';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mongoConnection: Connection;
  let timerQueue: Queue;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    mongoConnection = app.get(getConnectionToken());
    timerQueue = app.get(getQueueToken('timerQueue'));
    await app.init();
  });

  afterAll(async () => {
    await mongoConnection.close();
    await timerQueue.close();
    await app.close();
  });

  it('/test-message (POST)', async () => {
    await request(app.getHttpServer())
      .post('/test-message')
      .expect(201)
      .expect('Hi there');
  });
});
