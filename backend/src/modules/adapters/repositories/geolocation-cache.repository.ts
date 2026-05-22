import { Injectable } from '@nestjs/common';
// This repository should use Redis in real implementation. Placeholder uses Prisma.
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class GeolocationCacheRepository {
  constructor(private readonly prisma: PrismaService) {}

  async get(key: string) {
    // placeholder
    return null;
  }

  async set(key: string, value: any, ttlSeconds?: number) {
    // placeholder
    return true;
  }
}
