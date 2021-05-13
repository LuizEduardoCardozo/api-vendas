import Product from '../typeorm/entities/product';
import ProductRepository from '../typeorm/repositories/products.repository';

export default class ListProductsService {
  public async execute(): Promise<Product[] | []> {
    const productRepository = new ProductRepository();
    return await productRepository.getAll();
  }
}
