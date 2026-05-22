import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject, Headers } from '@nestjs/common';
import type { IPontosTuristicosService } from '../../domain/interfaces/IPontosTuristicosService';
import { TrailLifecycleMediatorService } from '../../mediator/trail-lifecycle-mediator.service';

@Controller('pontos-turisticos')
export class PontosTuristicosController {
  constructor(
    @Inject('PONTOS_SERVICE')
    private readonly service: IPontosTuristicosService,
    private readonly mediator: TrailLifecycleMediatorService,
  ) {}

  @Get()
  buscarFeed(@Query() filtros: Record<string, any>) {
    return this.service.buscarFeed(filtros || {});
  }

  @Get(':id')
  buscarPorId(@Param('id') id: string) {
    return this.service.buscarPorId(id);
  }

  @Post()
  criar(@Body() dados: any, @Headers('x-user-email') userEmail?: string) {
    const usuarioId = userEmail || 'extraído do JWT'; // header X-User-Email overrides JWT for testing
    return this.service.criar(dados, usuarioId);
  }

  @Put(':id')
  editar(@Param('id') id: string, @Body() dados: any, @Headers('x-user-email') userEmail?: string) {
    const usuarioId = userEmail || 'extraído do JWT';
    return this.service.editar(id, dados, usuarioId);
  }

  @Delete(':id')
  async deletar(@Param('id') id: string, @Headers('x-user-email') userEmail?: string) {
    const usuarioId = userEmail || 'extraído do JWT';
    await this.service.deletar(id, usuarioId);
    return { message: 'Ponto turístico removido com sucesso' };
  }

  @Post(':id/finalizar')
  finalizar(
    @Param('id') id: string,
    @Headers('x-user-id') actorId?: string,
  ) {
    return this.mediator.finishTrail(id, actorId || 'system');
  }
}
