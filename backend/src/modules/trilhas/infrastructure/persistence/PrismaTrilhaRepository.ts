import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { ITrilhaRepository } from '../../domain/interfaces/ITrilhaRepository';
import { Trilha } from '../../domain/entities/Trilha';
import { TrilhaMapper } from '../mappers/TrilhaMapper';

@Injectable()
export class PrismaTrilhaRepository implements ITrilhaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(trilha: Trilha): Promise<Trilha> {
    const raw = await this.prisma.trilha.create({
      data: TrilhaMapper.toPersistence(trilha),
    });
    return TrilhaMapper.toDomain(raw);
  }

  async findById(id: string): Promise<Trilha | null> {
    const raw = await this.prisma.trilha.findUnique({ where: { id } });
    return raw ? TrilhaMapper.toDomain(raw) : null;
  }

  async findAll(): Promise<Trilha[]> {
    const raws = await this.prisma.trilha.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return raws.map((r) => TrilhaMapper.toDomain(r));
  }

  async save(trilha: Trilha): Promise<Trilha> {
    const { id, createdAt, organizadorId, ...data } = TrilhaMapper.toPersistence(trilha);
    const raw = await this.prisma.trilha.update({
      where: { id: trilha.id },
      data,
    });
    return TrilhaMapper.toDomain(raw);
  }
}
