import { getMockReq, getMockRes } from '@jest-mock/express';
import { createConnection, getRepository } from 'typeorm';

import ProductsController from './products.controller';
import Product from '../typeorm/entities/product';
import ProductRepository from '../typeorm/repositories/products.repository';

describe('product controller', () => {
  const productsController = new ProductsController();
  beforeAll(() => {
    return createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [Product],
      synchronize: true,
    });
  });
  afterEach(async () => {
    await getRepository(Product).delete('WHERE id==*');
  });
  test('create a new product', async () => {
    const req = getMockReq({
      body: {
        name: 'produto',
        price: 22.5,
        quantity: 15,
      },
    });
    const { res } = getMockRes();
    await productsController.create(req, res);
    const productRepository = new ProductRepository();
    const product = await productRepository.findByName('produto');
    expect(product?.id).toBeTruthy();
    expect(product?.name).toBe('produto');
    expect(product?.price).toBe(22.5);
    expect(product?.quantity).toBe(15);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
