import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { IInscricaoRepository } from '../../domain/interfaces/IInscricaoRepository';
import { Inscricao } from '../../domain/entities/Inscricao';
import { InscricaoMapper } from '../mappers/InscricaoMapper';
import { InscricaoStatus } from '../../domain/enums/InscricaoStatus';

@Injectable()
export class PrismaInscricaoRepository implements IInscricaoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(inscricao: Inscricao): Promise<Inscricao> {
    const raw = await this.prisma.inscricao.create({
      data: InscricaoMapper.toPersistence(inscricao),
    });
    return InscricaoMapper.toDomain(raw);
  }

  async findById(id: string): Promise<Inscricao | null> {
    const raw = await this.prisma.inscricao.findUnique({ where: { id } });
    return raw ? InscricaoMapper.toDomain(raw) : null;
  }

  async findByTrilhaId(trilhaId: string): Promise<Inscricao[]> {
    const raws = await this.prisma.inscricao.findMany({
      where: { trilhaId },
      include: { usuario: { select: { nome: true } } },
    });
    return raws.map((r) => InscricaoMapper.toDomain(r));
  }

  async findByUsuarioId(usuarioId: string): Promise<Inscricao[]> {
    const raws = await this.prisma.inscricao.findMany({ where: { usuarioId } });
    return raws.map((r) => InscricaoMapper.toDomain(r));
  }

  async findByTrilhaAndUsuario(
    trilhaId: string,
    usuarioId: string,
  ): Promise<Inscricao | null> {
    const raw = await this.prisma.inscricao.findUnique({
      where: { trilhaId_usuarioId: { trilhaId, usuarioId } },
    });
    return raw ? InscricaoMapper.toDomain(raw) : null;
  }

  async findPresentesByTrilhaId(trilhaId: string): Promise<Inscricao[]> {
    const raws = await this.prisma.inscricao.findMany({
      where: { trilhaId, status: InscricaoStatus.PRESENTE },
    });
    return raws.map((r) => InscricaoMapper.toDomain(r));
  }

  async save(inscricao: Inscricao): Promise<Inscricao> {
    const raw = await this.prisma.inscricao.update({
      where: { id: inscricao.id },
      data: InscricaoMapper.toPersistence(inscricao),
    });
    return InscricaoMapper.toDomain(raw);
  }
}
