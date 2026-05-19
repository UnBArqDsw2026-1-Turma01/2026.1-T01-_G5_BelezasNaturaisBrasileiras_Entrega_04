import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../accounts/auth/guards/jwt-auth.guard';
import { JwtRequest } from '../../../accounts/auth/types/jwt-request.type';
import { ConfirmationCodeService } from '../../domain/services/ConfirmationCodeService';
import { TrilhaEventEmitter } from '../../domain/observers/TrilhaEventEmitter';
import { IBadgeRepository } from '../../domain/interfaces/IBadgeRepository';
import { ListarInscricoesUseCase } from '../../../inscricoes/application/use-cases/ListarInscricoesUseCase';
import { TrilhaFacade } from '../../application/TrilhaFacade';
import { TrilhaRequestContext } from '../../domain/services/TrilhaRequestContext';
import { LocalizacaoComposita } from '../../domain/localizacao/LocalizacaoComposita';
import { LocalizacaoFolha } from '../../domain/localizacao/LocalizacaoFolha';
import { ValidarCodigoInput } from '../../application/dtos/ValidarCodigoInput';
import { LocalizacaoInput } from '../../application/dtos/LocalizacaoInput';
import { CriarTrilhaInput } from '../../application/dtos/CriarTrilhaInput';

@Controller('trilhas')
export class TrilhasController {
  constructor(
    private readonly trilhaFacade: TrilhaFacade,
    private readonly confirmationCodeService: ConfirmationCodeService,
    private readonly trilhaEventEmitter: TrilhaEventEmitter,
    @Inject('IBadgeRepository')
    private readonly badgeRepository: IBadgeRepository,
    private readonly listarInscricoesUseCase: ListarInscricoesUseCase,
    private readonly requestContext: TrilhaRequestContext,
  ) {}

  // ─── CRUD TRILHA ──────────────────────────────────────────────────────────

  @Get()
  listar() {
    return this.trilhaFacade.listar();
  }

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  criar(@Request() req: JwtRequest, @Body() body: CriarTrilhaInput) {
    return this.trilhaFacade.criar(req.user.userId, body);
  }

  @Get(':id/inscricoes')
  @UseGuards(JwtAuthGuard)
  listarInscricoes(@Param('id') trilhaId: string) {
    return this.listarInscricoesUseCase.porTrilha(trilhaId);
  }

  @Post(':id/finalizar')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async finalizar(@Param('id') trilhaId: string, @Request() req: JwtRequest) {
    await this.requestContext.run(req.user.userId, () =>
      this.trilhaFacade.finalizar(trilhaId, req.user.userId),
    );
    return { mensagem: 'Trilha finalizada com sucesso.' };
  }

  @Post('codigos/gerar')
  gerarCodigo() {
    const codigo = this.confirmationCodeService.gerarCodigo();
    return { codigo };
  }

  @Post('codigos/validar')
  validarCodigo(@Body() body: ValidarCodigoInput) {
    return {
      codigo: body.codigo,
      valido: this.confirmationCodeService.validarCodigo(body.codigo),
    };
  }

  @Post('localizacao/pontos')
  contarPontosComComposite(@Body() body: LocalizacaoInput) {
    const estado = new LocalizacaoComposita(body.estado, 'estado');
    const cidades = body.cidades.map((c) => {
      const cidade = new LocalizacaoComposita(c.nome, 'cidade');
      c.pontos.forEach((nome) => cidade.adicionar(new LocalizacaoFolha(nome)));
      estado.adicionar(cidade);
      return {
        cidade: c.nome,
        quantidadePontos: cidade.getQuantidadePontos(),
        pontos: c.pontos,
      };
    });
    return {
      estado: body.estado,
      totalPontos: estado.getQuantidadePontos(),
      cidades,
    };
  }

  @Get('badges/minhas')
  @UseGuards(JwtAuthGuard)
  meusBadges(@Request() req: JwtRequest) {
    return this.badgeRepository.findByParticipanteId(req.user.userId);
  }

  @Get('status')
  status() {
    return {
      codigosAtivos: this.confirmationCodeService.totalCodigosAtivos,
      observadoresAtivos: this.trilhaEventEmitter.totalObservadores,
    };
  }
}
