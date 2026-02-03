import { Module } from '@nestjs/common';
import { CategoryPrismaRepository } from 'src/categories/data/CategoryPrismaRepository';
import { ProductPrismaRepository } from 'src/products/data/ProductPrismaRepository';
import { UserPrismaRepository } from 'src/users/data/UserPrismaRepository';
import { GetProductByIdUseCase } from 'src/products/domain/usecases/GetProductByIdUseCase';
import { SaveProductUseCase } from 'src/products/domain/usecases/SaveProductUseCase';
import { PrismaClient } from 'src/generated/prisma/client';
import { ProductsController } from './products.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import {
  CATEGORY_REPOSITORY,
  LOGGER,
  PRODUCT_REPOSITORY,
  USER_REPOSITORY,
} from 'src/tokens/repository-tokens';
import { LoggerModule } from 'src/shared/logger/logger.module';
import type { Logger } from 'src/shared/domain/Logger';

@Module({
  imports: [PrismaModule, LoggerModule],
  controllers: [ProductsController],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useFactory: (prismaClient: PrismaClient, logger: Logger) =>
        new ProductPrismaRepository(prismaClient, logger),
      inject: [PrismaClient, LOGGER],
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
        logger: Logger,
      ) =>
        new GetProductByIdUseCase({
          productRepository,
          categoryRepository,
          logger,
        }),
      inject: [PRODUCT_REPOSITORY, CATEGORY_REPOSITORY, LOGGER],
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
