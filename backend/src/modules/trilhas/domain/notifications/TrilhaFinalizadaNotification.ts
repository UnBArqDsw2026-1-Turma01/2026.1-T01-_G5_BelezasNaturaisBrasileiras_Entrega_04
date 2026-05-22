import { INotificationChannel } from './INotificationChannel';
import { TrilhaNotification } from './TrilhaNotification';

export class TrilhaFinalizadaNotification extends TrilhaNotification {
  constructor(
    channel: INotificationChannel,
    private readonly trilhaId: string,
  ) {
    super(channel);
  }

  async notify(participanteIds: string[]): Promise<void> {
    const mensagem = `Trilha ${this.trilhaId} finalizada. Badge disponivel no seu perfil!`;

    await Promise.all(
      participanteIds.map((participanteId) =>
        this.channel.send(participanteId, mensagem),
      ),
    );
  }
}
