import { FiltroDecoratorBase } from './FiltroDecoratorBase';
import type { IBuscaPontos } from './IBuscaPontos';

export class FiltroEstado extends FiltroDecoratorBase {
  constructor(anterior: IBuscaPontos, private readonly uf: string) {
    super(anterior);
  }

  construirWhere(): Record<string, any> {
    return { ...super.construirWhere(), estado: this.uf };
  }
}
