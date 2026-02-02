import { Id } from 'src/shared/domain/Base';
import { Category } from '../entities/Category';

export interface CategoryRepository {
  getById(id: Id): Promise<Category>;
}
