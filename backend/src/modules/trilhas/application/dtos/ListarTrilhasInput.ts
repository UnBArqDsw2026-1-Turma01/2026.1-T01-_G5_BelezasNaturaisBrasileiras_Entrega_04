import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { TrilhaStatus } from '../../domain/enums/TrilhaStatus';
import { TrilhaOrdenacaoTipo } from '../../domain/strategies/ITrilhaOrdenacaoStrategy';

export class ListarTrilhasInput {
  @IsOptional()
  @IsEnum(TrilhaStatus)
  status?: TrilhaStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  pageSize?: number;

  @IsOptional()
  @IsEnum(TrilhaOrdenacaoTipo)
  ordenarPor?: TrilhaOrdenacaoTipo;
}
