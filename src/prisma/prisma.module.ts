import { Module } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { prisma } from '../prisma-client';

@Module({
  providers: [{ provide: PrismaClient, useValue: prisma }],
  exports: [PrismaClient],
})
export class PrismaModule {}
