import { AuditedTrilhaRepository } from './AuditedTrilhaRepository';
import { AuditLog } from '../../domain/services/AuditLog';
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

describe('AuditedTrilhaRepository', () => {
  let wrapped: jest.Mocked<ITrilhaRepository>;
  let auditLog: AuditLog;
  let repo: AuditedTrilhaRepository;

  beforeEach(() => {
    wrapped = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
    };
    auditLog = new AuditLog();
    repo = new AuditedTrilhaRepository(wrapped, auditLog);
  });

  // ─── create() ────────────────────────────────────────────────────────────

  describe('create()', () => {
    it('deve chamar o repositório wrapeado e retornar a trilha criada', async () => {
      // Arrange
      const trilha = makeTrilha();
      wrapped.create.mockResolvedValue(trilha);

      // Act
      const result = await repo.create(trilha);

      // Assert
      expect(wrapped.create).toHaveBeenCalledWith(trilha);
      expect(result).toBe(trilha);
    });

    it('deve registrar uma entrada de auditoria com ação "created"', async () => {
      // Arrange
      const trilha = makeTrilha();
      wrapped.create.mockResolvedValue(trilha);

      // Act
      await repo.create(trilha);

      // Assert
      const entradas = auditLog.listarEntradas();
      expect(entradas).toHaveLength(1);
      expect(entradas[0].acao).toBe('created');
      expect(entradas[0].trilhaId).toBe('trilha-1');
      expect(entradas[0].registradoEm).toBeInstanceOf(Date);
    });
  });

  // ─── save() ──────────────────────────────────────────────────────────────

  describe('save()', () => {
    it('deve chamar o repositório wrapeado e retornar a trilha atualizada', async () => {
      // Arrange
      const trilha = makeTrilha({ status: TrilhaStatus.INATIVA } as any);
      wrapped.save.mockResolvedValue(trilha);

      // Act
      const result = await repo.save(trilha);

      // Assert
      expect(wrapped.save).toHaveBeenCalledWith(trilha);
      expect(result).toBe(trilha);
    });

    it('deve registrar uma entrada de auditoria com ação "updated"', async () => {
      // Arrange
      const trilha = makeTrilha({ status: TrilhaStatus.INATIVA } as any);
      wrapped.save.mockResolvedValue(trilha);

      // Act
      await repo.save(trilha);

      // Assert
      const entradas = auditLog.listarEntradas();
      expect(entradas).toHaveLength(1);
      expect(entradas[0].acao).toBe('updated');
      expect(entradas[0].trilhaId).toBe('trilha-1');
    });
  });

  // ─── findById() ──────────────────────────────────────────────────────────

  describe('findById()', () => {
    it('deve chamar o repositório wrapeado e retornar o resultado', async () => {
      // Arrange
      const trilha = makeTrilha();
      wrapped.findById.mockResolvedValue(trilha);

      // Act
      const result = await repo.findById('trilha-1');

      // Assert
      expect(wrapped.findById).toHaveBeenCalledWith('trilha-1');
      expect(result).toBe(trilha);
    });

    it('deve registrar uma entrada de auditoria com ação "read"', async () => {
      // Arrange
      wrapped.findById.mockResolvedValue(makeTrilha());

      // Act
      await repo.findById('trilha-1');

      // Assert
      const entradas = auditLog.listarEntradas();
      expect(entradas).toHaveLength(1);
      expect(entradas[0].acao).toBe('read');
      expect(entradas[0].trilhaId).toBe('trilha-1');
    });

    it('deve retornar null quando o repositório retorna null', async () => {
      // Arrange
      wrapped.findById.mockResolvedValue(null);

      // Act
      const result = await repo.findById('inexistente');

      // Assert
      expect(result).toBeNull();
    });
  });

  // ─── findAll() ───────────────────────────────────────────────────────────

  describe('findAll()', () => {
    it('deve chamar o repositório wrapeado e retornar a lista', async () => {
      // Arrange
      const trilhas = [makeTrilha()];
      wrapped.findAll.mockResolvedValue(trilhas);

      // Act
      const result = await repo.findAll();

      // Assert
      expect(wrapped.findAll).toHaveBeenCalledTimes(1);
      expect(result).toBe(trilhas);
    });

    it('deve registrar uma entrada de auditoria com ação "readAll"', async () => {
      // Arrange
      wrapped.findAll.mockResolvedValue([]);

      // Act
      await repo.findAll();

      // Assert
      const entradas = auditLog.listarEntradas();
      expect(entradas).toHaveLength(1);
      expect(entradas[0].acao).toBe('readAll');
    });

    it('deve retornar array vazio sem erro', async () => {
      // Arrange
      wrapped.findAll.mockResolvedValue([]);

      // Act
      const result = await repo.findAll();

      // Assert
      expect(result).toEqual([]);
    });
  });

  // ─── Múltiplas operações ─────────────────────────────────────────────────

  describe('múltiplas operações', () => {
    it('deve acumular múltiplas entradas de auditoria', async () => {
      // Arrange
      const trilha = makeTrilha();
      wrapped.create.mockResolvedValue(trilha);
      wrapped.findById.mockResolvedValue(trilha);
      wrapped.save.mockResolvedValue(trilha);

      // Act
      await repo.create(trilha);
      await repo.findById('trilha-1');
      await repo.save(trilha);

      // Assert
      const entradas = auditLog.listarEntradas();
      expect(entradas).toHaveLength(3);
      expect(entradas.map((e) => e.acao)).toEqual([
        'created',
        'read',
        'updated',
      ]);
    });
  });
});
