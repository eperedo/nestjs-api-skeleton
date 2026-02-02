import { Id } from 'src/shared/domain/Base';
import { Product } from '../entities/Product';

export interface ProductRepository {
  getById(id: Id): Promise<Product>;
  save(product: Product): Promise<void>;
}
