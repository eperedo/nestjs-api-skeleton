import { Customer } from 'src/customers/domain/entities/Customer';
import { CustomerRepository } from 'src/customers/domain/repositories/CustomerRepository';
import { PrismaClient } from 'src/generated/prisma/client';

export class CustomerPrismaRepository implements CustomerRepository {
  constructor(private prisma: PrismaClient) {}

  async getById(id: string): Promise<Customer> {
    const customer = await this.prisma.customer.findFirst({ where: { id } });
    if (!customer) throw new Error('Customer not found');
    return Customer.build({
      id: customer.id,
      name: customer.name,
      isActive: customer.isActive,
      type: customer.type === 'premium' ? 'premium' : 'basic',
    }).get();
  }
}
