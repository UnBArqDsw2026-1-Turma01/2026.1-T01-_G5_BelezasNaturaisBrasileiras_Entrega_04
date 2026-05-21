import { TrailLifecycleMediatorService } from './trail-lifecycle-mediator.service';
import { TrailLifecycleRepository } from '../repositories/trail-lifecycle.repository';
import { ILifecycleHandler } from './interfaces/lifecycle-handler.interface';

const makeRepo = (): jest.Mocked<TrailLifecycleRepository> =>
  ({
    createEvent: jest.fn().mockResolvedValue(undefined),
    updateEventStatus: jest.fn().mockResolvedValue(undefined),
  }) as any;

const makeHandler = (
  name: string,
  impl?: () => Promise<void>,
): ILifecycleHandler => ({
  handle: jest.fn(impl ?? (() => Promise.resolve())),
});

const makeMediator = (
  repo: TrailLifecycleRepository,
  handlers: ILifecycleHandler[] = [],
): TrailLifecycleMediatorService => {
  const service = new TrailLifecycleMediatorService(
    repo,
    handlers[0] as any,
    handlers[1] as any,
    handlers[2] as any,
    handlers[3] as any,
  );
  // Register only the provided handlers (skip onModuleInit which uses injected ones)
  (service as any).handlers = handlers.map((h, i) => ({
    name: `handler-${i}`,
    handler: h,
  }));
  return service;
};

describe('TrailLifecycleMediatorService — Mediator', () => {
  describe('finishTrail() com todos os handlers bem-sucedidos', () => {
    it('deve chamar todos os handlers registrados', async () => {
      const repo = makeRepo();
      const h1 = makeHandler('h1');
      const h2 = makeHandler('h2');
      const mediator = makeMediator(repo, [h1, h2]);

      await mediator.finishTrail('trail-1', 'actor-1');

      expect(h1.handle).toHaveBeenCalledTimes(1);
      expect(h2.handle).toHaveBeenCalledTimes(1);
    });

    it('deve chamar os handlers com o evento correto', async () => {
      const repo = makeRepo();
      const h1 = makeHandler('h1');
      const mediator = makeMediator(repo, [h1]);

      await mediator.finishTrail('trail-42', 'actor-99');

      const event = (h1.handle as jest.Mock).mock.calls[0][0];
      expect(event.trailId).toBe('trail-42');
      expect(event.actorId).toBe('actor-99');
      expect(event.timestamp).toBeDefined();
    });

    it('deve retornar success: true quando todos os handlers passam', async () => {
      const repo = makeRepo();
      const mediator = makeMediator(repo, [
        makeHandler('h1'),
        makeHandler('h2'),
      ]);

      const result = await mediator.finishTrail('trail-1', 'actor-1');

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('deve persistir o evento de início e atualizar status para completed', async () => {
      const repo = makeRepo();
      const mediator = makeMediator(repo, [makeHandler('h1')]);

      await mediator.finishTrail('trail-1', 'actor-1');

      expect(repo.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          trailId: 'trail-1',
          eventType: 'finish_started',
        }),
      );
      expect(repo.updateEventStatus).toHaveBeenCalledWith(
        'trail-1',
        'completed',
      );
    });
  });

  describe('finishTrail() com handler falhando', () => {
    it('deve continuar executando os demais handlers mesmo quando um falha', async () => {
      const repo = makeRepo();
      const h1 = makeHandler('h1', () =>
        Promise.reject(new Error('h1 falhou')),
      );
      const h2 = makeHandler('h2');
      const mediator = makeMediator(repo, [h1, h2]);

      await mediator.finishTrail('trail-1', 'actor-1');

      expect(h2.handle).toHaveBeenCalledTimes(1);
    });

    it('deve retornar success: false e listar o erro quando um handler falha', async () => {
      const repo = makeRepo();
      const h1 = makeHandler('h1', () => Promise.reject(new Error('falhou')));
      const mediator = makeMediator(repo, [h1]);

      const result = await mediator.finishTrail('trail-1', 'actor-1');

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors![0].error).toBe('falhou');
    });

    it('deve atualizar status para failed quando ao menos um handler falha', async () => {
      const repo = makeRepo();
      const h1 = makeHandler('h1', () => Promise.reject(new Error('erro')));
      const mediator = makeMediator(repo, [h1]);

      await mediator.finishTrail('trail-1', 'actor-1');

      expect(repo.updateEventStatus).toHaveBeenCalledWith('trail-1', 'failed');
    });

    it('deve acumular erros de múltiplos handlers falhos', async () => {
      const repo = makeRepo();
      const h1 = makeHandler('h1', () => Promise.reject(new Error('erro-1')));
      const h2 = makeHandler('h2', () => Promise.reject(new Error('erro-2')));
      const mediator = makeMediator(repo, [h1, h2]);

      const result = await mediator.finishTrail('trail-1', 'actor-1');

      expect(result.errors).toHaveLength(2);
    });
  });

  describe('registerHandler()', () => {
    it('deve adicionar o handler à lista interna', () => {
      const repo = makeRepo();
      const service = new TrailLifecycleMediatorService(
        repo,
        null as any,
        null as any,
        null as any,
        null as any,
      );
      (service as any).handlers = [];

      const h = makeHandler('extra');
      service.registerHandler('extra', h);

      expect((service as any).handlers).toHaveLength(1);
      expect((service as any).handlers[0].name).toBe('extra');
    });
  });

  describe('finishTrail() com nenhum handler registrado', () => {
    it('deve retornar success: true e sem erros', async () => {
      const repo = makeRepo();
      const mediator = makeMediator(repo, []);

      const result = await mediator.finishTrail('trail-empty', 'actor-1');

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
