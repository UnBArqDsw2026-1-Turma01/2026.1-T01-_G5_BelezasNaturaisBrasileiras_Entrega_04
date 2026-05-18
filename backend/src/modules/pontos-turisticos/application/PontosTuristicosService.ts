import { Injectable, NotFoundException } from '@nestjs/common';
import type { IPontosTuristicosService } from '../domain/interfaces/IPontosTuristicosService';
import type { PrismaPontosRepository } from '../infrastructure/persistence/PrismaPontosRepository';
import { BuscaBase } from './filtros/BuscaBase';
import { FiltroRegiao } from './filtros/FiltroRegiao';
import { FiltroEstado } from './filtros/FiltroEstado';
import { FiltroCidade } from './filtros/FiltroCidade';
import { FiltroTipo } from './filtros/FiltroTipo';
import type { IBuscaPontos } from './filtros/IBuscaPontos';

interface PontoDTO {
  id: string;
  titulo?: string;
  descricao?: string;
  regiao?: string;
  estado?: string;
  cidade?: string;
  tipo?: string;
  criadoPor?: string;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: any;
}

@Injectable()
export class PontosTuristicosService implements IPontosTuristicosService {
  private readonly storage = new Map<string, PontoDTO>();

  constructor(private readonly repository?: PrismaPontosRepository) {}

  private async buscarFeedRepo(filtros: Record<string, any>) {
    if (!this.repository) throw new Error('No repository');
    return this.repository.buscarFeed(filtros);
  }

  private async criarRepo(dados: any, usuarioId: string) {
    if (!this.repository) throw new Error('No repository');
    return this.repository.criar(dados, usuarioId);
  }

  private async editarRepo(id: string, dados: any, usuarioId: string) {
    if (!this.repository) throw new Error('No repository');
    return this.repository.editar(id, dados, usuarioId);
  }

  private async deletarRepo(id: string, usuarioId: string) {
    if (!this.repository) throw new Error('No repository');
    return this.repository.deletar(id, usuarioId);
  }

  async buscarFeed(filtros: Record<string, any>): Promise<any[]> {
    let busca: IBuscaPontos = new BuscaBase();
    if (filtros?.regiao) busca = new FiltroRegiao(busca, filtros.regiao);
    if (filtros?.uf)     busca = new FiltroEstado(busca, filtros.uf);
    if (filtros?.cidade) busca = new FiltroCidade(busca, filtros.cidade);
    if (filtros?.tipo)   busca = new FiltroTipo(busca, filtros.tipo);

    const where = busca.construirWhere();

    if (this.repository) {
      try {
        return await this.buscarFeedRepo(where);
      } catch (e) {
        // fallback to in-memory on repository failure
      }
    }

    const all = Array.from(this.storage.values());
    if (Object.keys(where).length === 0) return all;

    return all.filter((p) => {
      return Object.entries(where).every(([k, v]) => p[k] === v);
    });
  }

  async criar(dados: any, usuarioId: string): Promise<any> {
    if (this.repository) {
      try {
        return await this.criarRepo(dados, usuarioId);
      } catch (e) {
        // fallback
      }
    }

    const id = String(Date.now()) + Math.floor(Math.random() * 1000);
    const registro: PontoDTO = { id, ...dados, criadoPor: usuarioId, createdAt: new Date(), updatedAt: new Date() };
    this.storage.set(id, registro);
    return registro;
  }

  async editar(id: string, dados: any, usuarioId: string): Promise<any> {
    if (this.repository) {
      try {
        return await this.editarRepo(id, dados, usuarioId);
      } catch (e) {
        // fallback
      }
    }

    const existing = this.storage.get(id);
    if (!existing) throw new NotFoundException('Ponto não encontrado');
    const atualizado = { ...existing, ...dados, updatedBy: usuarioId, updatedAt: new Date() };
    this.storage.set(id, atualizado);
    return atualizado;
  }

  async deletar(id: string, usuarioId: string): Promise<void> {
    if (this.repository) {
      try {
        return await this.deletarRepo(id, usuarioId);
      } catch (e) {
        // fallback
      }
    }

    const existing = this.storage.get(id);
    if (!existing) throw new NotFoundException('Ponto não encontrado');
    this.storage.delete(id);
  }
}
