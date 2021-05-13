import { createConnection, getRepository } from 'typeorm';
import Product from '../typeorm/entities/product';
import UpdateProductService from './UpdateProduct.service';

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
  beforeEach(async () => {
    await getRepository(Product).delete('WHERE id==*');
    Promise.all([
      getRepository(Product).insert({
        name: 'produto 1',
        price: 22.5,
        quantity: 15,
      }),
      getRepository(Product).insert({
        name: 'produto 2',
        price: 22.5,
        quantity: 15,
      }),
    ]);
  });
  test('Update the product name', async () => {
    const foundProduct = await getRepository(Product).findOne({
      where: {
        name: 'produto 1',
      },
    });
    const foundProductId = foundProduct?.id ?? '';
    const updateProductService = new UpdateProductService();
    await updateProductService.execute(foundProductId, {
      name: 'produto 1 atualizado',
    });
    const productAfter = await getRepository(Product).findOne({
      where: {
        id: foundProductId,
      },
    });
    expect(productAfter).toBeTruthy();
    expect(productAfter?.name).toBe('produto 1 atualizado');
    expect(productAfter?.price).toBe(foundProduct?.price);
    expect(productAfter?.quantity).toBe(foundProduct?.quantity);
  });
  test('Update the product price', async () => {
    const foundProduct = await getRepository(Product).findOne({
      where: {
        name: 'produto 1',
      },
    });
    const foundProductId = foundProduct?.id ?? '';
    const updateProductService = new UpdateProductService();
    await updateProductService.execute(foundProductId, {
      price: 11.5,
    });
    const productAfter = await getRepository(Product).findOne({
      where: {
        id: foundProductId,
      },
    });
    expect(productAfter).toBeTruthy();
    expect(productAfter?.name).toBe(foundProduct?.name);
    expect(productAfter?.price).toBe(11.5);
    expect(productAfter?.quantity).toBe(foundProduct?.quantity);
  });
  test('Update the product quantity', async () => {
    const foundProduct = await getRepository(Product).findOne({
      where: {
        name: 'produto 1',
      },
    });
    const foundProductId = foundProduct?.id ?? '';
    const updateProductService = new UpdateProductService();
    await updateProductService.execute(foundProductId, {
      quantity: 10,
    });
    const productAfter = await getRepository(Product).findOne({
      where: {
        id: foundProductId,
      },
    });
    expect(productAfter).toBeTruthy();
    expect(productAfter?.name).toBe(foundProduct?.name);
    expect(productAfter?.price).toBe(foundProduct?.price);
    expect(productAfter?.quantity).toBe(10);
  });
  test('should return error if try to rename a product with a taken name', async () => {
    const foundProduct = await getRepository(Product).findOne({
      where: {
        name: 'produto 1',
      },
    });
    const foundProductId = foundProduct?.id ?? '';
    const updateProductService = new UpdateProductService();
    let error = false;
    try {
      await updateProductService.execute(foundProductId, {
        name: 'produto 2',
      });
    } catch (e) {
      error = true;
      expect(e.statusCode).toBe(409);
    }
    expect(error).toBeTruthy();
  });
});
