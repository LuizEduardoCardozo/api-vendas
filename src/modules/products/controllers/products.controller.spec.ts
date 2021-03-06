import { getMockReq, getMockRes } from '@jest-mock/express';
import { createConnection, getRepository } from 'typeorm';

import ProductsController from './products.controller';
import Product from '../typeorm/entities/product';
import ProductRepository from '../typeorm/repositories/products.repository';
import CreateProductService from '../services/CreateProduct.service';

describe('Create product controller', () => {
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
    const products = await getRepository(Product).find({});
    await getRepository(Product).remove(products);
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
  test('list all products', async () => {
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
    const req = getMockReq();
    const { res } = getMockRes();
    await productsController.getAll(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
  test('should return 200 if find a product', async () => {
    const productRepository = new ProductRepository();
    await productRepository.add({
      name: 'product 1',
      price: 22.5,
      quantity: 15,
    });
    const foundProduct = await getRepository(Product).findOne({
      where: {
        name: 'product 1',
      },
    });
    const foundProductId = foundProduct?.id ?? '';
    const req = getMockReq({
      params: {
        id: foundProductId,
      },
    });
    const { res } = getMockRes();
    await productsController.getAll(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
  test('should return 203 if doesnt find a product', async () => {
    const req = getMockReq({
      params: {
        id: 'this-id-does-not-exists',
      },
    });
    const { res } = getMockRes();
    await productsController.details(req, res);
    expect(res.status).toHaveBeenCalledWith(203);
  });
  test('should return 200 if update sucessfully', async () => {
    const createProductService = new CreateProductService();
    await createProductService.execute({
      name: 'Boneca',
      price: 22.5,
      quantity: 15,
    });
    const product = await getRepository(Product).findOne({
      where: {
        name: 'Boneca',
      },
    });
    const productId = product?.id ?? '';
    const req = getMockReq({
      params: {
        id: productId,
      },
      body: {
        name: 'Boneca atualizada',
      },
    });
    const { res } = getMockRes();
    await productsController.update(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
  test('should return 200 if delete sucessfully', async () => {
    const createProductService = new CreateProductService();
    await createProductService.execute({
      name: 'Carrinho',
      price: 22.5,
      quantity: 15,
    });
    const product = await getRepository(Product).findOne({
      where: {
        name: 'Carrinho',
      },
    });
    const productId = product?.id ?? '';
    const req = getMockReq({
      params: {
        id: productId,
      },
    });
    const { res } = getMockRes();
    await productsController.delete(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
