import express, { Express } from 'express';
import request from 'supertest';

import bodyParser from './bodyParser';

let app: Express;

beforeAll(() => {
  app = express();
  app.use(bodyParser());
  app.get('/json', (_, res) => {
    res.send({ msg: 'ok' });
  });
});

describe('app', () => {
  test('if the body was parsed as json', async () => {
    await request(app)
      .get('/json')
      .set('Accept', 'application/json')
      .expect({ msg: 'ok' })
      .expect(200);
  });
});
