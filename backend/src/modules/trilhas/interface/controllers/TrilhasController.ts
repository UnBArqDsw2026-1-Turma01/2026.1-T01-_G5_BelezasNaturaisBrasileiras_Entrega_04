import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Query,
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
import { EditarTrilhaInput } from '../../application/dtos/EditarTrilhaInput';
import { ListarTrilhasInput } from '../../application/dtos/ListarTrilhasInput';
import { Trilha } from '../../domain/entities/Trilha';
import { RolesGuard } from '../../../accounts/auth/guards/roles.guard';
import { Roles } from '../../../accounts/auth/decorators/roles.decorator';
import { Role } from '../../../accounts/auth/enums/role.enum';

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
  listar(@Query() input: ListarTrilhasInput) {
    return this.trilhaFacade.listar(input);
  }

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  criar(@Request() req: JwtRequest, @Body() body: CriarTrilhaInput) {
    return this.trilhaFacade.criar(req.user.userId, body);
  }

  @Patch(':id')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  editar(
    @Param('id') id: string,
    @Body() body: EditarTrilhaInput,
    @Request() req: JwtRequest,
  ): Promise<Trilha> {
    return this.requestContext.run(req.user.userId, () =>
      this.trilhaFacade.editar(id, req.user.userId, body),
    );
  }

  @Get(':id/inscricoes')
  @UseGuards(JwtAuthGuard)
  listarInscricoes(@Param('id') trilhaId: string) {
    return this.listarInscricoesUseCase.porTrilha(trilhaId);
  }

  @Post(':id/finalizar')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  async finalizar(@Param('id') trilhaId: string, @Request() req: JwtRequest) {
    await this.requestContext.run(req.user.userId, () =>
      this.trilhaFacade.finalizar(trilhaId, req.user.userId),
    );
    return { mensagem: 'Trilha finalizada com sucesso.' };
  }

  @Post(':id/restaurar')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  async restaurar(@Param('id') trilhaId: string, @Request() req: JwtRequest) {
    const trilha = await this.requestContext.run(req.user.userId, () =>
      this.trilhaFacade.restaurar(trilhaId, req.user.userId),
    );
    return { mensagem: 'Estado anterior da trilha restaurado.', trilha };
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

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.trilhaFacade.buscarPorId(id);
  }
}
