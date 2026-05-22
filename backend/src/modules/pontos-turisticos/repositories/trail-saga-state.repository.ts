import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class TrailSagaStateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createState(data: any) {
    return this.prisma.trailSagaState.create({ data });
  }

  async updateState(id: string, patch: any) {
    return this.prisma.trailSagaState.update({ where: { id }, data: patch });
  }
}
