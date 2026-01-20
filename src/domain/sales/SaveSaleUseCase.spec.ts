import { Customer } from '../customers/Customer';
import { CustomerRepository } from '../customers/CustomerRepository';
import { SaleRepository } from './SaleRepository';
import { SaveSaleUseCase } from './SaveSaleUseCase';
import { Sale, SaleAttrs } from './Sale';

describe('SaveSaleUseCase', () => {
  const baseSale: SaleAttrs = {
    id: 'sale-1',
    customerId: 'customer-1',
    discount: 5,
    total: 0,
    items: [
      {
        productId: 'product-1',
        quantity: 2,
        price: 10,
        subtotal: 0,
      },
    ],
  };

  const activeBasic = Customer.create({
    id: 'customer-1',
    name: 'Basic',
    isActive: true,
    type: 'basic',
  });

  const activePremium = Customer.create({
    id: 'customer-2',
    name: 'Premium',
    isActive: true,
    type: 'premium',
  });

  const inactiveCustomer = Customer.create({
    id: 'customer-3',
    name: 'Inactive',
    isActive: false,
    type: 'basic',
  });

  const saleRepository: SaleRepository = {
    save: (sale: Sale) => Promise.resolve(sale),
  };

  it('throws when customer is inactive', async () => {
    const customerRepository: CustomerRepository = {
      getById: () => Promise.resolve(inactiveCustomer),
    };

    const useCase = new SaveSaleUseCase({
      saleRepository,
      customerRepository,
    });

    await expect(useCase.execute(baseSale)).rejects.toThrow(
      'CUSTOMER_INACTIVE',
    );
  });

  it('applies premium discount automatically', async () => {
    const customerRepository: CustomerRepository = {
      getById: () => Promise.resolve(activePremium),
    };

    const useCase = new SaveSaleUseCase({
      saleRepository,
      customerRepository,
    });

    const result = await useCase.execute({
      ...baseSale,
      customerId: activePremium.id,
    });

    expect(result.discount).toBe(10);
    expect(result.total).toBe(10);
  });

  it('uses provided discount for basic customers', async () => {
    const customerRepository: CustomerRepository = {
      getById: () => Promise.resolve(activeBasic),
    };

    const useCase = new SaveSaleUseCase({
      saleRepository,
      customerRepository,
    });

    const result = await useCase.execute({
      ...baseSale,
      discount: 3,
    });

    expect(result.discount).toBe(3);
    expect(result.total).toBe(17);
  });

  it('throws when sale validation fails', async () => {
    const customerRepository: CustomerRepository = {
      getById: () => Promise.resolve(activeBasic),
    };

    const useCase = new SaveSaleUseCase({
      saleRepository,
      customerRepository,
    });

    await expect(
      useCase.execute({
        ...baseSale,
        items: [{ ...baseSale.items[0], quantity: 0 }],
      }),
    ).rejects.toThrow('SALE_VALIDATION_FAILED');
  });
});
