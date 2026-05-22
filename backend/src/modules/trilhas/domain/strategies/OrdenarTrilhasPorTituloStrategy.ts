import { Injectable } from '@nestjs/common';
import {
  ITrilhaOrdenacaoStrategy,
  TrilhaOrdenacaoTipo,
} from './ITrilhaOrdenacaoStrategy';
import { Trilha } from '../entities/Trilha';

@Injectable()
export class OrdenarTrilhasPorTituloStrategy implements ITrilhaOrdenacaoStrategy {
  readonly tipo = TrilhaOrdenacaoTipo.TITULO;

  ordenar(trilhas: Trilha[]): Trilha[] {
    return [...trilhas].sort((a, b) => a.titulo.localeCompare(b.titulo));
  }
}
