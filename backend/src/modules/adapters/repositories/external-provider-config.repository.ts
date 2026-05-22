import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class ExternalProviderConfigRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findActive(providerKey: string) {
    return this.prisma.externalProvider.findFirst({ where: { key: providerKey, active: true } });
  }
}
