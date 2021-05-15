import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import createProductDTO from '../dtos/createProduct.dto';
import BadRequestError from './BadRequest';

describe('bad request error', () => {
  test('should mount correctly the errors', async () => {
    const payload = {
      name: { text: 'name' },
      price: '11.5',
    };
    const payloadClass = plainToClass(createProductDTO, payload);
    const validationErrors = await validate(payloadClass);
    const badRequestError = new BadRequestError(validationErrors);
    const expectErrors = {
      errors: [
        {
          field: 'name',
          errors: ['isLength', 'isString'],
        },
        {
          field: 'price',
          errors: ['isNumber', 'min'],
        },
        {
          field: 'quantity',
          errors: ['isNumber', 'min', 'isNotEmpty'],
        },
      ],
    };
    expect({ errors: badRequestError.getMessage() }).toStrictEqual(
      expectErrors,
    );
  });
  test('should return 400 status code', async () => {
    const payload = {
      name: { text: 'name' },
      price: '11.5',
    };
    const payloadClass = plainToClass(createProductDTO, payload);
    const validationErrors = await validate(payloadClass);
    const badRequestError = new BadRequestError(validationErrors);
    expect(badRequestError.getStatusCode()).toBe(400);
  });
});
