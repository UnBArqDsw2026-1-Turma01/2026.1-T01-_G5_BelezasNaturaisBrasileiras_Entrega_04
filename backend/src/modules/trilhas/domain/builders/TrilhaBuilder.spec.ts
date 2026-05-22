import { TrilhaBuilder } from './TrilhaBuilder';
import { TrilhaStatus } from '../enums/TrilhaStatus';

describe('TrilhaBuilder', () => {
  it('deve construir uma trilha valida com status ATIVA por padrao', () => {
    const trilha = new TrilhaBuilder()
      .withId('trilha-1')
      .withTitulo('Trilha da Serra')
      .withDescricao('Caminhada pela serra')
      .withOrganizadorId('organizador-1')
      .withPontoEncontro('Entrada do parque')
      .withDataInicio(new Date('2026-06-01'))
      .withVagasMaximas(20)
      .build();

    expect(trilha.id).toBe('trilha-1');
    expect(trilha.titulo).toBe('Trilha da Serra');
    expect(trilha.status).toBe(TrilhaStatus.ATIVA);
  });

  it('deve permitir configurar status e datas quando necessario', () => {
    const createdAt = new Date('2026-05-01');
    const updatedAt = new Date('2026-05-02');

    const trilha = new TrilhaBuilder()
      .withId('trilha-1')
      .withTitulo('Trilha lotada')
      .withDescricao('Caminhada sem vagas')
      .withOrganizadorId('organizador-1')
      .withPontoEncontro('Portal')
      .withDataInicio(new Date('2026-07-01'))
      .withVagasMaximas(10)
      .withStatus(TrilhaStatus.LOTADA)
      .withCreatedAt(createdAt)
      .withUpdatedAt(updatedAt)
      .build();

    expect(trilha.status).toBe(TrilhaStatus.LOTADA);
    expect(trilha.createdAt).toBe(createdAt);
    expect(trilha.updatedAt).toBe(updatedAt);
  });

  it('deve impedir a criacao sem campos obrigatorios', () => {
    expect(() => new TrilhaBuilder().withId('trilha-1').build()).toThrow(
      'Campos obrigatorios ausentes no TrilhaBuilder',
    );
  });
});
