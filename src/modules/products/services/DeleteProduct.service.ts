import AppError from '../../../shared/errors/AppError';
import ProductRepository from '../typeorm/repositories/products.repository';

export default class DeleteProductService {
  public async execute(id: string | string[]): Promise<void> {
    const productRepository = new ProductRepository();
    const allProductsExists = await productRepository.exists(id);
    if (!allProductsExists) {
      throw new AppError('some of the products was not found', 404);
    }
    await productRepository.removeOneOrMany(id);
  }
}
