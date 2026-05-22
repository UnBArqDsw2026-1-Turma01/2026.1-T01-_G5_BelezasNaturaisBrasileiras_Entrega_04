import { Injectable } from '@nestjs/common';
import {
  ITrilhaOrdenacaoStrategy,
  TrilhaOrdenacaoTipo,
} from './ITrilhaOrdenacaoStrategy';
import { OrdenarTrilhasPorDataStrategy } from './OrdenarTrilhasPorDataStrategy';
import { OrdenarTrilhasPorTituloStrategy } from './OrdenarTrilhasPorTituloStrategy';
import { Trilha } from '../entities/Trilha';

@Injectable()
export class TrilhaOrdenacaoContext {
  private readonly strategies: Map<
    TrilhaOrdenacaoTipo,
    ITrilhaOrdenacaoStrategy
  >;

  constructor(
    ordenarPorData: OrdenarTrilhasPorDataStrategy,
    ordenarPorTitulo: OrdenarTrilhasPorTituloStrategy,
  ) {
    this.strategies = new Map<TrilhaOrdenacaoTipo, ITrilhaOrdenacaoStrategy>([
      [ordenarPorData.tipo, ordenarPorData],
      [ordenarPorTitulo.tipo, ordenarPorTitulo],
    ]);
  }

  ordenar(
    trilhas: Trilha[],
    tipo: TrilhaOrdenacaoTipo = TrilhaOrdenacaoTipo.DATA,
  ): Trilha[] {
    const strategy =
      this.strategies.get(tipo) ??
      this.strategies.get(TrilhaOrdenacaoTipo.DATA);

    return strategy ? strategy.ordenar(trilhas) : trilhas;
  }
}
