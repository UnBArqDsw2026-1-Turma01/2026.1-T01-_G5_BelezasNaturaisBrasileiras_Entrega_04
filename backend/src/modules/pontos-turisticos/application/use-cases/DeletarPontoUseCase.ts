import { Injectable, Inject } from '@nestjs/common';
import type { IPontosTuristicosService } from '../../domain/interfaces/IPontosTuristicosService';

@Injectable()
export class DeletarPontoUseCase {
  constructor(@Inject('PONTOS_SERVICE') private readonly pontosService: IPontosTuristicosService) {}

  async execute(id: string, usuarioId: string): Promise<void> {
    return this.pontosService.deletar(id, usuarioId);
  }
}
