import express, { Express, Response } from 'express';
import request from 'supertest';

import AppError from '../errors/AppError';
import errorMiddleware from './error';

let app: Express;

beforeAll(() => {
  app = express();
  app.get('/error-1', () => {
    throw new AppError('error-message', 418);
  });
  app.get('/error-2', () => {
    throw new Error('another-error-message');
  });
  app.get('/not-an-error', (_, res: Response) => {
    res.send({ msg: 'ok' });
  });
  app.use(errorMiddleware);
});

describe('error middlware', () => {
  test('should parse the error if is instance of AppError', async () => {
    await request(app)
      .get('/error-1')
      .expect(418)
      .expect({
        errors: [
          {
            msg: 'error-message',
          },
        ],
      });
  });
  test('should return 500 is error is not instance of AppError', async () => {
    await request(app)
      .get('/error-2')
      .expect(500)
      .expect({
        errors: [
          {
            msg: 'another-error-message',
          },
        ],
      });
  });
  test('should return 200 when route doesnt throw a error', async () => {
    await request(app).get('/not-an-error').expect(200).expect({
      msg: 'ok',
    });
  });
});
