import { Id } from 'src/shared/domain/Base';
import { User } from '../entities/User';

export interface UserRepository {
  getById(id: Id): Promise<User>;
}
