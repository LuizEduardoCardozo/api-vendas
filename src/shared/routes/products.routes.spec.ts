import request from 'supertest';
import { createConnection, getRepository } from 'typeorm';

import app from '../app';
import Product from '../../modules/products/typeorm/entities/product';

/*
router.get('/products', productsController.getAll);
router.post('/products', productsController.create);
router.get('/products/:id', productsController.details);
router.patch('/products/:id', productsController.update);
router.delete('/products', productsController.delete);
*/

describe('ProductsRouter', () => {
  beforeAll(() => {
    return createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [Product],
      synchronize: true,
    });
  });
  test('should return 200 when POST to /products', async () => {
    await request(app)
      .post('/products')
      .send({
        name: 'Boneca',
        price: 11.5,
        quantity: 15,
      })
      .expect(200);
  });
  test('should return 200 when GET to /products', async () => {
    await request(app).get('/products').expect(200);
  });
  test('should return 200 when post to /products', async () => {
    const product = await getRepository(Product).findOne({
      where: {
        name: 'Boneca',
      },
    });
    const id = product?.id ?? '';
    await request(app)
      .get('/products/' + id)
      .expect(200);
  });
  test('should return 200 when PATCH to /products/:id', async () => {
    const product = await getRepository(Product).findOne({
      where: {
        name: 'Boneca',
      },
    });
    const productId = product?.id ?? '';
    await request(app)
      .patch(`/products/${productId}`)
      .send({ name: 'Boneca amarela' })
      .expect(200);
  });
  test('should return 200 when DELETE to /products/:id', async () => {
    const product = await getRepository(Product).findOne({
      where: {
        name: 'Boneca amarela',
      },
    });
    const id = product?.id ?? '';
    await request(app)
      .delete('/products/' + id)
      .expect(200);
  });
});
