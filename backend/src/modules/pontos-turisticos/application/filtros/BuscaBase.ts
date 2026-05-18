import type { IBuscaPontos } from './IBuscaPontos';

export class BuscaBase implements IBuscaPontos {
  construirWhere(): Record<string, any> {
    return {};
  }
}
