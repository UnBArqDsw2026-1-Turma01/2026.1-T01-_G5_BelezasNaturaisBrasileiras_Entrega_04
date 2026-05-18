import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaPontosRepository {
  private readonly logger = new Logger('PrismaPontosRepository');
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(filtros: Record<string, any>) {
    if (!filtros || Object.keys(filtros).length === 0) return undefined;
    const where: any = {};
    Object.entries(filtros).forEach(([k, v]) => {
      where[k] = { equals: v };
    });
    return where;
  }

  async buscarFeed(filtros: Record<string, any>): Promise<any[]> {
    try {
      // Use dynamic access to avoid TypeScript errors if model not generated
      const client: any = (this.prisma as any).ponto;
      if (!client) throw new Error('Prisma model `ponto` não disponível');

      const where = this.buildWhere(filtros);
      return await client.findMany({ where });
    } catch (error) {
      this.logger.error('Error accessing Prisma ponto model, falling back', error as any);
      throw error;
    }
  }

  async criar(dados: any, usuarioId: string): Promise<any> {
    try {
      const client: any = (this.prisma as any).ponto;
      if (!client) throw new Error('Prisma model `ponto` não disponível');

      const data = { ...dados, criadoPor: usuarioId };
      return await client.create({ data });
    } catch (error) {
      this.logger.error('Error creating ponto via Prisma', error as any);
      throw error;
    }
  }

  async editar(id: string, dados: any, usuarioId: string): Promise<any> {
    try {
      const client: any = (this.prisma as any).ponto;
      if (!client) throw new Error('Prisma model `ponto` não disponível');

      const data = { ...dados, updatedBy: usuarioId };
      return await client.update({ where: { id }, data });
    } catch (error) {
      this.logger.error('Error updating ponto via Prisma', error as any);
      throw error;
    }
  }

  async deletar(id: string, usuarioId: string): Promise<void> {
    try {
      const client: any = (this.prisma as any).ponto;
      if (!client) throw new Error('Prisma model `ponto` não disponível');

      await client.delete({ where: { id } });
    } catch (error) {
      this.logger.error('Error deleting ponto via Prisma', error as any);
      throw error;
    }
  }
}
