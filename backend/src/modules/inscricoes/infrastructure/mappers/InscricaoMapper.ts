import { Inscricao } from '../../domain/entities/Inscricao';
import { InscricaoStatus } from '../../domain/enums/InscricaoStatus';

type InscricaoRaw = {
  id: string;
  trilhaId: string;
  usuarioId: string;
  status: string;
  codigoConfirmacao: string | null;
  solicitadoEm: Date;
  aceitoEm: Date | null;
  checkinEm: Date | null;
  usuario?: { nome: string } | null;
};

export class InscricaoMapper {
  static toDomain(raw: InscricaoRaw): Inscricao {
    return new Inscricao(
      raw.id,
      raw.trilhaId,
      raw.usuarioId,
      raw.status as InscricaoStatus,
      raw.codigoConfirmacao,
      raw.solicitadoEm,
      raw.aceitoEm,
      raw.checkinEm,
      raw.usuario?.nome,
    );
  }

  static toPersistence(inscricao: Inscricao): Omit<InscricaoRaw, 'usuario'> {
    return {
      id: inscricao.id,
      trilhaId: inscricao.trilhaId,
      usuarioId: inscricao.usuarioId,
      status: inscricao.status,
      codigoConfirmacao: inscricao.codigoConfirmacao,
      solicitadoEm: inscricao.solicitadoEm,
      aceitoEm: inscricao.aceitoEm,
      checkinEm: inscricao.checkinEm,
    };
  }
}
