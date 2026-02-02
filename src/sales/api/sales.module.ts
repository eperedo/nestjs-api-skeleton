import { Module } from '@nestjs/common';
import { PrismaClient } from 'src/generated/prisma/client';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SaveSaleUseCase } from 'src/sales/domain/usecases/SaveSaleUseCase';
import { PrismaUnitOfWork } from 'src/shared/data/PrismaUnitOfWork';
import { SalePrismaRepository } from 'src/sales/data/SalePrismaRepository';
import { TransactionPrismaRepository } from 'src/transactions/data/TransactionPrismaRepository';
import { CustomerPrismaRepository } from 'src/customers/data/CustomerPrismaRepository';
import { SalesController } from './sales.controller';
import {
  CUSTOMER_REPOSITORY,
  SALE_REPOSITORY,
  TRANSACTION_REPOSITORY,
  UNIT_OF_WORK,
} from 'src/tokens/repository-tokens';

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
