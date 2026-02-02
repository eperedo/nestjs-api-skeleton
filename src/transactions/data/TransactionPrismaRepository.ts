import { Transaction } from 'src/transactions/domain/entities/Transaction';
import { TransactionRepository } from 'src/transactions/domain/repositories/TransactionRepository';
import { Prisma, PrismaClient } from 'src/generated/prisma/client';

type PrismaClientLike = PrismaClient | Prisma.TransactionClient;

export class TransactionPrismaRepository implements TransactionRepository {
  constructor(private prisma: PrismaClientLike) {}

  async save(transaction: Transaction): Promise<Transaction> {
    await this.prisma.transaction.create({
      data: {
        id: transaction.id,
        amount: transaction.amount,
        saleId: transaction.saleId,
      },
    });

    return transaction;
  }
}
