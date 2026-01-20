import { ErrorCodes } from '../generic/ErrorCodes';
import { Sale, SaleAttrs } from './Sale';
import { SaleRepository } from './SaleRepository';
import { CustomerRepository } from '../customers/CustomerRepository';

export class SaveSaleUseCase {
  constructor(
    private options: {
      saleRepository: SaleRepository;
      customerRepository: CustomerRepository;
    },
  ) {}

  async execute(payload: SaleAttrs): Promise<Sale> {
    const customer = await this.options.customerRepository.getById(
      payload.customerId,
    );

    if (!customer.isActive) {
      throw new Error(ErrorCodes.sales.CUSTOMER_INACTIVE);
    }

    const baseSubtotal = payload.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );

    const discount =
      customer.type === 'premium' ? baseSubtotal * 0.5 : payload.discount;

    const saleResult = Sale.build({
      ...payload,
      discount,
      total: baseSubtotal - discount,
      items: payload.items.map((item) => ({
        ...item,
        subtotal: item.quantity * item.price,
      })),
    });

    if (!saleResult.isSuccess()) {
      throw new Error(ErrorCodes.sales.VALIDATION_FAILED);
    }

    return this.options.saleRepository.save(saleResult.value.data);
  }
}
