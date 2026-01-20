import { Id } from '../generic/Base';
import { User } from './User';

export interface UserRepository {
  getById(id: Id): Promise<User>;
}
