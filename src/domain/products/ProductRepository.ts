import { Id } from '../generic/Base';
import { Product } from './Product';

export interface ProductRepository {
  getById(id: Id): Promise<Product>;
  save(product: Product): Promise<void>;
}
