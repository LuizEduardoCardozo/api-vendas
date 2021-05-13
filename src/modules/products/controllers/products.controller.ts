import { Request, Response } from 'express';

import CreateProductService from '../services/CreateProduct.service';
import ListProductsService from '../services/ListProducts.service';

export default class ProductsController {
  public async create(req: Request, res: Response): Promise<void> {
    const { name, price, quantity } = req.body;
    const createProduct = new CreateProductService();
    await createProduct.execute({
      name,
      price,
      quantity,
    });
    res.status(200).send();
  }
  public async getAll(req: Request, res: Response): Promise<void> {
    const listProducts = new ListProductsService();
    const products = await listProducts.execute();
    res.status(200).send(products);
  }
}
