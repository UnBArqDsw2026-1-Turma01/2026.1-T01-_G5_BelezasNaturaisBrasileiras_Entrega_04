import { Injectable, Inject, ForbiddenException } from '@nestjs/common';
import type { IUserRepository } from '../../../accounts/domain/interfaces/IUserRepository';
import type { IPontosTuristicosService } from '../../domain/interfaces/IPontosTuristicosService';
import { UserRole } from '../../../accounts/domain/entities/User';

@Injectable()
export class PontosAuthProxy implements IPontosTuristicosService {
  constructor(
    private readonly servico: IPontosTuristicosService,
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async buscarFeed(filtros: Record<string, any>) {
    // Feed é público — passa direto
    return this.servico.buscarFeed(filtros);
  }

  async criar(dados: any, usuarioId: string) {
    const usuario = await this.userRepository.findByEmail(usuarioId);
    if (!usuario) throw new ForbiddenException('Usuário não encontrado.');
    return this.servico.criar(dados, usuarioId);
  }

  async editar(id: string, dados: any, usuarioId: string) {
    const usuario = await this.userRepository.findByEmail(usuarioId);
    if (!usuario) throw new ForbiddenException('Usuário não encontrado.');
    return this.servico.editar(id, dados, usuarioId);
  }

  async deletar(id: string, usuarioId: string) {
    const usuario = await this.userRepository.findByEmail(usuarioId);
    if (usuario?.role !== UserRole.ADMIN) {
      throw new ForbiddenException(
        'Apenas administradores podem excluir pontos turísticos.',
      );
    }
    return this.servico.deletar(id, usuarioId);
  }
}
