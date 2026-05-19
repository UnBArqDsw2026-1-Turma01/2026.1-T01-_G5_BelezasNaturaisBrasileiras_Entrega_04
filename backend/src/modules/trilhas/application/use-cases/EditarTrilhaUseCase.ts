import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ITrilhaRepository } from '../../domain/interfaces/ITrilhaRepository';
import { EditarTrilhaCommand } from '../../domain/commands/EditarTrilhaCommand';
import { TrilhaCaretaker } from '../../domain/memento/TrilhaCaretaker';
import { Trilha } from '../../domain/entities/Trilha';
import { EditarTrilhaInput } from '../dtos/EditarTrilhaInput';

@Injectable()
export class EditarTrilhaUseCase {
  constructor(
    @Inject('ITrilhaRepository')
    private readonly trilhaRepository: ITrilhaRepository,
    private readonly caretaker: TrilhaCaretaker,
  ) {}

  async execute(trilhaId: string, organizadorId: string, input: EditarTrilhaInput): Promise<Trilha> {
    const trilha = await this.trilhaRepository.findById(trilhaId);
    if (!trilha) throw new NotFoundException('Trilha não encontrada');

    if (trilha.organizadorId !== organizadorId) {
      throw new ForbiddenException('Apenas o organizador pode editar a trilha');
    }

    this.caretaker.save(trilhaId, trilha.saveState());

    const cmd = new EditarTrilhaCommand(trilha, {
      titulo: input.titulo,
      descricao: input.descricao,
      pontoEncontro: input.pontoEncontro,
      dataInicio: input.dataInicio ? new Date(input.dataInicio) : undefined,
      vagasMaximas: input.vagasMaximas,
    });
    cmd.execute();

    return this.trilhaRepository.save(trilha);
  }
}
