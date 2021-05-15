import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import express, { Express } from 'express';
import request from 'supertest';
import DTO from '../dtos/baseDto';

import errorMiddleware from './error';
import validator from './validator';

let app: Express;

class RequestDTO extends DTO {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsNumber()
  age: number;
}

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use(validator(RequestDTO));
  app.post('/', (req, res) => {
    res.send({ msg: 'ok' });
  });
  app.use(errorMiddleware);
});

describe('error middlware', () => {
  test('should throw a error if request is not in the parameters', async () => {
    const response = await request(app).post('/').send({
      name: 'eduardo',
      age: '25',
    });
    expect(response.statusCode).toBe(400);
  });
  test('should pass if request is valid', async () => {
    await request(app)
      .post('/')
      .send({
        name: 'eduardo',
        age: 25,
      })
      .expect(200);
  });
});
