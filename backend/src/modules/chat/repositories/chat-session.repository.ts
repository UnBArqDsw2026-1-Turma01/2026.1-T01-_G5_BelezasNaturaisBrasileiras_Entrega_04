import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class ChatSessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreate(data: { userAId: string; userBId: string }) {
    const existing = await this.prisma.chatSession.findFirst({
      where: {
        OR: [
          { userAId: data.userAId, userBId: data.userBId },
          { userAId: data.userBId, userBId: data.userAId },
        ],
        endedAt: null,
      },
    });
    if (existing) return existing;
    return this.prisma.chatSession.create({ data });
  }

  async endSession(id: string) {
    return this.prisma.chatSession.update({ where: { id }, data: { endedAt: new Date() } });
  }
}
