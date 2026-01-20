import { Id } from 'src/domain/generic/Base';
import { Product } from 'src/domain/products/Product';
import { ProductRepository } from 'src/domain/products/ProductRepository';
import { PrismaClient } from 'src/generated/prisma/client';

export class ProductPrismaRepository implements ProductRepository {
  constructor(private prisma: PrismaClient) {}

  async getById(id: Id): Promise<Product> {
    const product = await this.prisma.product.findFirst({ where: { id } });
    if (!product) throw new Error('Product not found');
    return Product.build({
      categoryId: product.categoryId ? product.categoryId : undefined,
      id: product.id,
      name: product.name,
      code: product.code,
    }).get();
  }

  async save(product: Product): Promise<void> {
    return this.prisma.product
      .upsert({
        where: { id: product.id },
        update: {
          name: product.name,
          code: product.code,
          categoryId: product.categoryId ? product.categoryId : null,
        },
        create: {
          id: product.id,
          name: product.name,
          code: product.code,
          categoryId: product.categoryId ? product.categoryId : null,
        },
      })
      .then(() => {});
  }
}
