import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ITrilhaRepository } from '../../domain/interfaces/ITrilhaRepository';
import { IInscricaoRepository } from '../../../inscricoes/domain/interfaces/IInscricaoRepository';
import { IInscricaoVisitor } from '../../../inscricoes/domain/interfaces/IInscricaoVisitor';
import { TrilhaCaretaker } from '../../domain/memento/TrilhaCaretaker';
import { ITrailLifecycleMediator } from '../../../pontos-turisticos/mediator/interfaces/trail-lifecycle-mediator.interface';

@Injectable()
export class FinalizarTrilhaUseCase {
  constructor(
    @Inject('ITrilhaRepository')
    private readonly trilhaRepository: ITrilhaRepository,
    @Inject('IInscricaoRepository')
    private readonly inscricaoRepository: IInscricaoRepository,
    private readonly caretaker: TrilhaCaretaker,
    @Inject('ITrailLifecycleMediator')
    private readonly mediator: ITrailLifecycleMediator,
    @Inject('IInscricaoVisitors')
    private readonly visitors: IInscricaoVisitor[],
  ) {}

  async execute(trilhaId: string, organizadorId: string): Promise<void> {
    const trilha = await this.trilhaRepository.findById(trilhaId);
    if (!trilha) throw new NotFoundException('Trilha não encontrada');

    // Salvar estado anterior antes de finalizar (Memento pattern)
    this.caretaker.save(trilhaId, trilha.saveState());

    // Autorização verificada pelo TrilhaProxyRepository (Protection Proxy)
    trilha.finalizar();
    await this.trilhaRepository.save(trilha);

    // Orquestrar eventos de ciclo de vida via Mediator
    await this.mediator.finishTrail(trilhaId, organizadorId);

    // Visitor Pattern — aplica cada visitor sobre todas as inscrições da trilha.
    // Cada visitor decide o que fazer com base no status de cada Inscricao
    // (visitPresente, visitAceita, visitRejeitada, visitPendente).
    const inscricoes = await this.inscricaoRepository.findByTrilhaId(trilhaId);
    for (const visitor of this.visitors) {
      for (const inscricao of inscricoes) {
        await inscricao.accept(visitor);
      }
    }
  }
}
