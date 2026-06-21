import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class ChatActivityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async logActivity(chatSessionId: string, payload: any) {
    const raw = await this.prisma.chatActivity.create({ data: { chatSessionId, payload } });
    const { ChatActivityMapper } = require('../mappers/ChatActivityMapper');
    return ChatActivityMapper.toDomain(raw);
  }

  async findBySessionId(chatSessionId: string) {
    const raws = await this.prisma.chatActivity.findMany({
      where: { chatSessionId },
      orderBy: { createdAt: 'asc' },
    });
    const { ChatActivityMapper } = require('../mappers/ChatActivityMapper');
    return raws.map((r: any) => ChatActivityMapper.toDomain(r));
  }
}
