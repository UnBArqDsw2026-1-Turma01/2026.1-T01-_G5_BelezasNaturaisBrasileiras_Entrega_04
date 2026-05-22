import { TrilhaEventEmitter } from './domain/observers/TrilhaEventEmitter';
import { BadgeDistribuicaoObserver } from './domain/observers/BadgeDistribuicaoObserver';
import { NotificacaoObserver } from './domain/observers/NotificacaoObserver';
import { ITrilhaObserver } from './domain/interfaces/ITrilhaObserver';
import { IBadgeRepository } from './domain/interfaces/IBadgeRepository';
import { LoggerNotificationChannel } from './domain/notifications/LoggerNotificationChannel';

const makeBadgeRepository = (): jest.Mocked<IBadgeRepository> =>
  ({
    create: jest.fn((participanteId: string, trilhaId: string) =>
      Promise.resolve({
        id: `badge-${participanteId}`,
        participanteId,
        trilhaId,
        conquistadoEm: new Date('2026-05-19'),
      }),
    ),
    findByParticipanteId: jest.fn(),
  }) as jest.Mocked<IBadgeRepository>;

const makeNotificationChannel = (): jest.Mocked<LoggerNotificationChannel> =>
  ({
    send: jest.fn(),
  }) as unknown as jest.Mocked<LoggerNotificationChannel>;

describe('Observer - TrilhaEventEmitter', () => {
  let emitter: TrilhaEventEmitter;

  beforeEach(() => {
    emitter = new TrilhaEventEmitter();
  });

  describe('subscribe()', () => {
    it('deve registrar um observador', () => {
      const observer = new BadgeDistribuicaoObserver(makeBadgeRepository());
      emitter.subscribe(observer);

      expect(emitter.totalObservadores).toBe(1);
    });

    it('nao deve registrar o mesmo observador duas vezes', () => {
      const observer = new BadgeDistribuicaoObserver(makeBadgeRepository());
      emitter.subscribe(observer);
      emitter.subscribe(observer);

      expect(emitter.totalObservadores).toBe(1);
    });
  });

  describe('unsubscribe()', () => {
    it('deve remover um observador registrado', () => {
      const observer = new BadgeDistribuicaoObserver(makeBadgeRepository());
      emitter.subscribe(observer);
      emitter.unsubscribe(observer);

      expect(emitter.totalObservadores).toBe(0);
    });
  });

  describe('notificarFinalizacao()', () => {
    it('deve chamar onTrilhaFinalizada em todos os observadores', async () => {
      const fn1 = jest.fn();
      const fn2 = jest.fn();
      const observer1: ITrilhaObserver = { onTrilhaFinalizada: fn1 };
      const observer2: ITrilhaObserver = { onTrilhaFinalizada: fn2 };

      emitter.subscribe(observer1);
      emitter.subscribe(observer2);

      await emitter.notificarFinalizacao('trilha-123', ['user-1', 'user-2']);

      expect(fn1).toHaveBeenCalledWith('trilha-123', ['user-1', 'user-2']);
      expect(fn2).toHaveBeenCalledWith('trilha-123', ['user-1', 'user-2']);
    });

    it('nao deve chamar observadores removidos', async () => {
      const fn = jest.fn();
      const observer: ITrilhaObserver = { onTrilhaFinalizada: fn };
      emitter.subscribe(observer);
      emitter.unsubscribe(observer);

      await emitter.notificarFinalizacao('trilha-456', ['user-3']);

      expect(fn).not.toHaveBeenCalled();
    });

    it('deve notificar com lista vazia quando nenhum participante e valido', async () => {
      const fn = jest.fn();
      const observer: ITrilhaObserver = { onTrilhaFinalizada: fn };
      emitter.subscribe(observer);

      await emitter.notificarFinalizacao('trilha-789', []);

      expect(fn).toHaveBeenCalledWith('trilha-789', []);
    });
  });

  describe('BadgeDistribuicaoObserver', () => {
    it('deve instanciar sem erros', async () => {
      const observer = new BadgeDistribuicaoObserver(makeBadgeRepository());
      await expect(
        observer.onTrilhaFinalizada('trilha-1', ['user-a', 'user-b']),
      ).resolves.toBeUndefined();
    });
  });

  describe('NotificacaoObserver', () => {
    it('deve enviar notificacao pelo canal configurado', async () => {
      const channel = makeNotificationChannel();
      const observer = new NotificacaoObserver(channel);

      await observer.onTrilhaFinalizada('trilha-1', ['user-a']);

      expect(channel.send).toHaveBeenCalledWith(
        'user-a',
        'Trilha trilha-1 finalizada. Badge disponivel no seu perfil!',
      );
    });
  });
});
