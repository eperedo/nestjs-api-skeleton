import { Category } from 'src/domain/categories/Category';
import { CategoryRepository } from 'src/domain/categories/CategoryRepository';
import { Id } from 'src/domain/generic/Base';

import { PrismaClient } from 'src/generated/prisma/client';

export class CategoryPrismaRepository implements CategoryRepository {
  constructor(private prisma: PrismaClient) {}

  async getById(id: Id): Promise<Category> {
    const category = await this.prisma.category.findFirst({ where: { id } });
    if (!category) throw new Error('Category not found');
    return Category.build({
      id: category.id,
      name: category.name,
    }).get();
  }
}
