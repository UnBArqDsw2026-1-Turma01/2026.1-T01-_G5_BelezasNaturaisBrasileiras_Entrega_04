import type { IBuscaPontos } from './IBuscaPontos';

export abstract class FiltroDecoratorBase implements IBuscaPontos {
  constructor(protected readonly anterior: IBuscaPontos) {}

  construirWhere(): Record<string, any> {
    return this.anterior.construirWhere();
  }
}
