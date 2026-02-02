import { ErrorCodes } from '../generic/ErrorCodes';
import { Sale, SaleAttrs } from './Sale';
import { SaleRepository } from './SaleRepository';
import { CustomerRepository } from '../customers/CustomerRepository';
import { Transaction } from '../transactions/Transaction';
import { TransactionRepository } from '../transactions/TransactionRepository';
import { UnitOfWork } from '../generic/UnitOfWork';

export class SaveSaleUseCase {
  constructor(
    private options: {
      unitOfWork: UnitOfWork<SalesRepositories>;
      customerRepository: CustomerRepository;
    },
  ) {}

  async execute(payload: SaveSalePayload): Promise<Sale> {
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

    const sale = saleResult.value.data;
    const transactionResult = Transaction.build({
      id: payload.transactionId,
      amount: sale.total,
      saleId: sale.id,
    });

    if (!transactionResult.isSuccess()) {
      throw new Error(ErrorCodes.sales.TRANSACTION_VALIDATION_FAILED);
    }

    return this.options.unitOfWork.run(
      ({ saleRepository, transactionRepository }) =>
        saleRepository
          .save(sale)
          .then((savedSale) =>
            transactionRepository
              .save(transactionResult.value.data)
              .then(() => savedSale),
          ),
    );
  }
}

export type SalesRepositories = {
  saleRepository: SaleRepository;
  transactionRepository: TransactionRepository;
};

export type SaveSalePayload = SaleAttrs & { transactionId: string };
