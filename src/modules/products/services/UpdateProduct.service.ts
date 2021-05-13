import AppError from '../../../shared/errors/AppError';
import ProductRepository from '../typeorm/repositories/products.repository';

interface ProductUpdate {
  name?: string;
  price?: number;
  quantity?: number;
}

export default class UpdateProductService {
  public async execute(
    id: string,
    updateProperties: ProductUpdate,
  ): Promise<void> {
    const productsRepository = new ProductRepository();
    if (updateProperties?.name) {
      const foundProduct = await productsRepository.findByName(
        updateProperties.name,
      );
      if (foundProduct) {
        throw new AppError('error, this product is already registred', 409);
      }
    }
    await productsRepository.modify(id, updateProperties);
  }
}
