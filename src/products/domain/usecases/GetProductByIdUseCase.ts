import { Id } from 'src/shared/domain/Base';
import type { Logger } from 'src/shared/domain/Logger';
import { Maybe } from 'src/shared/utils/ts-utils';
import { Category } from 'src/categories/domain/entities/Category';
import { CategoryRepository } from 'src/categories/domain/repositories/CategoryRepository';
import { Product } from '../entities/Product';
import { ProductRepository } from '../repositories/ProductRepository';

type GetProductByIdResult = {
  product: Product;
  category: Maybe<Category>;
};

export class GetProductByIdUseCase {
  constructor(
    private options: {
      productRepository: ProductRepository;
      categoryRepository: CategoryRepository;
      logger: Logger;
    },
  ) {}

  async execute(id: Id): Promise<GetProductByIdResult> {
    const product = await this.options.productRepository.getById(id);

    const category = product.categoryId
      ? await this.options.categoryRepository.getById(product.categoryId)
      : undefined;

    this.options.logger.info('usecase.getProductById.success', { ...product });
    return { product, category };
  }
}
