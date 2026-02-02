import { User } from 'src/users/domain/entities/User';
import { UserRepository } from 'src/users/domain/repositories/UserRepository';
import { Id } from 'src/shared/domain/Base';
import { PrismaClient } from 'src/generated/prisma/client';

export class UserPrismaRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async getById(id: Id): Promise<User> {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) throw new Error('User not found');
    const buildResult = User.build({
      id: user.id,
      username: user.username,
      role: user.role === 'admin' ? 'admin' : 'guest',
    });
    if (!buildResult.isSuccess()) {
      throw new Error('Invalid user data');
    }
    return buildResult.value.data;
  }
}
