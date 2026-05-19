import { ForbiddenException } from '@nestjs/common';
import { ITrilhaRepository } from '../../domain/interfaces/ITrilhaRepository';
import { Trilha } from '../../domain/entities/Trilha';
import { TrilhaRequestContext } from '../../domain/services/TrilhaRequestContext';

export class TrilhaProxyRepository implements ITrilhaRepository {
  constructor(
    private readonly wrapped: ITrilhaRepository,
    private readonly context: TrilhaRequestContext,
  ) {}

  async save(trilha: Trilha): Promise<Trilha> {
    const requesterId = this.context.getRequesterId();
    if (!requesterId || requesterId !== trilha.organizadorId) {
      throw new ForbiddenException(
        'Apenas o organizador pode modificar a trilha',
      );
    }
    return this.wrapped.save(trilha);
  }

  create(trilha: Trilha): Promise<Trilha> {
    return this.wrapped.create(trilha);
  }

  findById(id: string): Promise<Trilha | null> {
    return this.wrapped.findById(id);
  }

  findAll(): Promise<Trilha[]> {
    return this.wrapped.findAll();
  }
}
