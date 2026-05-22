import { Trilha } from '../entities/Trilha';
import { TrilhaStatus } from '../enums/TrilhaStatus';

export class TrilhaBuilder {
  private id?: string;
  private titulo?: string;
  private descricao?: string;
  private organizadorId?: string;
  private pontoEncontro?: string;
  private dataInicio?: Date;
  private vagasMaximas?: number;
  private status: TrilhaStatus = TrilhaStatus.ATIVA;
  private createdAt: Date = new Date();
  private updatedAt: Date = new Date();

  withId(id: string): TrilhaBuilder {
    this.id = id;
    return this;
  }

  withTitulo(titulo: string): TrilhaBuilder {
    this.titulo = titulo;
    return this;
  }

  withDescricao(descricao: string): TrilhaBuilder {
    this.descricao = descricao;
    return this;
  }

  withOrganizadorId(organizadorId: string): TrilhaBuilder {
    this.organizadorId = organizadorId;
    return this;
  }

  withPontoEncontro(pontoEncontro: string): TrilhaBuilder {
    this.pontoEncontro = pontoEncontro;
    return this;
  }

  withDataInicio(dataInicio: Date): TrilhaBuilder {
    this.dataInicio = dataInicio;
    return this;
  }

  withVagasMaximas(vagasMaximas: number): TrilhaBuilder {
    this.vagasMaximas = vagasMaximas;
    return this;
  }

  withStatus(status: TrilhaStatus): TrilhaBuilder {
    this.status = status;
    return this;
  }

  withCreatedAt(createdAt: Date): TrilhaBuilder {
    this.createdAt = createdAt;
    return this;
  }

  withUpdatedAt(updatedAt: Date): TrilhaBuilder {
    this.updatedAt = updatedAt;
    return this;
  }

  build(): Trilha {
    if (
      !this.id ||
      !this.titulo ||
      !this.descricao ||
      !this.organizadorId ||
      !this.pontoEncontro ||
      !this.dataInicio ||
      this.vagasMaximas === undefined
    ) {
      throw new Error('Campos obrigatorios ausentes no TrilhaBuilder');
    }

    return new Trilha(
      this.id,
      this.titulo,
      this.descricao,
      this.organizadorId,
      this.pontoEncontro,
      this.dataInicio,
      this.vagasMaximas,
      this.status,
      this.createdAt,
      this.updatedAt,
    );
  }
}
