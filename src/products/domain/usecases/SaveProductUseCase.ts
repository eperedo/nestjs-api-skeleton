import { Id } from 'src/shared/domain/Base';
import { ErrorCodes } from 'src/shared/domain/ErrorCodes';
import { Product, ProductAttrs } from '../entities/Product';
import { ProductRepository } from '../repositories/ProductRepository';
import { UserRepository } from 'src/users/domain/repositories/UserRepository';

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
