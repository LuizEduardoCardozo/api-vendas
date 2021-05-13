import AppError from '../../../shared/errors/AppError';
import ProductRepository from '../typeorm/repositories/products.repository';

interface CreateProduct {
  name: string;
  price: number;
  quantity: number;
}

export default class CreateServiceService {
  public async execute(productData: CreateProduct): Promise<void> {
    const { name, price, quantity } = productData;
    const productRepository = new ProductRepository();
    const foundProduct = await productRepository.findByName(name);
    if (foundProduct) {
      throw new AppError('product alreay registred', 409);
    }
    await productRepository.add({
      name,
      price,
      quantity,
    });
  }
}
