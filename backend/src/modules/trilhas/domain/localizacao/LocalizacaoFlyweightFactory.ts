import { LocalizacaoFolha } from './LocalizacaoFolha';

/**
 * Flyweight Pattern — Fábrica de Flyweights
 *
 * Gerencia um cache de instâncias de LocalizacaoFolha. Como muitas trilhas
 * podem passar pelos mesmos pontos turísticos (ex: "Chapada dos Veadeiros",
 * "Parque Nacional de Brasília"), criar um objeto novo a cada requisição
 * seria um desperdício de memória.
 *
 * Estado intrínseco (compartilhado/imutável): nome + descricao do ponto.
 * Estado extrínseco (varia por contexto): a posição na árvore Composite
 * de cada trilha — mantido pela própria LocalizacaoComposita, fora daqui.
 */
export class LocalizacaoFlyweightFactory {
  private static readonly cache = new Map<string, LocalizacaoFolha>();

  /**
   * Retorna a instância cacheada para (nome, descricao) ou cria uma nova
   * e a armazena antes de retornar.
   */
  static get(nome: string, descricao: string = ''): LocalizacaoFolha {
    const chave = `${nome}::${descricao}`;
    if (!this.cache.has(chave)) {
      this.cache.set(chave, new LocalizacaoFolha(nome, descricao));
    }
    return this.cache.get(chave)!;
  }

  /** Número de instâncias únicas atualmente em cache. */
  static get totalInstancias(): number {
    return this.cache.size;
  }

  /** Limpa o cache (útil em testes). */
  static limparCache(): void {
    this.cache.clear();
  }
}
