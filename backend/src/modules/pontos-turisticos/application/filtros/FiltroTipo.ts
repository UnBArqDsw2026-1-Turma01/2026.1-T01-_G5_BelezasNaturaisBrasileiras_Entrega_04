import { FiltroDecoratorBase } from './FiltroDecoratorBase';
import type { IBuscaPontos } from './IBuscaPontos';

export class FiltroTipo extends FiltroDecoratorBase {
  constructor(anterior: IBuscaPontos, private readonly tipo: string) {
    super(anterior);
  }

  construirWhere(): Record<string, any> {
    return { ...super.construirWhere(), tipo: this.tipo };
  }
}
