import { Category } from 'src/categories/domain/entities/Category';
import { CategoryRepository } from 'src/categories/domain/repositories/CategoryRepository';
import { Product } from '../entities/Product';
import { ProductRepository } from '../repositories/ProductRepository';
import { GetProductByIdUseCase } from './GetProductByIdUseCase';

describe('GetProductByIdUseCase', () => {
  const productId = 'product-id';
  const categoryId = 'category-id';

  const product = Product.build({
    id: productId,
    name: 'Product Name',
    code: 'ABCDEF12',
    categoryId,
  }).get();

  const category = Category.build({
    id: categoryId,
    name: 'Category Name',
  }).get();

  it('returns product with category when categoryId exists', async () => {
    const productRepository: ProductRepository = {
      getById: () => Promise.resolve(product),
      save: () => Promise.resolve(),
    };

    const categoryRepository: CategoryRepository = {
      getById: () => Promise.resolve(category),
    };

    const useCase = new GetProductByIdUseCase({
      productRepository,
      categoryRepository,
    });

    const result = await useCase.execute(productId);

    expect(result).toEqual({ product, category });
  });

  it('returns product with undefined category when categoryId missing', async () => {
    const productWithoutCategory = Product.create({
      id: productId,
      name: 'Product Name',
      code: 'ABCDEF12',
      categoryId: undefined,
    });

    const productRepository: ProductRepository = {
      getById: () => Promise.resolve(productWithoutCategory),
      save: () => Promise.resolve(),
    };

    const categoryRepository: CategoryRepository = {
      getById: () => Promise.resolve(category),
    };

    const useCase = new GetProductByIdUseCase({
      productRepository,
      categoryRepository,
    });

    const result = await useCase.execute(productId);

    expect(result).toEqual({
      product: productWithoutCategory,
      category: undefined,
    });
  });
});
