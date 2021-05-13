import { createConnection, getRepository } from 'typeorm';
import Product from '../typeorm/entities/product';
import ShowProductService from './ShowProduct.service';

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
    const foundProduct = await getRepository(Product).findOne({
      where: {
        name: 'produto 1',
      },
    });
    const showProductService = new ShowProductService();
    const product = await showProductService.execute(foundProduct?.id ?? '');
    expect(product).toBeTruthy();
    expect(product?.created_at).toBeUndefined();
    expect(product?.updated_at).toBeUndefined();
    expect(product?.name).toBe(foundProduct?.name);
    expect(product?.price).toBe(foundProduct?.price);
    expect(product?.quantity).toBe(foundProduct?.quantity);
  });
});
