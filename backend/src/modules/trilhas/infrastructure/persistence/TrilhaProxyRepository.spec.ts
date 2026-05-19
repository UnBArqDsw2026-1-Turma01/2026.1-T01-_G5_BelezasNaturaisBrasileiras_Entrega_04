import { ForbiddenException } from '@nestjs/common';
import { TrilhaProxyRepository } from './TrilhaProxyRepository';
import { TrilhaRequestContext } from '../../domain/services/TrilhaRequestContext';
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

describe('TrilhaProxyRepository', () => {
  let wrapped: jest.Mocked<ITrilhaRepository>;
  let context: TrilhaRequestContext;
  let proxy: TrilhaProxyRepository;

  beforeEach(() => {
    wrapped = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
    };
    context = new TrilhaRequestContext();
    proxy = new TrilhaProxyRepository(wrapped, context);
  });

  // ─── save() ──────────────────────────────────────────────────────────────

  describe('save()', () => {
    it('deve delegar ao wrapped quando requesterId é o organizador da trilha', async () => {
      // Arrange
      const trilha = makeTrilha({ status: TrilhaStatus.INATIVA } as any);
      wrapped.save.mockResolvedValue(trilha);

      // Act
      const result = await context.run('organizador-1', () =>
        proxy.save(trilha),
      );

      // Assert
      expect(wrapped.save).toHaveBeenCalledWith(trilha);
      expect(result).toBe(trilha);
    });

    it('deve lançar ForbiddenException quando requesterId não é o organizador', async () => {
      // Arrange
      const trilha = makeTrilha();

      // Act & Assert
      await expect(
        context.run('outro-user', () => proxy.save(trilha)),
      ).rejects.toThrow(ForbiddenException);
      expect(wrapped.save).not.toHaveBeenCalled();
    });

    it('deve lançar ForbiddenException quando chamado fora de um contexto de request', async () => {
      // Arrange
      const trilha = makeTrilha();

      // Act & Assert
      await expect(proxy.save(trilha)).rejects.toThrow(ForbiddenException);
      expect(wrapped.save).not.toHaveBeenCalled();
    });

    it('deve retornar exatamente o resultado do wrapped quando autorizado', async () => {
      // Arrange
      const trilha = makeTrilha({ status: TrilhaStatus.INATIVA } as any);
      wrapped.save.mockResolvedValue(trilha);

      // Act
      const result = await context.run('organizador-1', () =>
        proxy.save(trilha),
      );

      // Assert
      expect(result).toStrictEqual(trilha);
    });
  });

  // ─── create() ────────────────────────────────────────────────────────────

  describe('create()', () => {
    it('deve delegar ao wrapped sem verificar contexto', async () => {
      // Arrange
      const trilha = makeTrilha();
      wrapped.create.mockResolvedValue(trilha);

      // Act
      const result = await proxy.create(trilha);

      // Assert
      expect(wrapped.create).toHaveBeenCalledWith(trilha);
      expect(result).toBe(trilha);
    });

    it('deve permitir create fora de um contexto de request', async () => {
      // Arrange
      const trilha = makeTrilha();
      wrapped.create.mockResolvedValue(trilha);

      // Act & Assert
      await expect(proxy.create(trilha)).resolves.toBe(trilha);
    });
  });

  // ─── findById() ──────────────────────────────────────────────────────────

  describe('findById()', () => {
    it('deve delegar ao wrapped sem verificar contexto', async () => {
      // Arrange
      const trilha = makeTrilha();
      wrapped.findById.mockResolvedValue(trilha);

      // Act
      const result = await proxy.findById('trilha-1');

      // Assert
      expect(wrapped.findById).toHaveBeenCalledWith('trilha-1');
      expect(result).toBe(trilha);
    });

    it('deve retornar null sem erro quando wrapped retorna null', async () => {
      // Arrange
      wrapped.findById.mockResolvedValue(null);

      // Act
      const result = await proxy.findById('inexistente');

      // Assert
      expect(result).toBeNull();
    });
  });

  // ─── findAll() ───────────────────────────────────────────────────────────

  describe('findAll()', () => {
    it('deve delegar ao wrapped sem verificar contexto', async () => {
      // Arrange
      const trilhas = [makeTrilha()];
      wrapped.findAll.mockResolvedValue(trilhas);

      // Act
      const result = await proxy.findAll();

      // Assert
      expect(wrapped.findAll).toHaveBeenCalledTimes(1);
      expect(result).toBe(trilhas);
    });
  });
});
