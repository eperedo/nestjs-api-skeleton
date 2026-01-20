import { Sale } from './Sale';

export interface SaleRepository {
  save(sale: Sale): Promise<Sale>;
}
