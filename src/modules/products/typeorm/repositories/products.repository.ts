import { EntityRepository, getRepository, In, Repository } from 'typeorm';
import AppError from '../../../../shared/errors/AppError';

import Product from '../entities/product';

interface ProductAdd {
  name: string;
  price: number;
  quantity: number;
}

interface ProductUpdate {
  name?: string;
  price?: number;
  quantity?: number;
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
  public async getAll(): Promise<Product[]> {
    return await this.productRepository
      .createQueryBuilder('products')
      .select([
        'products.id',
        'products.name',
        'products.price',
        'products.quantity',
      ])
      .getMany();
  }
  public async getById(id: string): Promise<Product | undefined> {
    return await this.productRepository
      .createQueryBuilder('products')
      .select(['products.name', 'products.price', 'products.quantity'])
      .where('id = :id', { id })
      .getOne();
  }
  public async modify(
    id: string,
    { name, price, quantity }: ProductUpdate,
  ): Promise<void> {
    const productFound = await this.productRepository
      .createQueryBuilder('products')
      .where('id == :id', { id })
      .getOne();
    if (!productFound) {
      throw new AppError('product not found', 404);
    }
    if (name) productFound.name = name;
    if (price) productFound.price = price;
    if (quantity) productFound.quantity = quantity;
    await this.productRepository.save(productFound);
  }
  public async removeOneOrMany(id: string | string[]): Promise<void> {
    await this.productRepository.delete({
      id: typeof id === 'object' ? In(id) : id,
    });
  }
  public async exists(id: string[] | string): Promise<boolean> {
    if (id.length === 0) return false;
    const foundProducts = await this.productRepository.find({
      where: {
        id: typeof id === 'string' ? id : In(id),
      },
    });
    if (typeof id === 'string') {
      return foundProducts.length == 1;
    }
    return foundProducts.length === id.length;
  }
}
