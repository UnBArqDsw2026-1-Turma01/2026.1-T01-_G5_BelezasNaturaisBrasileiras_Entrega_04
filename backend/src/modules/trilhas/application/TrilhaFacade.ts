import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CriarTrilhaUseCase } from './use-cases/CriarTrilhaUseCase';
import { ListarTrilhasUseCase } from './use-cases/ListarTrilhasUseCase';
import { FinalizarTrilhaUseCase } from './use-cases/FinalizarTrilhaUseCase';
import { RestaurarTrilhaUseCase } from './use-cases/RestaurarTrilhaUseCase';
import { EditarTrilhaUseCase } from './use-cases/EditarTrilhaUseCase';
import { Trilha } from '../domain/entities/Trilha';
import { ITrilhaRepository } from '../domain/interfaces/ITrilhaRepository';
import { CriarTrilhaInput } from './dtos/CriarTrilhaInput';
import { EditarTrilhaInput } from './dtos/EditarTrilhaInput';
import { ListarTrilhasInput } from './dtos/ListarTrilhasInput';

@Injectable()
export class TrilhaFacade {
  constructor(
    private readonly criarUC: CriarTrilhaUseCase,
    private readonly listarUC: ListarTrilhasUseCase,
    private readonly finalizarUC: FinalizarTrilhaUseCase,
    private readonly restaurarUC: RestaurarTrilhaUseCase,
    private readonly editarUC: EditarTrilhaUseCase,
    @Inject('ITrilhaRepository') private readonly repository: ITrilhaRepository,
  ) {}

  criar(organizadorId: string, input: CriarTrilhaInput): Promise<Trilha> {
    return this.criarUC.execute(organizadorId, input);
  }

  listar(input?: ListarTrilhasInput): Promise<Trilha[]> {
    return this.listarUC.execute(input);
  }

  finalizar(trilhaId: string, organizadorId: string): Promise<void> {
    return this.finalizarUC.execute(trilhaId, organizadorId);
  }

  restaurar(trilhaId: string, organizadorId: string): Promise<Trilha> {
    return this.restaurarUC.execute(trilhaId, organizadorId);
  }

  editar(
    trilhaId: string,
    organizadorId: string,
    input: EditarTrilhaInput,
  ): Promise<Trilha> {
    return this.editarUC.execute(trilhaId, organizadorId, input);
  }

  async buscarPorId(id: string): Promise<Trilha> {
    const trilha = await this.repository.findById(id);
    if (!trilha) throw new NotFoundException(`Trilha ${id} não encontrada.`);
    return trilha;
  }
}
