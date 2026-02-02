import { Product, ProductAttrs } from './Product';
import { ProductRepository } from './ProductRepository';
import { SaveProductUseCase } from './SaveProductUseCase';
import { User } from '../users/User';
import { UserRepository } from '../users/UserRepository';
import { vi, describe, it, expect } from 'vitest';

describe('SaveProductUseCase', () => {
  const adminUser = User.create({
    id: 'admin-id',
    username: 'admin',
    role: 'admin',
  });

  const guestUser = User.create({
    id: 'guest-id',
    username: 'guest',
    role: 'guest',
  });

  const validProduct: ProductAttrs = {
    id: 'product-id',
    name: 'Product Name',
    code: 'ABCDEFGH',
    categoryId: undefined,
  };

  it('throws when user is not admin', async () => {
    const productRepository: ProductRepository = {
      getById: () => Promise.reject(new Error('Not used')),
      save: () => Promise.resolve(),
    };

    const userRepository: UserRepository = {
      getById: () => Promise.resolve(guestUser),
    };

    const useCase = new SaveProductUseCase({
      productRepository,
      userRepository,
    });

    await expect(
      useCase.execute({ userId: guestUser.id, product: validProduct }),
    ).rejects.toThrow('User is not authorized');
  });

  it('throws when product is invalid', async () => {
    const productRepository: ProductRepository = {
      getById: () => Promise.reject(new Error('Not used')),
      save: () => Promise.resolve(),
    };

    const userRepository: UserRepository = {
      getById: () => Promise.resolve(adminUser),
    };

    const useCase = new SaveProductUseCase({
      productRepository,
      userRepository,
    });

    await expect(
      useCase.execute({
        userId: adminUser.id,
        product: { ...validProduct, code: 'SHORT' },
      }),
    ).rejects.toThrow('PRODUCT_VALIDATION_FAILED');
  });

  it('saves product when user is admin and data valid', async () => {
    const saveSpy = vi.fn(() => Promise.resolve());

    const productRepository: ProductRepository = {
      getById: () => Promise.reject(new Error('Not used')),
      save: saveSpy,
    };

    const userRepository: UserRepository = {
      getById: () => Promise.resolve(adminUser),
    };

    const useCase = new SaveProductUseCase({
      productRepository,
      userRepository,
    });

    await useCase.execute({ userId: adminUser.id, product: validProduct });

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledWith(
      Product.build(validProduct).value.data,
    );
  });
});
