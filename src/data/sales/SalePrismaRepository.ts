import { Sale } from 'src/domain/sales/Sale';
import { SaleRepository } from 'src/domain/sales/SaleRepository';
import { PrismaClient, Prisma } from 'src/generated/prisma/client';

type PrismaClientLike = PrismaClient | Prisma.TransactionClient;
export class SalePrismaRepository implements SaleRepository {
  constructor(private prisma: PrismaClientLike) {}

  async save(sale: Sale): Promise<Sale> {
    await this.prisma.sale.create({
      data: {
        id: sale.id,
        customerId: sale.customerId,
        discount: sale.discount,
        total: sale.total,
        items: {
          create: sale.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
          })),
        },
      },
    });

    return sale;
  }
}
