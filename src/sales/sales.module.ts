import { Module } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaModule } from '../prisma/prisma.module';
import { SaveSaleUseCase } from '../domain/sales/SaveSaleUseCase';
import { PrismaUnitOfWork } from '../data/unit-of-work/PrismaUnitOfWork';
import { SalePrismaRepository } from '../data/sales/SalePrismaRepository';
import { TransactionPrismaRepository } from '../data/transactions/TransactionPrismaRepository';
import { CustomerPrismaRepository } from '../data/customers/CustomerPrismaRepository';
import { SalesController } from './sales.controller';
import {
  CUSTOMER_REPOSITORY,
  SALE_REPOSITORY,
  TRANSACTION_REPOSITORY,
  UNIT_OF_WORK,
} from '../tokens/repository-tokens';

@Module({
  imports: [PrismaModule],
  controllers: [SalesController],
  providers: [
    {
      provide: CUSTOMER_REPOSITORY,
      useFactory: (prismaClient: PrismaClient) =>
        new CustomerPrismaRepository(prismaClient),
      inject: [PrismaClient],
    },
    {
      provide: SALE_REPOSITORY,
      useFactory: (prismaClient: PrismaClient) =>
        new SalePrismaRepository(prismaClient),
      inject: [PrismaClient],
    },
    {
      provide: TRANSACTION_REPOSITORY,
      useFactory: (prismaClient: PrismaClient) =>
        new TransactionPrismaRepository(prismaClient),
      inject: [PrismaClient],
    },
    {
      provide: UNIT_OF_WORK,
      useFactory: (prismaClient: PrismaClient) =>
        new PrismaUnitOfWork(prismaClient, (transactionClient) => ({
          saleRepository: new SalePrismaRepository(transactionClient),
          transactionRepository: new TransactionPrismaRepository(
            transactionClient,
          ),
        })),
      inject: [PrismaClient],
    },
    {
      provide: SaveSaleUseCase,
      useFactory: (unitOfWork, customerRepository) =>
        new SaveSaleUseCase({
          unitOfWork,
          customerRepository,
        }),
      inject: [UNIT_OF_WORK, CUSTOMER_REPOSITORY],
    },
  ],
})
export class SalesModule {}
