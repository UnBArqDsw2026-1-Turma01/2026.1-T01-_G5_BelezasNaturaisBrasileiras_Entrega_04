import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class NotificationLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async log(entry: { to: string; provider: string; status: string; externalId?: string; payload?: any }) {
    return this.prisma.notificationLog.create({ data: { ...entry, payload: JSON.stringify(entry.payload || {}) } });
  }
}
