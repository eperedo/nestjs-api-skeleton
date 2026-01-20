import { Id } from '../generic/Base';
import { Product, ProductAttrs } from './Product';
import { ProductRepository } from './ProductRepository';
import { UserRepository } from '../users/UserRepository';

export type SaveProductPayload = {
  userId: Id;
  product: ProductAttrs;
};

export class SaveProductUseCase {
  constructor(
    private options: {
      productRepository: ProductRepository;
      userRepository: UserRepository;
    },
  ) {}

  async execute({ userId, product }: SaveProductPayload): Promise<void> {
    const user = await this.options.userRepository.getById(userId);

    if (user.role !== 'admin') {
      throw new Error('User is not authorized');
    }

    const productResult = Product.build(product);
    if (!productResult.isSuccess()) {
      throw new Error('Invalid product');
    }

    await this.options.productRepository.save(productResult.value.data);
  }
}
