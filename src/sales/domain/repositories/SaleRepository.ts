import { Sale } from '../entities/Sale';

export interface SaleRepository {
  save(sale: Sale): Promise<Sale>;
}
