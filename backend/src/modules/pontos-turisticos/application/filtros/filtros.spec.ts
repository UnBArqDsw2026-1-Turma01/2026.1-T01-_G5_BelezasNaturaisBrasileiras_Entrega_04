import { BuscaBase } from './BuscaBase';
import { FiltroRegiao } from './FiltroRegiao';
import { FiltroEstado } from './FiltroEstado';
import { FiltroCidade } from './FiltroCidade';
import { FiltroTipo } from './FiltroTipo';

describe('Decorator — Filtros de Busca', () => {
  describe('BuscaBase', () => {
    it('retorna where vazio', () => {
      expect(new BuscaBase().construirWhere()).toEqual({});
    });
  });

  describe('FiltroRegiao', () => {
    it('adiciona regiao ao where', () => {
      const busca = new FiltroRegiao(new BuscaBase(), 'Norte');
      expect(busca.construirWhere()).toEqual({ regiao: 'Norte' });
    });
  });

  describe('FiltroEstado', () => {
    it('adiciona estado ao where', () => {
      const busca = new FiltroEstado(new BuscaBase(), 'AM');
      expect(busca.construirWhere()).toEqual({ estado: 'AM' });
    });
  });

  describe('FiltroCidade', () => {
    it('adiciona cidade ao where', () => {
      const busca = new FiltroCidade(new BuscaBase(), 'Manaus');
      expect(busca.construirWhere()).toEqual({ cidade: 'Manaus' });
    });
  });

  describe('FiltroTipo', () => {
    it('adiciona tipo ao where', () => {
      const busca = new FiltroTipo(new BuscaBase(), 'cachoeira');
      expect(busca.construirWhere()).toEqual({ tipo: 'cachoeira' });
    });
  });

  describe('Composição de filtros', () => {
    it('empilha regiao + estado', () => {
      const busca = new FiltroEstado(
        new FiltroRegiao(new BuscaBase(), 'Centro-Oeste'),
        'GO',
      );
      expect(busca.construirWhere()).toEqual({ regiao: 'Centro-Oeste', estado: 'GO' });
    });

    it('empilha todos os filtros', () => {
      const busca = new FiltroTipo(
        new FiltroCidade(
          new FiltroEstado(
            new FiltroRegiao(new BuscaBase(), 'Sudeste'),
            'SP',
          ),
          'São Paulo',
        ),
        'parque',
      );
      expect(busca.construirWhere()).toEqual({
        regiao: 'Sudeste',
        estado: 'SP',
        cidade: 'São Paulo',
        tipo: 'parque',
      });
    });

    it('filtros independentes não interferem entre si', () => {
      const buscaA = new FiltroRegiao(new BuscaBase(), 'Sul');
      const buscaB = new FiltroTipo(new BuscaBase(), 'trilha');

      expect(buscaA.construirWhere()).toEqual({ regiao: 'Sul' });
      expect(buscaB.construirWhere()).toEqual({ tipo: 'trilha' });
    });
  });
});
