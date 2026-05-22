import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ITrilhaRepository } from '../../domain/interfaces/ITrilhaRepository';
import { Trilha } from '../../domain/entities/Trilha';
import { CriarTrilhaInput } from '../dtos/CriarTrilhaInput';
import { TrilhaBuilder } from '../../domain/builders/TrilhaBuilder';

@Injectable()
export class CriarTrilhaUseCase {
  constructor(
    @Inject('ITrilhaRepository')
    private readonly trilhaRepository: ITrilhaRepository,
  ) {}

  async execute(
    organizadorId: string,
    input: CriarTrilhaInput,
  ): Promise<Trilha> {
    const trilha = new TrilhaBuilder()
      .withId(randomUUID())
      .withTitulo(input.titulo)
      .withDescricao(input.descricao)
      .withOrganizadorId(organizadorId)
      .withPontoEncontro(input.pontoEncontro)
      .withDataInicio(new Date(input.dataInicio))
      .withVagasMaximas(input.vagasMaximas)
      .build();

    return this.trilhaRepository.create(trilha);
  }
}
