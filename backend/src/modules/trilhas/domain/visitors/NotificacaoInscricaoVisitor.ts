import { Injectable } from '@nestjs/common';
import { IInscricaoVisitor } from '../../../inscricoes/domain/interfaces/IInscricaoVisitor';
import { Inscricao } from '../../../inscricoes/domain/entities/Inscricao';
import { LoggerNotificationChannel } from '../notifications/LoggerNotificationChannel';

/**
 * Visitor Pattern — Visitante Concreto: notificações de finalização
 *
 * Envia notificação apenas para participantes PRESENTE. Inscrições
 * em outros estados poderiam receber mensagens distintas no futuro
 * sem qualquer alteração na classe Inscricao.
 */
@Injectable()
export class NotificacaoInscricaoVisitor implements IInscricaoVisitor {
  constructor(private readonly channel: LoggerNotificationChannel) {}

  async visitPresente(inscricao: Inscricao): Promise<void> {
    const mensagem = `Trilha ${inscricao.trilhaId} finalizada. Badge disponível no seu perfil!`;
    this.channel.send(inscricao.usuarioId, mensagem);
  }

  async visitAceita(_inscricao: Inscricao): Promise<void> {}
  async visitRejeitada(_inscricao: Inscricao): Promise<void> {}
  async visitPendente(_inscricao: Inscricao): Promise<void> {}
}
