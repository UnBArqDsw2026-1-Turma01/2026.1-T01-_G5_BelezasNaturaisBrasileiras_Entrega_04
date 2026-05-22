import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { EditarTrilhaUseCase } from './EditarTrilhaUseCase';
import { Trilha } from '../../domain/entities/Trilha';
import { TrilhaStatus } from '../../domain/enums/TrilhaStatus';

const makeTrilha = (): Trilha =>
  new Trilha(
    't1',
    'Original',
    'Desc',
    'org-1',
    'Ponto A',
    new Date('2026-06-01'),
    20,
    TrilhaStatus.ATIVA,
  );

describe('EditarTrilhaUseCase', () => {
  const mockRepo = {
    findById: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
  };
  const mockCaretaker = { save: jest.fn(), restore: jest.fn() };
  let useCase: EditarTrilhaUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new EditarTrilhaUseCase(mockRepo as any, mockCaretaker as any);
  });

  it('should edit trilha and save it', async () => {
    const trilha = makeTrilha();
    mockRepo.findById.mockResolvedValue(trilha);
    mockRepo.save.mockImplementation(async (t: Trilha) => t);

    const result = await useCase.execute('t1', 'org-1', {
      titulo: 'Novo Titulo',
    });

    expect(result.titulo).toBe('Novo Titulo');
    expect(mockCaretaker.save).toHaveBeenCalledWith('t1', expect.any(Object));
    expect(mockRepo.save).toHaveBeenCalledWith(trilha);
  });

  it('should throw NotFoundException when trilha not found', async () => {
    mockRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('t1', 'org-1', { titulo: 'X' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException when caller is not the organizer', async () => {
    mockRepo.findById.mockResolvedValue(makeTrilha());

    await expect(
      useCase.execute('t1', 'outro-org', { titulo: 'X' }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should save even when no fields provided', async () => {
    const trilha = makeTrilha();
    mockRepo.findById.mockResolvedValue(trilha);
    mockRepo.save.mockImplementation(async (t: Trilha) => t);

    const result = await useCase.execute('t1', 'org-1', {});

    expect(result.titulo).toBe('Original');
    expect(mockCaretaker.save).toHaveBeenCalledWith('t1', expect.any(Object));
    expect(mockRepo.save).toHaveBeenCalledWith(trilha);
  });
});
