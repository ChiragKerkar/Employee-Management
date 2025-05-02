import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient
implements OnModuleInit, OnModuleDestroy {
// This is for Prisma client connection handling during the application lifecycle
async onModuleInit() {
  await this.$connect();
}

async onModuleDestroy() {
  await this.$disconnect();
}
}
