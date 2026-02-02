import { UnitOfWork } from 'src/domain/generic/UnitOfWork';
import { Prisma, PrismaClient } from 'src/generated/prisma/client';

export type PrismaRepositoryFactory<Repositories> = (
  client: Prisma.TransactionClient,
) => Repositories;

export class PrismaUnitOfWork<
  Repositories,
> implements UnitOfWork<Repositories> {
  constructor(
    private prisma: PrismaClient,
    private repositoryFactory: PrismaRepositoryFactory<Repositories>,
  ) {}

  run<T>(work: (repositories: Repositories) => Promise<T>): Promise<T> {
    return this.prisma.$transaction((transactionClient) =>
      work(this.repositoryFactory(transactionClient)),
    );
  }
}
