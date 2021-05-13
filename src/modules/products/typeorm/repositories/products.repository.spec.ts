import { createConnection, getRepository } from 'typeorm';

import Product from '../entities/product';
import ProductRepository from './products.repository';

describe('product repository', () => {
  beforeAll(() => {
    return createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [Product],
      synchronize: true,
    });
  });
  test('create a entry in database', async () => {
    const productRepository = new ProductRepository();
    await productRepository.add({ name: 'Boneca', price: 22.5, quantity: 15 });
    const product = await getRepository(Product).findOne({
      where: { name: 'Boneca' },
    });
    expect(product?.price).toBe(22.5);
  });
  test('try to find a entry in database by name', async () => {
    const productRepository = new ProductRepository();
    await productRepository.add({
      name: 'Carrinho',
      price: 22.5,
      quantity: 15,
    });
    const product = await productRepository.findByName('Carrinho');
    expect(product?.price).toBe(22.5);
  });
});
