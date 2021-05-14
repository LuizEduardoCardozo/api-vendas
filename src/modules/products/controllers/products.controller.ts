import { Request, Response } from 'express';

import CreateProductService from '../services/CreateProduct.service';
import DeleteProductService from '../services/DeleteProduct.service';
import ListProductsService from '../services/ListProducts.service';
import ShowProductService from '../services/ShowProduct.service';
import UpdateProductService from '../services/UpdateProduct.service';

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
  public async details(req: Request, res: Response): Promise<void> {
    const productDetailsService = new ShowProductService();
    const productDetails = await productDetailsService.execute(req.params.id);
    res.status(productDetails?.id ? 200 : 203).send(productDetails);
  }
  public async update(req: Request, res: Response): Promise<void> {
    const updateProductService = new UpdateProductService();
    await updateProductService.execute(req.params.id, req.body);
    res.status(200).send();
  }
  public async delete(req: Request, res: Response): Promise<void> {
    const deleteProductService = new DeleteProductService();
    await deleteProductService.execute(req.params.id);
    res.status(200).send();
  }
}
