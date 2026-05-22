import { Injectable, Inject } from '@nestjs/common';
import type { IPontosTuristicosService } from '../../domain/interfaces/IPontosTuristicosService';

@Injectable()
export class BuscarFeedUseCase {
  constructor(@Inject('PONTOS_SERVICE') private readonly pontosService: IPontosTuristicosService) {}

  async execute(filtros: Record<string, any>): Promise<any[]> {
    return this.pontosService.buscarFeed(filtros || {});
  }
}
