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
    const products = await getRepository(Product).find({});
    await getRepository(Product).remove(products);
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
  test('try to find all products', async () => {
    const productRepository = new ProductRepository();
    await Promise.all([
      productRepository.add({
        name: 'product 1',
        price: 22.5,
        quantity: 15,
      }),
      productRepository.add({
        name: 'product 2',
        price: 22.5,
        quantity: 15,
      }),
      productRepository.add({
        name: 'product 3',
        price: 22.5,
        quantity: 15,
      }),
    ]);
    const product = await productRepository.getAll();
    expect(product).toHaveLength(3);
  });
  test('try to find a product by their id', async () => {
    const productRepository = new ProductRepository();
    await productRepository.add({
      name: 'product 1',
      price: 22.5,
      quantity: 15,
    });
    const addedProduct = await getRepository(Product).findOne({
      where: {
        name: 'product 1',
      },
    });
    const product = await productRepository.getById(addedProduct?.id ?? '');
    expect(product?.id).toBeUndefined();
    expect(product?.created_at).toBeUndefined();
    expect(product?.updated_at).toBeUndefined();
    expect(product?.name).toBe('product 1');
  });
});
