import { createConnection } from 'typeorm';
import AppError from '../../../shared/errors/AppError';

import CreateProductService from '../services/CreateProduct.service';
import Product from '../typeorm/entities/product';
import ProductRepository from '../typeorm/repositories/products.repository';

describe('CreateProductService', () => {
  beforeAll(() => {
    return createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [Product],
      synchronize: true,
    });
  });
  test('creates a new product', async () => {
    const createProductService = new CreateProductService();
    const productRepository = new ProductRepository();
    await createProductService.execute({
      name: 'Boneca-2',
      price: 22.5,
      quantity: 15,
    });
    const product = await productRepository.findByName('Boneca-2');
    expect(product?.id).toBeTruthy();
    expect(product?.name).toBe('Boneca-2');
    expect(product?.price).toBe(22.5);
    expect(product?.quantity).toBe(15);
  });
  test('creates a duplicated product', async () => {
    let error = false;
    const createProductService = new CreateProductService();
    try {
      await createProductService.execute({
        name: 'Boneca-2',
        price: 22.5,
        quantity: 15,
      });
    } catch (e) {
      error = true;
      expect(e).toBeInstanceOf(AppError);
    }
    expect(error).toBeTruthy();
  });
});
