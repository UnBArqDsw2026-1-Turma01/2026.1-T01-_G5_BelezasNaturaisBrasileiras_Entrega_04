import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class ChatActivityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async logActivity(chatSessionId: string, payload: any) {
    return this.prisma.chatActivity.create({ data: { chatSessionId, payload } });
  }

  async findBySessionId(chatSessionId: string) {
    return this.prisma.chatActivity.findMany({
      where: { chatSessionId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
