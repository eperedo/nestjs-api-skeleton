import { Module } from '@nestjs/common';
import { CategoryPrismaRepository } from '../data/categories/CategoryPrismaRepository';
import { ProductPrismaRepository } from '../data/products/ProductPrismaRepository';
import { UserPrismaRepository } from '../data/users/UserPrismaRepository';
import { GetProductByIdUseCase } from '../domain/products/GetProductByIdUseCase';
import { SaveProductUseCase } from '../domain/products/SaveProductUseCase';
import { PrismaClient } from '../generated/prisma/client';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module';
import {
  CATEGORY_REPOSITORY,
  PRODUCT_REPOSITORY,
  USER_REPOSITORY,
} from '../tokens/repository-tokens';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useFactory: (prismaClient: PrismaClient) =>
        new ProductPrismaRepository(prismaClient),
      inject: [PrismaClient],
    },
    {
      provide: CATEGORY_REPOSITORY,
      useFactory: (prismaClient: PrismaClient) =>
        new CategoryPrismaRepository(prismaClient),
      inject: [PrismaClient],
    },
    {
      provide: USER_REPOSITORY,
      useFactory: (prismaClient: PrismaClient) =>
        new UserPrismaRepository(prismaClient),
      inject: [PrismaClient],
    },
    {
      provide: GetProductByIdUseCase,
      useFactory: (
        productRepository: ProductPrismaRepository,
        categoryRepository: CategoryPrismaRepository,
      ) => new GetProductByIdUseCase({ productRepository, categoryRepository }),
      inject: [PRODUCT_REPOSITORY, CATEGORY_REPOSITORY],
    },
    {
      provide: SaveProductUseCase,
      useFactory: (
        productRepository: ProductPrismaRepository,
        userRepository: UserPrismaRepository,
      ) => new SaveProductUseCase({ productRepository, userRepository }),
      inject: [PRODUCT_REPOSITORY, USER_REPOSITORY],
    },
  ],
})
export class ProductsModule {}
