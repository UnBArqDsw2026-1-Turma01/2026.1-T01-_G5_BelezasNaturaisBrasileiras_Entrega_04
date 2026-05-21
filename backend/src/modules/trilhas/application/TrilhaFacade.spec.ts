import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TrilhaFacade } from './TrilhaFacade';
import { CriarTrilhaUseCase } from './use-cases/CriarTrilhaUseCase';
import { ListarTrilhasUseCase } from './use-cases/ListarTrilhasUseCase';
import { FinalizarTrilhaUseCase } from './use-cases/FinalizarTrilhaUseCase';
import { Trilha } from '../domain/entities/Trilha';
import { TrilhaStatus } from '../domain/enums/TrilhaStatus';
import { CriarTrilhaInput } from './dtos/CriarTrilhaInput';

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

const makeInput = (
  overrides: Partial<CriarTrilhaInput> = {},
): CriarTrilhaInput =>
  Object.assign(
    {
      titulo: 'Trilha da Serra',
      descricao: 'Caminhada pela serra',
      pontoEncontro: 'Ponto A',
      dataInicio: '2026-06-01',
      vagasMaximas: 20,
    } as CriarTrilhaInput,
    overrides,
  );

describe('TrilhaFacade', () => {
  let facade: TrilhaFacade;
  let criarUC: jest.Mocked<CriarTrilhaUseCase>;
  let listarUC: jest.Mocked<ListarTrilhasUseCase>;
  let finalizarUC: jest.Mocked<FinalizarTrilhaUseCase>;

  beforeEach(() => {
    criarUC = { execute: jest.fn() } as any;
    listarUC = { execute: jest.fn() } as any;
    finalizarUC = { execute: jest.fn() } as any;

    const repositoryMock = { findById: jest.fn(), findAll: jest.fn(), create: jest.fn(), save: jest.fn() } as any;
    facade = new TrilhaFacade(criarUC, listarUC, finalizarUC, {} as any, {} as any, repositoryMock);
  });

  // ─── criar() ──────────────────────────────────────────────────────────────

  describe('criar()', () => {
    it('deve delegar ao CriarTrilhaUseCase com os parâmetros corretos', async () => {
      // Arrange
      const trilha = makeTrilha();
      const input = makeInput();
      criarUC.execute.mockResolvedValue(trilha);

      // Act
      const result = await facade.criar('organizador-1', input);

      // Assert
      expect(criarUC.execute).toHaveBeenCalledWith('organizador-1', input);
      expect(result).toBe(trilha);
    });

    it('deve retornar a trilha criada com status ATIVA por padrão', async () => {
      // Arrange
      const trilha = makeTrilha({ status: TrilhaStatus.ATIVA });
      criarUC.execute.mockResolvedValue(trilha);

      // Act
      const result = await facade.criar('organizador-1', makeInput());

      // Assert
      expect(result.status).toBe(TrilhaStatus.ATIVA);
    });
  });

  // ─── listar() ─────────────────────────────────────────────────────────────

  describe('listar()', () => {
    it('deve delegar ao ListarTrilhasUseCase e retornar a lista completa', async () => {
      // Arrange
      const trilhas = [makeTrilha(), makeTrilha({ id: 'trilha-2' } as any)];
      listarUC.execute.mockResolvedValue(trilhas);

      // Act
      const result = await facade.listar();

      // Assert
      expect(listarUC.execute).toHaveBeenCalledTimes(1);
      expect(result).toBe(trilhas);
    });

    it('deve retornar array vazio quando não há trilhas cadastradas', async () => {
      // Arrange
      listarUC.execute.mockResolvedValue([]);

      // Act
      const result = await facade.listar();

      // Assert
      expect(result).toEqual([]);
    });
  });

  // ─── finalizar() ──────────────────────────────────────────────────────────

  describe('finalizar()', () => {
    it('deve delegar ao FinalizarTrilhaUseCase com os parâmetros corretos', async () => {
      // Arrange
      finalizarUC.execute.mockResolvedValue(undefined);

      // Act
      await facade.finalizar('trilha-1', 'organizador-1');

      // Assert
      expect(finalizarUC.execute).toHaveBeenCalledWith(
        'trilha-1',
        'organizador-1',
      );
    });

    it('deve propagar ForbiddenException quando usuário não é o organizador', async () => {
      // Arrange
      finalizarUC.execute.mockRejectedValue(
        new ForbiddenException('Apenas o organizador pode finalizar a trilha'),
      );

      // Act & Assert
      await expect(facade.finalizar('trilha-1', 'outro-user')).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('deve propagar NotFoundException quando trilha não existe', async () => {
      // Arrange
      finalizarUC.execute.mockRejectedValue(
        new NotFoundException('Trilha não encontrada'),
      );

      // Act & Assert
      await expect(
        facade.finalizar('trilha-inexistente', 'organizador-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
