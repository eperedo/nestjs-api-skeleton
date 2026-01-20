import { Id } from '../generic/Base';
import { ErrorCodes } from '../generic/ErrorCodes';
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
      throw new Error(ErrorCodes.products.USER_NOT_AUTHORIZED);
    }

    const productResult = Product.build(product);
    if (!productResult.isSuccess()) {
      throw new Error(ErrorCodes.products.VALIDATION_FAILED);
    }

    await this.options.productRepository.save(productResult.value.data);
  }
}
