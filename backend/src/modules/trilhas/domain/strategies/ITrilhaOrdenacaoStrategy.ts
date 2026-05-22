import { Trilha } from '../entities/Trilha';

export enum TrilhaOrdenacaoTipo {
  DATA = 'data',
  TITULO = 'titulo',
}

export interface ITrilhaOrdenacaoStrategy {
  readonly tipo: TrilhaOrdenacaoTipo;
  ordenar(trilhas: Trilha[]): Trilha[];
}
