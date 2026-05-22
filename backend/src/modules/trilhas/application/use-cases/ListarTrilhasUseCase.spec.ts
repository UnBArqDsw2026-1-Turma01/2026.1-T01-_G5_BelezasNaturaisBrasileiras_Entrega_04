import { ListarTrilhasUseCase } from './ListarTrilhasUseCase';
import { Trilha } from '../../domain/entities/Trilha';
import { TrilhaStatus } from '../../domain/enums/TrilhaStatus';
import { TrilhaOrdenacaoContext } from '../../domain/strategies/TrilhaOrdenacaoContext';
import { OrdenarTrilhasPorDataStrategy } from '../../domain/strategies/OrdenarTrilhasPorDataStrategy';
import { OrdenarTrilhasPorTituloStrategy } from '../../domain/strategies/OrdenarTrilhasPorTituloStrategy';
import { TrilhaOrdenacaoTipo } from '../../domain/strategies/ITrilhaOrdenacaoStrategy';

const makeTrilha = (overrides: Partial<Trilha> = {}): Trilha =>
  ({
    id: '1',
    titulo: 'Trilha Teste',
    descricao: 'Descricao teste',
    organizadorId: 'org-1',
    pontoEncontro: 'Ponto A',
    dataInicio: new Date('2026-06-01'),
    vagasMaximas: 10,
    status: TrilhaStatus.ATIVA,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }) as Trilha;

describe('ListarTrilhasUseCase', () => {
  const makeRepo = (trilhas: Trilha[]) => ({
    findAll: jest.fn().mockResolvedValue(trilhas),
  });

  const makeOrdenacaoContext = () =>
    new TrilhaOrdenacaoContext(
      new OrdenarTrilhasPorDataStrategy(),
      new OrdenarTrilhasPorTituloStrategy(),
    );

  const makeUseCase = (trilhas: Trilha[]) =>
    new ListarTrilhasUseCase(makeRepo(trilhas) as any, makeOrdenacaoContext());

  it('returns all trilhas when no filter', async () => {
    const trilhas = [
      makeTrilha({ id: '1', dataInicio: new Date('2026-06-01') }),
      makeTrilha({ id: '2', dataInicio: new Date('2026-07-01') }),
    ];
    const result = await makeUseCase(trilhas).execute({});
    expect(result).toHaveLength(2);
  });

  it('returns empty array when no trilhas', async () => {
    const result = await makeUseCase([]).execute({});
    expect(result).toHaveLength(0);
  });

  it('filters by status ATIVA', async () => {
    const trilhas = [
      makeTrilha({ id: '1', status: TrilhaStatus.ATIVA }),
      makeTrilha({ id: '2', status: TrilhaStatus.INATIVA }),
    ];
    const result = await makeUseCase(trilhas).execute({
      status: TrilhaStatus.ATIVA,
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filters by status LOTADA', async () => {
    const trilhas = [
      makeTrilha({ id: '1', status: TrilhaStatus.ATIVA }),
      makeTrilha({ id: '2', status: TrilhaStatus.LOTADA }),
      makeTrilha({ id: '3', status: TrilhaStatus.INATIVA }),
    ];
    const result = await makeUseCase(trilhas).execute({
      status: TrilhaStatus.LOTADA,
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('paginates ordered results page 1', async () => {
    const trilhas = [
      makeTrilha({ id: '3', dataInicio: new Date('2026-08-01') }),
      makeTrilha({ id: '1', dataInicio: new Date('2026-06-01') }),
      makeTrilha({ id: '2', dataInicio: new Date('2026-07-01') }),
    ];
    const result = await makeUseCase(trilhas).execute({ page: 1, pageSize: 2 });
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('2');
  });

  it('returns second page', async () => {
    const trilhas = [
      makeTrilha({ id: '1', dataInicio: new Date('2026-06-01') }),
      makeTrilha({ id: '2', dataInicio: new Date('2026-07-01') }),
      makeTrilha({ id: '3', dataInicio: new Date('2026-08-01') }),
    ];
    const result = await makeUseCase(trilhas).execute({ page: 2, pageSize: 2 });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('returns empty array when page exceeds total pages', async () => {
    const trilhas = [makeTrilha({ id: '1' }), makeTrilha({ id: '2' })];
    const result = await makeUseCase(trilhas).execute({
      page: 10,
      pageSize: 2,
    });
    expect(result).toHaveLength(0);
  });

  it('filters by status and paginates', async () => {
    const trilhas = [
      makeTrilha({
        id: '1',
        status: TrilhaStatus.ATIVA,
        dataInicio: new Date('2026-06-01'),
      }),
      makeTrilha({
        id: '2',
        status: TrilhaStatus.ATIVA,
        dataInicio: new Date('2026-07-01'),
      }),
      makeTrilha({
        id: '3',
        status: TrilhaStatus.ATIVA,
        dataInicio: new Date('2026-08-01'),
      }),
      makeTrilha({ id: '4', status: TrilhaStatus.LOTADA }),
    ];
    const result = await makeUseCase(trilhas).execute({
      status: TrilhaStatus.ATIVA,
      page: 2,
      pageSize: 2,
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('ignores pagination if only page is provided', async () => {
    const trilhas = [
      makeTrilha({ id: '1' }),
      makeTrilha({ id: '2' }),
      makeTrilha({ id: '3' }),
    ];
    const result = await makeUseCase(trilhas).execute({ page: 1 } as any);
    expect(result).toHaveLength(3);
  });

  it('ignores pagination if only pageSize is provided', async () => {
    const trilhas = [
      makeTrilha({ id: '1' }),
      makeTrilha({ id: '2' }),
      makeTrilha({ id: '3' }),
    ];
    const result = await makeUseCase(trilhas).execute({ pageSize: 2 } as any);
    expect(result).toHaveLength(3);
  });

  it('orders by title before pagination when requested', async () => {
    const trilhas = [
      makeTrilha({ id: '1', titulo: 'Serra Verde' }),
      makeTrilha({ id: '2', titulo: 'Cachoeira Azul' }),
      makeTrilha({ id: '3', titulo: 'Bosque Norte' }),
    ];

    const result = await makeUseCase(trilhas).execute({
      ordenarPor: TrilhaOrdenacaoTipo.TITULO,
      page: 1,
      pageSize: 2,
    });

    expect(result.map((trilha) => trilha.titulo)).toEqual([
      'Bosque Norte',
      'Cachoeira Azul',
    ]);
  });
});
