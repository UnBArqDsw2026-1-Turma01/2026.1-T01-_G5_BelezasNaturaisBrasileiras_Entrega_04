import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject } from '@nestjs/common';
import type { IPontosTuristicosService } from '../../domain/interfaces/IPontosTuristicosService';

@Controller('pontos-turisticos')
export class PontosTuristicosController {
  constructor(
    @Inject('PONTOS_SERVICE')
    private readonly service: IPontosTuristicosService,
  ) {}

  @Get()
  buscarFeed(@Query() filtros: Record<string, any>) {
    return this.service.buscarFeed(filtros || {});
  }

  @Post()
  criar(@Body() dados: any) {
    const usuarioId = 'extraído do JWT'; // substituir por decorator @CurrentUser
    return this.service.criar(dados, usuarioId);
  }

  @Put(':id')
  editar(@Param('id') id: string, @Body() dados: any) {
    const usuarioId = 'extraído do JWT';
    return this.service.editar(id, dados, usuarioId);
  }

  @Delete(':id')
  deletar(@Param('id') id: string) {
    const usuarioId = 'extraído do JWT';
    return this.service.deletar(id, usuarioId);
  }
}
