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
    await productsRepository.modify(id, updateProperties);
  }
}
