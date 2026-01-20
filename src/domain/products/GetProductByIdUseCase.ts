import { Id } from '../generic/Base';
import { Maybe } from '../../utils/ts-utils';
import { Category } from '../categories/Category';
import { CategoryRepository } from '../categories/CategoryRepository';
import { Product } from './Product';
import { ProductRepository } from './ProductRepository';

type GetProductByIdResult = {
  product: Product;
  category: Maybe<Category>;
};

export class GetProductByIdUseCase {
  constructor(
    private options: {
      productRepository: ProductRepository;
      categoryRepository: CategoryRepository;
    },
  ) {}

  async execute(id: Id): Promise<GetProductByIdResult> {
    const product = await this.options.productRepository.getById(id);

    const category = product.categoryId
      ? await this.options.categoryRepository.getById(product.categoryId)
      : undefined;

    return { product, category };
  }
}
