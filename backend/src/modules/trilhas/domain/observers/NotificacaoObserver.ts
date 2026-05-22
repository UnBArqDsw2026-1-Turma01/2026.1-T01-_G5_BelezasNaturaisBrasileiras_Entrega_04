import { Injectable } from '@nestjs/common';
import { ITrilhaObserver } from '../interfaces/ITrilhaObserver';
import { LoggerNotificationChannel } from '../notifications/LoggerNotificationChannel';
import { TrilhaFinalizadaNotification } from '../notifications/TrilhaFinalizadaNotification';

@Injectable()
export class NotificacaoObserver implements ITrilhaObserver {
  constructor(private readonly channel: LoggerNotificationChannel) {}

  async onTrilhaFinalizada(
    trilhaId: string,
    participanteIds: string[],
  ): Promise<void> {
    const notificacao = new TrilhaFinalizadaNotification(
      this.channel,
      trilhaId,
    );

    await notificacao.notify(participanteIds);
  }
}
