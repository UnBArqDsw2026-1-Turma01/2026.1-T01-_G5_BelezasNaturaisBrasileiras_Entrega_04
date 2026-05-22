import { InscricaoStatus } from '../enums/InscricaoStatus';
import { IInscricaoVisitor } from '../interfaces/IInscricaoVisitor';

export class Inscricao {
  id: string;
  trilhaId: string;
  usuarioId: string;
  status: InscricaoStatus;
  codigoConfirmacao: string | null;
  solicitadoEm: Date;
  aceitoEm: Date | null;
  checkinEm: Date | null;
  usuarioNome?: string;

  constructor(
    id: string,
    trilhaId: string,
    usuarioId: string,
    status: InscricaoStatus = InscricaoStatus.PENDENTE,
    codigoConfirmacao: string | null = null,
    solicitadoEm: Date = new Date(),
    aceitoEm: Date | null = null,
    checkinEm: Date | null = null,
    usuarioNome?: string,
  ) {
    this.id = id;
    this.trilhaId = trilhaId;
    this.usuarioId = usuarioId;
    this.status = status;
    this.codigoConfirmacao = codigoConfirmacao;
    this.solicitadoEm = solicitadoEm;
    this.aceitoEm = aceitoEm;
    this.checkinEm = checkinEm;
    this.usuarioNome = usuarioNome;
  }

  aceitar(codigo: string): void {
    if (this.status !== InscricaoStatus.PENDENTE) {
      throw new Error('Apenas inscrições pendentes podem ser aceitas');
    }
    this.status = InscricaoStatus.ACEITA;
    this.codigoConfirmacao = codigo;
    this.aceitoEm = new Date();
  }

  rejeitar(): void {
    if (this.status !== InscricaoStatus.PENDENTE) {
      throw new Error('Apenas inscrições pendentes podem ser rejeitadas');
    }
    this.status = InscricaoStatus.REJEITADA;
  }

  fazerCheckin(): void {
    if (this.status !== InscricaoStatus.ACEITA) {
      throw new Error('Apenas inscrições aceitas podem fazer check-in');
    }
    this.status = InscricaoStatus.PRESENTE;
    this.checkinEm = new Date();
  }

  async accept(visitor: IInscricaoVisitor): Promise<void> {
    switch (this.status) {
      case InscricaoStatus.PRESENTE:
        return visitor.visitPresente(this);
      case InscricaoStatus.ACEITA:
        return visitor.visitAceita(this);
      case InscricaoStatus.REJEITADA:
        return visitor.visitRejeitada(this);
      case InscricaoStatus.PENDENTE:
        return visitor.visitPendente(this);
    }
  }
}
