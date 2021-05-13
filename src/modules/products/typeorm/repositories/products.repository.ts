import { EntityRepository, getRepository, Repository } from 'typeorm';

import Product from '../entities/product';

interface ProductAdd {
  name: string;
  price: number;
  quantity: number;
}

@EntityRepository(Product)
export default class ProductRepository extends Repository<Product> {
  private productRepository = getRepository(Product);
  public async add(productData: ProductAdd): Promise<void> {
    await this.productRepository.insert({
      name: productData.name,
      price: productData.price,
      quantity: productData.quantity,
    });
  }
  public async findByName(name: string): Promise<Product | undefined> {
    return await this.productRepository.findOne({
      where: {
        name,
      },
    });
  }
}