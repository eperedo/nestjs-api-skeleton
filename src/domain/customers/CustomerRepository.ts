import { Id } from '../generic/Base';
import { Customer } from './Customer';

export interface CustomerRepository {
  getById(id: Id): Promise<Customer>;
}
