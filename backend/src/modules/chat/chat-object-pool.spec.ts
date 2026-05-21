import { ChatObjectPoolService } from './pool/chat-object-pool.service';
import { ChatConnectionFactoryService } from './chat-connection.factory.service';
import { IChatConnection } from './pool/interfaces/chat-connection.interface';

const makeConnection = (alive = true): jest.Mocked<IChatConnection> => ({
  id: `conn-${Math.random()}`,
  open: jest.fn().mockResolvedValue(undefined),
  close: jest.fn().mockResolvedValue(undefined),
  send: jest.fn().mockResolvedValue(undefined),
  isAlive: jest.fn().mockReturnValue(alive),
});

const makeFactory = (
  conn?: IChatConnection,
): jest.Mocked<ChatConnectionFactoryService> =>
  ({
    createConnection: jest.fn().mockResolvedValue(conn ?? makeConnection()),
  }) as any;

describe('ChatObjectPoolService — Object Pool', () => {
  describe('acquire() — pool vazio', () => {
    it('deve criar uma nova conexão via factory quando o pool está vazio', async () => {
      const conn = makeConnection();
      const factory = makeFactory(conn);
      const pool = new ChatObjectPoolService(factory);

      const acquired = await pool.acquire();

      expect(factory.createConnection).toHaveBeenCalledTimes(1);
      expect(acquired).toBe(conn);
    });

    it('deve retornar conexão com id definido', async () => {
      const factory = makeFactory();
      const pool = new ChatObjectPoolService(factory);

      const conn = await pool.acquire();
      expect(conn.id).toBeDefined();
    });
  });

  describe('acquire() — pool com conexões disponíveis', () => {
    it('deve reutilizar uma conexão do pool ao invés de criar uma nova', async () => {
      const conn = makeConnection(true);
      const factory = makeFactory();
      const pool = new ChatObjectPoolService(factory);

      // Coloca conexão no pool manualmente
      await pool.release(conn);
      expect(pool.size()).toBe(1);

      const acquired = await pool.acquire();
      expect(acquired).toBe(conn);
      expect(factory.createConnection).not.toHaveBeenCalled();
    });

    it('deve remover a conexão do pool ao adquiri-la', async () => {
      const conn = makeConnection(true);
      const factory = makeFactory();
      const pool = new ChatObjectPoolService(factory);

      await pool.release(conn);
      await pool.acquire();

      expect(pool.size()).toBe(0);
    });

    it('deve criar nova conexão se a do pool não estiver viva', async () => {
      const deadConn = makeConnection(false);
      const newConn = makeConnection(true);
      const factory = makeFactory(newConn);
      const pool = new ChatObjectPoolService(factory);

      await pool.release(deadConn);
      // Pool size antes do acquire (deadConn ainda está no pool interno)
      const acquired = await pool.acquire();

      expect(factory.createConnection).toHaveBeenCalledTimes(1);
      expect(acquired).toBe(newConn);
    });
  });

  describe('release()', () => {
    it('deve retornar a conexão ao pool quando está viva e pool não está cheio', async () => {
      const conn = makeConnection(true);
      const factory = makeFactory();
      const pool = new ChatObjectPoolService(factory);

      await pool.release(conn);

      expect(pool.size()).toBe(1);
    });

    it('deve fechar a conexão morta ao invés de retorná-la ao pool', async () => {
      const conn = makeConnection(false);
      const factory = makeFactory();
      const pool = new ChatObjectPoolService(factory);

      await pool.release(conn);

      expect(pool.size()).toBe(0);
      expect(conn.close).toHaveBeenCalled();
    });

    it('deve fechar a conexão quando o pool atingiu o limite máximo', async () => {
      const factory = makeFactory();
      const pool = new ChatObjectPoolService(factory);

      // Força o limite interno do pool a ser 2 para o teste
      (pool as any).max = 2;

      const c1 = makeConnection(true);
      const c2 = makeConnection(true);
      const c3 = makeConnection(true);

      await pool.release(c1);
      await pool.release(c2);
      await pool.release(c3); // deve fechar c3

      expect(pool.size()).toBe(2);
      expect(c3.close).toHaveBeenCalled();
    });
  });

  describe('size()', () => {
    it('deve retornar 0 quando o pool está vazio', () => {
      const pool = new ChatObjectPoolService(makeFactory());
      expect(pool.size()).toBe(0);
    });

    it('deve refletir o número de conexões disponíveis no pool', async () => {
      const factory = makeFactory();
      const pool = new ChatObjectPoolService(factory);

      await pool.release(makeConnection(true));
      await pool.release(makeConnection(true));
      expect(pool.size()).toBe(2);

      await pool.acquire();
      expect(pool.size()).toBe(1);
    });
  });

  describe('cleanIdle()', () => {
    it('deve fechar todas as conexões e esvaziar o pool', async () => {
      const factory = makeFactory();
      const pool = new ChatObjectPoolService(factory);

      const c1 = makeConnection(true);
      const c2 = makeConnection(true);
      await pool.release(c1);
      await pool.release(c2);

      await pool.cleanIdle();

      expect(pool.size()).toBe(0);
      expect(c1.close).toHaveBeenCalled();
      expect(c2.close).toHaveBeenCalled();
    });

    it('não deve falhar quando o pool está vazio', async () => {
      const pool = new ChatObjectPoolService(makeFactory());
      await expect(pool.cleanIdle()).resolves.not.toThrow();
    });
  });
});
