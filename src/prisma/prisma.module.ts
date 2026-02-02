import { Module } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [
    PrismaService,
    { provide: PrismaClient, useExisting: PrismaService },
  ],
  exports: [PrismaClient, PrismaService],
})
export class PrismaModule {}
