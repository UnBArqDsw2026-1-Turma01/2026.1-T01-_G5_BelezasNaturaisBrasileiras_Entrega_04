import { Injectable, Inject } from '@nestjs/common';
import type { IPontosTuristicosService } from '../../domain/interfaces/IPontosTuristicosService';

@Injectable()
export class CriarPontoUseCase {
  constructor(@Inject('PONTOS_SERVICE') private readonly pontosService: IPontosTuristicosService) {}

  async execute(dados: any, usuarioId: string): Promise<any> {
    return this.pontosService.criar(dados, usuarioId);
  }
}
