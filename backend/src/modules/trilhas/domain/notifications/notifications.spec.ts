import { INotificationChannel } from './INotificationChannel';
import { TrilhaFinalizadaNotification } from './TrilhaFinalizadaNotification';

describe('Bridge de notificacoes', () => {
  it('deve enviar notificacao de trilha finalizada pelo canal configurado', async () => {
    const channel: jest.Mocked<INotificationChannel> = {
      send: jest.fn(),
    };

    const notification = new TrilhaFinalizadaNotification(channel, 'trilha-1');

    await notification.notify(['user-1', 'user-2']);

    expect(channel.send).toHaveBeenCalledWith(
      'user-1',
      'Trilha trilha-1 finalizada. Badge disponivel no seu perfil!',
    );
    expect(channel.send).toHaveBeenCalledWith(
      'user-2',
      'Trilha trilha-1 finalizada. Badge disponivel no seu perfil!',
    );
  });
});
