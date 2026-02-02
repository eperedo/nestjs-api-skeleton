import { Id } from 'src/shared/domain/Base';
import { Customer } from '../entities/Customer';

export interface CustomerRepository {
  getById(id: Id): Promise<Customer>;
}
