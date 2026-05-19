import { CachedTrilhaRepository } from './CachedTrilhaRepository';
import { ITrilhaRepository } from '../../domain/interfaces/ITrilhaRepository';
import { Trilha } from '../../domain/entities/Trilha';
import { TrilhaStatus } from '../../domain/enums/TrilhaStatus';

const makeTrilha = (overrides: Partial<Trilha> = {}): Trilha =>
  Object.assign(
    new Trilha(
      'trilha-1',
      'Trilha da Serra',
      'Caminhada pela serra',
      'organizador-1',
      'Ponto A',
      new Date('2026-06-01'),
      20,
    ),
    overrides,
  );

describe('CachedTrilhaRepository', () => {
  let wrapped: jest.Mocked<ITrilhaRepository>;
  let cache: CachedTrilhaRepository;

  beforeEach(() => {
    wrapped = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
    };
    cache = new CachedTrilhaRepository(wrapped);
  });

  // ─── findById() ──────────────────────────────────────────────────────────

  describe('findById()', () => {
    it('deve chamar o repositório wrapeado na primeira chamada', async () => {
      // Arrange
      const trilha = makeTrilha();
      wrapped.findById.mockResolvedValue(trilha);

      // Act
      const result = await cache.findById('trilha-1');

      // Assert
      expect(wrapped.findById).toHaveBeenCalledTimes(1);
      expect(wrapped.findById).toHaveBeenCalledWith('trilha-1');
      expect(result).toBe(trilha);
    });

    it('deve retornar do cache na segunda chamada sem chamar o repositório novamente', async () => {
      // Arrange
      const trilha = makeTrilha();
      wrapped.findById.mockResolvedValue(trilha);

      // Act
      await cache.findById('trilha-1');
      const result = await cache.findById('trilha-1');

      // Assert
      expect(wrapped.findById).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(trilha);
    });

    it('deve chamar o repositório para ids diferentes', async () => {
      // Arrange
      const t1 = makeTrilha({ id: 'trilha-1' } as any);
      const t2 = makeTrilha({ id: 'trilha-2' } as any);
      wrapped.findById.mockResolvedValueOnce(t1).mockResolvedValueOnce(t2);

      // Act
      await cache.findById('trilha-1');
      await cache.findById('trilha-2');

      // Assert
      expect(wrapped.findById).toHaveBeenCalledTimes(2);
    });

    it('deve retornar null quando o repositório retorna null', async () => {
      // Arrange
      wrapped.findById.mockResolvedValue(null);

      // Act
      const result = await cache.findById('inexistente');

      // Assert
      expect(result).toBeNull();
    });
  });

  // ─── findAll() ───────────────────────────────────────────────────────────

  describe('findAll()', () => {
    it('deve chamar o repositório wrapeado na primeira chamada', async () => {
      // Arrange
      const trilhas = [makeTrilha()];
      wrapped.findAll.mockResolvedValue(trilhas);

      // Act
      const result = await cache.findAll();

      // Assert
      expect(wrapped.findAll).toHaveBeenCalledTimes(1);
      expect(result).toBe(trilhas);
    });

    it('deve retornar do cache na segunda chamada sem chamar o repositório novamente', async () => {
      // Arrange
      const trilhas = [makeTrilha()];
      wrapped.findAll.mockResolvedValue(trilhas);

      // Act
      await cache.findAll();
      const result = await cache.findAll();

      // Assert
      expect(wrapped.findAll).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual(trilhas);
    });
  });

  // ─── create() ────────────────────────────────────────────────────────────

  describe('create()', () => {
    it('deve chamar o repositório wrapeado e retornar a trilha criada', async () => {
      // Arrange
      const trilha = makeTrilha();
      wrapped.create.mockResolvedValue(trilha);

      // Act
      const result = await cache.create(trilha);

      // Assert
      expect(wrapped.create).toHaveBeenCalledWith(trilha);
      expect(result).toBe(trilha);
    });

    it('deve invalidar o cache de findAll após criar uma trilha', async () => {
      // Arrange
      const trilha = makeTrilha();
      const listaAntes = [makeTrilha({ id: 'trilha-2' } as any)];
      const listaDepois = [makeTrilha({ id: 'trilha-2' } as any), trilha];
      wrapped.findAll
        .mockResolvedValueOnce(listaAntes)
        .mockResolvedValueOnce(listaDepois);
      wrapped.create.mockResolvedValue(trilha);

      // Act
      await cache.findAll(); // popula cache
      await cache.create(trilha); // deve invalidar
      const result = await cache.findAll(); // deve ir ao banco de novo

      // Assert
      expect(wrapped.findAll).toHaveBeenCalledTimes(2);
      expect(result).toStrictEqual(listaDepois);
    });
  });

  // ─── save() ──────────────────────────────────────────────────────────────

  describe('save()', () => {
    it('deve chamar o repositório wrapeado e retornar a trilha atualizada', async () => {
      // Arrange
      const trilha = makeTrilha({ status: TrilhaStatus.INATIVA } as any);
      wrapped.save.mockResolvedValue(trilha);

      // Act
      const result = await cache.save(trilha);

      // Assert
      expect(wrapped.save).toHaveBeenCalledWith(trilha);
      expect(result).toBe(trilha);
    });

    it('deve invalidar o cache de findById após salvar uma trilha', async () => {
      // Arrange
      const ativa = makeTrilha({ status: TrilhaStatus.ATIVA } as any);
      const inativa = makeTrilha({ status: TrilhaStatus.INATIVA } as any);
      wrapped.findById
        .mockResolvedValueOnce(ativa)
        .mockResolvedValueOnce(inativa);
      wrapped.save.mockResolvedValue(inativa);

      // Act
      await cache.findById('trilha-1'); // popula cache
      await cache.save(inativa); // deve invalidar
      const result = await cache.findById('trilha-1'); // deve ir ao banco de novo

      // Assert
      expect(wrapped.findById).toHaveBeenCalledTimes(2);
      expect(result?.status).toBe(TrilhaStatus.INATIVA);
    });

    it('deve invalidar o cache de findAll após salvar uma trilha', async () => {
      // Arrange
      const trilha = makeTrilha();
      const listaAntes = [trilha];
      const listaDepois = [makeTrilha({ status: TrilhaStatus.INATIVA } as any)];
      wrapped.findAll
        .mockResolvedValueOnce(listaAntes)
        .mockResolvedValueOnce(listaDepois);
      wrapped.save.mockResolvedValue(
        makeTrilha({ status: TrilhaStatus.INATIVA } as any),
      );

      // Act
      await cache.findAll(); // popula cache
      await cache.save(trilha); // deve invalidar
      const result = await cache.findAll(); // deve ir ao banco de novo

      // Assert
      expect(wrapped.findAll).toHaveBeenCalledTimes(2);
      expect(result).toStrictEqual(listaDepois);
    });
  });
});
