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
  test('should update a product name', async () => {
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
    const productId = addedProduct?.id ?? '';
    await productRepository.modify(productId, {
      name: 'product 1 atualized',
    });
    const product = await getRepository(Product).findOne({
      where: {
        name: 'product 1 atualized',
      },
    });
    const productLastName = await getRepository(Product).findOne({
      where: {
        name: 'product 1',
      },
    });
    expect(productLastName).toBeUndefined();
    expect(product?.id).toBe(productId);
    expect(product?.name).toBe('product 1 atualized');
    expect(product?.price).toBe(22.5);
    expect(product?.quantity).toBe(15);
  });
  test('should throw an error if product was not found', async () => {
    const productRepository = new ProductRepository();
    let error = false;
    try {
      await productRepository.modify('this-id-didnt-exists', {
        name: 'product 1 atualized',
      });
    } catch (e) {
      error = true;
      expect(e.statusCode).toBe(404);
    }
    expect(error).toBeTruthy();
  });
  test('should remove a product', async () => {
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
    const foundProduct = await getRepository(Product).findOne({
      where: {
        name: 'product 1',
      },
    });
    const productId = foundProduct?.id ?? '';
    await productRepository.removeOneOrMany(productId);
    const products = await productRepository.getAll();
    expect(products).toHaveLength(2);
  });
  test('should remove many products', async () => {
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
    const foundProducts = await getRepository(Product).find({
      where: [
        {
          name: 'product 1',
        },
        {
          name: 'product 2',
        },
      ],
    });
    const productsIds = foundProducts.map(product => product.id);
    await productRepository.removeOneOrMany(productsIds);
    const products = await productRepository.getAll();
    expect(products).toHaveLength(1);
  });
});
