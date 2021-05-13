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
  afterEach(async () => {
    await getRepository(Product).delete('WHERE id==*');
  });
  test('create a entry in database', async () => {
    const productRepository = new ProductRepository();
    await productRepository.add({ name: 'Violao', price: 22.5, quantity: 15 });
    const product = await getRepository(Product).findOne({
      where: { name: 'Violao' },
    });
    expect(product?.price).toBe(22.5);
  });
  test('try to find a entry in database by name', async () => {
    const productRepository = new ProductRepository();
    await productRepository.add({
      name: 'Carrinho-2',
      price: 22.5,
      quantity: 15,
    });
    const product = await productRepository.findByName('Carrinho-2');
    expect(product?.price).toBe(22.5);
  });
});
