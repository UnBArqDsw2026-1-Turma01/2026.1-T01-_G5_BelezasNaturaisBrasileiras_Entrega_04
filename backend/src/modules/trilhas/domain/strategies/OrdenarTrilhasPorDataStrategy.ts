import { Injectable } from '@nestjs/common';
import {
  ITrilhaOrdenacaoStrategy,
  TrilhaOrdenacaoTipo,
} from './ITrilhaOrdenacaoStrategy';
import { Trilha } from '../entities/Trilha';

@Injectable()
export class OrdenarTrilhasPorDataStrategy implements ITrilhaOrdenacaoStrategy {
  readonly tipo = TrilhaOrdenacaoTipo.DATA;

  ordenar(trilhas: Trilha[]): Trilha[] {
    return [...trilhas].sort(
      (a, b) => a.dataInicio.getTime() - b.dataInicio.getTime(),
    );
  }
}
