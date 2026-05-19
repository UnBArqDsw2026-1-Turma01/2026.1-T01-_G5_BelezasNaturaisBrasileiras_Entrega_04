import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITrilhaRepository } from '../../domain/interfaces/ITrilhaRepository';
import { IInscricaoRepository } from '../../../inscricoes/domain/interfaces/IInscricaoRepository';
import { TrilhaEventEmitter } from '../../domain/observers/TrilhaEventEmitter';

@Injectable()
export class FinalizarTrilhaUseCase {
  constructor(
    @Inject('ITrilhaRepository')
    private readonly trilhaRepository: ITrilhaRepository,
    @Inject('IInscricaoRepository')
    private readonly inscricaoRepository: IInscricaoRepository,
    private readonly trilhaEventEmitter: TrilhaEventEmitter,
  ) {}

  async execute(trilhaId: string, organizadorId: string): Promise<void> {
    const trilha = await this.trilhaRepository.findById(trilhaId);
    if (!trilha) throw new NotFoundException('Trilha não encontrada');

    // Autorização verificada pelo TrilhaProxyRepository (Protection Proxy)
    trilha.finalizar();
    await this.trilhaRepository.save(trilha);

    const presentes =
      await this.inscricaoRepository.findPresentesByTrilhaId(trilhaId);
    const participanteIds = presentes.map((i) => i.usuarioId);

    await this.trilhaEventEmitter.notificarFinalizacao(trilhaId, participanteIds);
  }
}
