import { Trilha } from '../entities/Trilha';
import { OrdenarTrilhasPorDataStrategy } from './OrdenarTrilhasPorDataStrategy';
import { OrdenarTrilhasPorTituloStrategy } from './OrdenarTrilhasPorTituloStrategy';
import { TrilhaOrdenacaoContext } from './TrilhaOrdenacaoContext';
import { TrilhaOrdenacaoTipo } from './ITrilhaOrdenacaoStrategy';

const makeTrilha = (id: string, titulo: string, dataInicio: string): Trilha =>
  new Trilha(
    id,
    titulo,
    'Descricao',
    'organizador-1',
    'Ponto de encontro',
    new Date(dataInicio),
    20,
  );

describe('TrilhaOrdenacaoContext', () => {
  let context: TrilhaOrdenacaoContext;

  beforeEach(() => {
    context = new TrilhaOrdenacaoContext(
      new OrdenarTrilhasPorDataStrategy(),
      new OrdenarTrilhasPorTituloStrategy(),
    );
  });

  it('deve ordenar trilhas por data de inicio usando Strategy', () => {
    const trilhas = [
      makeTrilha('2', 'Cachoeira Azul', '2026-07-01'),
      makeTrilha('1', 'Serra Verde', '2026-06-01'),
    ];

    const ordenadas = context.ordenar(trilhas, TrilhaOrdenacaoTipo.DATA);

    expect(ordenadas.map((trilha) => trilha.id)).toEqual(['1', '2']);
    expect(trilhas.map((trilha) => trilha.id)).toEqual(['2', '1']);
  });

  it('deve ordenar trilhas por titulo usando outra Strategy', () => {
    const trilhas = [
      makeTrilha('1', 'Serra Verde', '2026-06-01'),
      makeTrilha('2', 'Cachoeira Azul', '2026-07-01'),
    ];

    const ordenadas = context.ordenar(trilhas, TrilhaOrdenacaoTipo.TITULO);

    expect(ordenadas.map((trilha) => trilha.titulo)).toEqual([
      'Cachoeira Azul',
      'Serra Verde',
    ]);
  });
});
