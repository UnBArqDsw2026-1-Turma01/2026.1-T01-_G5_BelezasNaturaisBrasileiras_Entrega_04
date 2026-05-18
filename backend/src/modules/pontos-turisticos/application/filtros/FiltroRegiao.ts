import { FiltroDecoratorBase } from './FiltroDecoratorBase';
import type { IBuscaPontos } from './IBuscaPontos';

export class FiltroRegiao extends FiltroDecoratorBase {
  constructor(anterior: IBuscaPontos, private readonly regiao: string) {
    super(anterior);
  }

  construirWhere(): Record<string, any> {
    return { ...super.construirWhere(), regiao: this.regiao };
  }
}
