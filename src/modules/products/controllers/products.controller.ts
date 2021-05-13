import { Request, Response } from 'express';

import CreateProductService from '../services/CreateProduct.service';

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
}
