import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  async getHello(): Promise<string> {
    const user = await this.prisma.user.findFirst({
      where: { id: '1' },
    });

    return user?.username ?? 'Hello World!';
  }
}
