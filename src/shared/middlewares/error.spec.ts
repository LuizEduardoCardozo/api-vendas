import { Response } from 'express';
import request from 'supertest';

import app from '../app';
import AppError from '../errors/AppError';
import errorMiddleware from './error';

describe('error middlware', () => {
  test('should parse the error if is instance of AppError', async () => {
    app.get('/error-1', () => {
      throw new AppError('error-message', 418);
    });
    app.use(errorMiddleware);
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
    const error = new Error('another-error-message');
    app.get('/error-2', () => {
      throw error;
    });
    app.use(errorMiddleware);
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
    app.get('/not-an-error', (_, res: Response) => {
      res.status(200).send({ msg: 'ok' });
    });
    app.use(errorMiddleware);
    await request(app).get('/not-an-error').expect(200).expect({
      msg: 'ok',
    });
  });
});
