import { Module } from '@nestjs/common';
import { CategoryPrismaRepository } from '../data/categories/CategoryPrismaRepository';
import { ProductPrismaRepository } from '../data/products/ProductPrismaRepository';
import { UserPrismaRepository } from '../data/users/UserPrismaRepository';
import { GetProductByIdUseCase } from '../domain/products/GetProductByIdUseCase';
import { SaveProductUseCase } from '../domain/products/SaveProductUseCase';
import { PrismaClient } from '../generated/prisma/client';
import { prisma } from '../prisma-client';
import { ProductsController } from './products.controller';

@Module({
  controllers: [ProductsController],
  providers: [
    { provide: PrismaClient, useValue: prisma },
    {
      provide: ProductPrismaRepository,
      useFactory: (prismaClient: PrismaClient) =>
        new ProductPrismaRepository(prismaClient),
      inject: [PrismaClient],
    },
    {
      provide: CategoryPrismaRepository,
      useFactory: (prismaClient: PrismaClient) =>
        new CategoryPrismaRepository(prismaClient),
      inject: [PrismaClient],
    },
    {
      provide: UserPrismaRepository,
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
      inject: [ProductPrismaRepository, CategoryPrismaRepository],
    },
    {
      provide: SaveProductUseCase,
      useFactory: (
        productRepository: ProductPrismaRepository,
        userRepository: UserPrismaRepository,
      ) => new SaveProductUseCase({ productRepository, userRepository }),
      inject: [ProductPrismaRepository, UserPrismaRepository],
    },
  ],
})
export class ProductsModule {}
