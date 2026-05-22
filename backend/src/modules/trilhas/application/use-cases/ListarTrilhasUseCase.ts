import { Injectable, Inject } from '@nestjs/common';
import { ITrilhaRepository } from '../../domain/interfaces/ITrilhaRepository';
import { Trilha } from '../../domain/entities/Trilha';
import { TrilhaFilteredIterator } from '../../domain/iterators/TrilhaFilteredIterator';
import { TrilhaPaginatedIterator } from '../../domain/iterators/TrilhaPaginatedIterator';
import { ListarTrilhasInput } from '../dtos/ListarTrilhasInput';
import { TrilhaOrdenacaoContext } from '../../domain/strategies/TrilhaOrdenacaoContext';

@Injectable()
export class ListarTrilhasUseCase {
  constructor(
    @Inject('ITrilhaRepository')
    private readonly trilhaRepository: ITrilhaRepository,
    private readonly ordenacaoContext: TrilhaOrdenacaoContext,
  ) {}

  async execute(input: ListarTrilhasInput = {}): Promise<Trilha[]> {
    const all = await this.trilhaRepository.findAll();
    const filtered = new TrilhaFilteredIterator(all, input.status);
    const result: Trilha[] = [];
    while (filtered.hasNext()) result.push(filtered.next());

    const ordered = this.ordenacaoContext.ordenar(result, input.ordenarPor);

    if (input.page !== undefined && input.pageSize !== undefined) {
      const paginated = new TrilhaPaginatedIterator(
        ordered,
        input.page,
        input.pageSize,
      );
      const page: Trilha[] = [];
      while (paginated.hasNext()) page.push(paginated.next());
      return page;
    }

    return ordered;
  }
}
