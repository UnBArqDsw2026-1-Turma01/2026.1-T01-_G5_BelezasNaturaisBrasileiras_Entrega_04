import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { SecretsClient } from '../../../shared/infrastructure/secrets/secrets.client';

@Injectable()
export class ExternalProviderConfigRepository {
  constructor(private readonly prisma: PrismaService, private readonly secrets: SecretsClient) {}

  async findActive(providerKey: string) {
    const row = await this.prisma.externalProvider.findFirst({ where: { key: providerKey, active: true } });
    if (!row) return null;
    // return metadata (as-is) and attach secret fetched from SecretsClient (do not expose DB-stored secrets)
    const metadata = row.config as any;
    const secret = this.secrets.getSecret(providerKey);
    return { id: row.id, key: row.key, provider: row.provider, metadata, secret, active: row.active, createdAt: row.createdAt };
  }
}
