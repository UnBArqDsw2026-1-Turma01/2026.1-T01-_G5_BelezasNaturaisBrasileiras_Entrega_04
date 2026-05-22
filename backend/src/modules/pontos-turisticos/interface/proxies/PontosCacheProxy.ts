import { Injectable, Logger } from '@nestjs/common';
import type { IPontosTuristicosService } from '../../domain/interfaces/IPontosTuristicosService';

@Injectable()
export class PontosCacheProxy implements IPontosTuristicosService {
  private readonly logger = new Logger('PontosCache');
  private readonly cache = new Map<string, { dados: any[]; expiraEm: number }>();
  private readonly TTL_MS = 3 * 60 * 1000; // 3 minutos

  constructor(private readonly proximo: IPontosTuristicosService) {}

  async buscarPorId(id: string) {
    return this.proximo.buscarPorId(id);
  }

  async buscarFeed(filtros: Record<string, any>) {
    const chave = JSON.stringify(filtros || {});
    const entrada = this.cache.get(chave);

    if (entrada && Date.now() < entrada.expiraEm) {
      this.logger.log(`Cache HIT: ${chave}`);
      return entrada.dados;
    }

    this.logger.log(`Cache MISS: ${chave} — consultando banco`);
    const dados = await this.proximo.buscarFeed(filtros);
    this.cache.set(chave, { dados, expiraEm: Date.now() + this.TTL_MS });
    return dados;
  }

  async criar(dados: any, usuarioId: string) {
    this.cache.clear();
    return this.proximo.criar(dados, usuarioId);
  }

  async editar(id: string, dados: any, usuarioId: string) {
    this.cache.clear();
    return this.proximo.editar(id, dados, usuarioId);
  }

  async deletar(id: string, usuarioId: string) {
    this.cache.clear();
    return this.proximo.deletar(id, usuarioId);
  }
}
