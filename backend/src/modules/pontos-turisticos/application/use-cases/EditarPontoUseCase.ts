import { Injectable, Inject } from '@nestjs/common';
import type { IPontosTuristicosService } from '../../domain/interfaces/IPontosTuristicosService';

@Injectable()
export class EditarPontoUseCase {
  constructor(@Inject('PONTOS_SERVICE') private readonly pontosService: IPontosTuristicosService) {}

  async execute(id: string, dados: any, usuarioId: string): Promise<any> {
    return this.pontosService.editar(id, dados, usuarioId);
  }
}
