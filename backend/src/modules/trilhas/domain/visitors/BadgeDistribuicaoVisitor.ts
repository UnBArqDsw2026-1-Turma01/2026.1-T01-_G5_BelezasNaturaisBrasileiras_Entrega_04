import { Injectable, Inject, Logger } from '@nestjs/common';
import { IInscricaoVisitor } from '../../../inscricoes/domain/interfaces/IInscricaoVisitor';
import { Inscricao } from '../../../inscricoes/domain/entities/Inscricao';
import { IBadgeRepository } from '../interfaces/IBadgeRepository';

/**
 * Visitor Pattern — Visitante Concreto: distribuição de badges
 *
 * Opera sobre inscrições com status PRESENTE distribuindo badges.
 * Inscrições em outros estados são ignoradas (no-op), sem que a
 * classe Inscricao precise saber dessa lógica.
 */
@Injectable()
export class BadgeDistribuicaoVisitor implements IInscricaoVisitor {
  private readonly logger = new Logger(BadgeDistribuicaoVisitor.name);

  constructor(
    @Inject('IBadgeRepository')
    private readonly badgeRepository: IBadgeRepository,
  ) {}

  async visitPresente(inscricao: Inscricao): Promise<void> {
    const badge = await this.badgeRepository.create(
      inscricao.usuarioId,
      inscricao.trilhaId,
    );
    this.logger.log(
      `Badge distribuído: participante=${inscricao.usuarioId} trilha=${inscricao.trilhaId} conquistadoEm=${badge.conquistadoEm.toISOString()}`,
    );
  }

  async visitAceita(_inscricao: Inscricao): Promise<void> {}
  async visitRejeitada(_inscricao: Inscricao): Promise<void> {}
  async visitPendente(_inscricao: Inscricao): Promise<void> {}
}
