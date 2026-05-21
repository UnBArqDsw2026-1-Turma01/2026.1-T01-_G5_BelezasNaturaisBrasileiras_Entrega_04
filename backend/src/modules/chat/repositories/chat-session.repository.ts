import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class ChatSessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  private async enrichWithNames(session: {
    userAId: string;
    userBId: string;
    [key: string]: unknown;
  }) {
    const [userA, userB] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: session.userAId },
        select: { nome: true },
      }),
      this.prisma.user.findUnique({
        where: { id: session.userBId },
        select: { nome: true },
      }),
    ]);
    return {
      ...session,
      usuarioANome: userA?.nome ?? null,
      usuarioBNome: userB?.nome ?? null,
    };
  }

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
    const session =
      existing ?? (await this.prisma.chatSession.create({ data }));
    return this.enrichWithNames(session);
  }

  async endSession(id: string) {
    return this.prisma.chatSession.update({
      where: { id },
      data: { endedAt: new Date() },
    });
  }
}
