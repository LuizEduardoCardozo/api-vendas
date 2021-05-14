import { createConnection, getRepository } from 'typeorm';
import Product from '../typeorm/entities/product';
import DeleteProductService from './DeleteProduct.service';

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
    const products = await getRepository(Product).find({});
    await getRepository(Product).remove(products);
    await Promise.all([
      getRepository(Product).insert({
        name: 'produto 1',
        price: 22.5,
        quantity: 15,
      }),
      getRepository(Product).insert({
        name: 'produto 2',
        price: 50,
        quantity: 75,
      }),
      getRepository(Product).insert({
        name: 'produto 3',
        price: 120,
        quantity: 13,
      }),
    ]);
  });
  test('should delete a product', async () => {
    const foundProduct = await getRepository(Product).findOne({
      where: {
        name: 'produto 1',
      },
    });
    const deleteProductsService = new DeleteProductService();
    const productId = foundProduct?.id ?? '';
    await deleteProductsService.execute(productId);
    const products = await getRepository(Product).find();
    expect(products).toHaveLength(2);
  });
  test('should delete many products', async () => {
    const foundProduct = await getRepository(Product).find({
      where: [
        {
          name: 'produto 1',
        },
        {
          name: 'produto 2',
        },
      ],
    });
    const foundProductIds = foundProduct.map(product => product.id);
    const deleteProductsService = new DeleteProductService();
    await deleteProductsService.execute(foundProductIds);
    const products = await getRepository(Product).find();
    expect(products).toHaveLength(1);
  });

  test('should return a error if a product was not found', async () => {
    const deleteProductsService = new DeleteProductService();
    let error = false;
    try {
      await deleteProductsService.execute('this-id-doesnot-exists');
    } catch (e) {
      error = true;
      expect(e.statusCode).toBe(404);
    }
    expect(error).toBeTruthy();
  });
  test('should return a error if a product in array was not found', async () => {
    const foundProduct = await getRepository(Product).findOne({
      where: {
        name: 'produto 1',
      },
    });
    const foundProductIds = [foundProduct?.id ?? '', 'this-id-doesnot-exists'];
    const deleteProductsService = new DeleteProductService();
    let error = false;
    try {
      await deleteProductsService.execute(foundProductIds);
    } catch (e) {
      error = true;
      expect(e.statusCode).toBe(404);
    }
    expect(error).toBeTruthy();
  });
});
