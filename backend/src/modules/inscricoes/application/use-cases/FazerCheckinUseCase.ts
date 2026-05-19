import {
  Injectable,
  Inject,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { IInscricaoRepository } from '../../domain/interfaces/IInscricaoRepository';
import { ITrilhaRepository } from '../../../trilhas/domain/interfaces/ITrilhaRepository';
import { ConfirmationCodeService } from '../../../trilhas/domain/services/ConfirmationCodeService';
import { Inscricao } from '../../domain/entities/Inscricao';

@Injectable()
export class FazerCheckinUseCase {
  constructor(
    @Inject('IInscricaoRepository')
    private readonly inscricaoRepository: IInscricaoRepository,
    @Inject('ITrilhaRepository')
    private readonly trilhaRepository: ITrilhaRepository,
    private readonly confirmationCodeService: ConfirmationCodeService,
  ) {}

  async execute(
    inscricaoId: string,
    organizadorId: string,
    codigo: string,
  ): Promise<Inscricao> {
    const inscricao = await this.inscricaoRepository.findById(inscricaoId);
    if (!inscricao) throw new NotFoundException('Inscrição não encontrada');

    const trilha = await this.trilhaRepository.findById(inscricao.trilhaId);
    if (!trilha) throw new NotFoundException('Trilha não encontrada');
    if (trilha.organizadorId !== organizadorId) {
      throw new ForbiddenException('Apenas o organizador pode fazer check-in');
    }

    if (inscricao.codigoConfirmacao !== codigo) {
      throw new BadRequestException('Código de confirmação inválido');
    }

    inscricao.fazerCheckin();
    this.confirmationCodeService.revogarCodigo(codigo);

    return this.inscricaoRepository.save(inscricao);
  }
}
