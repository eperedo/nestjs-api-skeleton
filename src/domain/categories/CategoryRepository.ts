import { Id } from '../generic/Base';
import { Category } from './Category';

export interface CategoryRepository {
  getById(id: Id): Promise<Category>;
}
