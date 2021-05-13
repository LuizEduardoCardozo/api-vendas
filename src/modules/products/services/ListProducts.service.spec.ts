import { createConnection, getRepository } from 'typeorm';
import Product from '../typeorm/entities/product';
import ListProductsService from './ListProducts.service';

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
  test('Test if service is listing correctly', async () => {
    const listProductsService = new ListProductsService();
    const products = await listProductsService.execute();
    expect(products).toHaveLength(3);
    expect(products[0].created_at).toBeUndefined();
    expect(products[0].updated_at).toBeUndefined();
    expect(products[0].name).toBe('produto 1');
    expect(products[0].price).toBe(22.5);
    expect(products[0].quantity).toBe(15);
    expect(1).toBe(1);
  });
});
