import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import 'reflect-metadata';

import createProductDTO from './createProduct.dto';

describe('create product dto', () => {
  test('should see the payload as a valid class', async () => {
    const payload = {
      name: 'boneca',
      price: 11.5,
      quantity: 15,
    };
    const payloadClass = plainToClass(createProductDTO, payload);
    const errors = await validate(payloadClass);
    expect(errors).toHaveLength(0);
  });
  test('should return error if name is not a string', async () => {
    const payload = {
      name: { text: 'name' },
      price: 11.5,
      quantity: 15,
    };
    const payloadClass = plainToClass(createProductDTO, payload);
    const errors = await validate(payloadClass);
    const validationError = errors[0]?.constraints;
    expect(validationError).toHaveProperty('isString');
  });
  test('should return error when name is too short', async () => {
    const payload = {
      name: 'a',
      price: 11.5,
      quantity: 15,
    };
    const payloadClass = plainToClass(createProductDTO, payload);
    const errors = await validate(payloadClass);
    const validationError = errors[0]?.constraints;
    expect(validationError).toHaveProperty('isLength');
  });
  test('should return error when name is too long', async () => {
    const payload = {
      name: 'aaaaaaaaaaaaaaaaa',
      price: 11.5,
      quantity: 15,
    };
    const payloadClass = plainToClass(createProductDTO, payload);
    const errors = await validate(payloadClass);
    const validationError = errors[0]?.constraints;
    expect(validationError).toHaveProperty('isLength');
  });
  test('should return error when name is empty', async () => {
    const payload = {
      price: 11.5,
      quantity: 15,
    };
    const payloadClass = plainToClass(createProductDTO, payload);
    const errors = await validate(payloadClass);
    const validationError = errors[0]?.constraints;
    expect(validationError).toHaveProperty('isNotEmpty');
  });
  test('should return error when price is smaller than 0.01', async () => {
    const payload = {
      name: 'Boneca',
      price: -15,
      quantity: 15,
    };
    const payloadClass = plainToClass(createProductDTO, payload);
    const errors = await validate(payloadClass);
    const validationError = errors[0]?.constraints;
    expect(validationError).toHaveProperty('min');
  });
  test('should return error when price is in wrong type', async () => {
    const payload = {
      name: 'Boneca',
      price: '11.50',
      quantity: 15,
    };
    const payloadClass = plainToClass(createProductDTO, payload);
    const errors = await validate(payloadClass);
    const validationError = errors[0]?.constraints;
    expect(validationError).toHaveProperty('min');
  });
  test('should return error when price is empty', async () => {
    const payload = {
      name: 'Boneca',
      quantity: 15,
    };
    const payloadClass = plainToClass(createProductDTO, payload);
    const errors = await validate(payloadClass);
    const validationError = errors[0]?.constraints;
    expect(validationError).toHaveProperty('isNotEmpty');
  });
  test('should return error when quantity is smaller than 0.01', async () => {
    const payload = {
      name: 'Boneca',
      price: 15,
      quantity: -15,
    };
    const payloadClass = plainToClass(createProductDTO, payload);
    const errors = await validate(payloadClass);
    const validationError = errors[0]?.constraints;
    expect(validationError).toHaveProperty('min');
  });
  test('should return error when quantity is in wrong type', async () => {
    const payload = {
      name: 'Boneca',
      price: 11.5,
      quantity: '15',
    };
    const payloadClass = plainToClass(createProductDTO, payload);
    const errors = await validate(payloadClass);
    const validationError = errors[0]?.constraints;
    expect(validationError).toHaveProperty('min');
  });
  test('should return error when quantity is empty', async () => {
    const payload = {
      name: 'Boneca',
      price: 11.5,
    };
    const payloadClass = plainToClass(createProductDTO, payload);
    const errors = await validate(payloadClass);
    const validationError = errors[0]?.constraints;
    expect(validationError).toHaveProperty('isNotEmpty');
  });
});
