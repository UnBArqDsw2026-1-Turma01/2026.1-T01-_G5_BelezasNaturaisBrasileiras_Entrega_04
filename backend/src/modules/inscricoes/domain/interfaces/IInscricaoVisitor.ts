import { Inscricao } from '../entities/Inscricao';

/**
 * Visitor Pattern — Interface do Visitante
 *
 * Define uma operação a ser executada sobre cada tipo de Inscricao.
 * Permite adicionar novas operações nas inscrições sem modificar a classe Inscricao.
 */
export interface IInscricaoVisitor {
  visitPresente(inscricao: Inscricao): Promise<void>;
  visitAceita(inscricao: Inscricao): Promise<void>;
  visitRejeitada(inscricao: Inscricao): Promise<void>;
  visitPendente(inscricao: Inscricao): Promise<void>;
}
