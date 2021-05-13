import Product from '../typeorm/entities/product';
import ProductRepository from '../typeorm/repositories/products.repository';

export default class ShowProductService {
  public async execute(id: string): Promise<Product | undefined> {
    const productRepository = new ProductRepository();
    return productRepository.getById(id);
  }
}
