import { FiltroDecoratorBase } from './FiltroDecoratorBase';
import type { IBuscaPontos } from './IBuscaPontos';

export class FiltroCidade extends FiltroDecoratorBase {
  constructor(anterior: IBuscaPontos, private readonly cidade: string) {
    super(anterior);
  }

  construirWhere(): Record<string, any> {
    return { ...super.construirWhere(), cidade: this.cidade };
  }
}
