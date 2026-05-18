import { Injectable, Inject, ForbiddenException, Logger } from '@nestjs/common';
import type { IUserRepository } from '../../../accounts/domain/interfaces/IUserRepository';
import type { IPontosTuristicosService } from '../../domain/interfaces/IPontosTuristicosService';
import { UserRole } from '../../../accounts/domain/entities/User';

@Injectable()
export class PontosAuthProxy implements IPontosTuristicosService {
  private readonly logger = new Logger('PontosAuthProxy');

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
    try {
      const usuario = await this.userRepository.findByEmail(usuarioId);
      if (!usuario) {
        if (process.env.DEV_ALLOW_ANON_USER !== 'true') {
          throw new ForbiddenException('Usuário não encontrado.');
        }
        this.logger.warn('Usuário não encontrado — permitindo criação em ambiente de desenvolvimento');
      }
    } catch (err) {
      this.logger.warn('Erro ao consultar repositório de usuários — ' + (process.env.DEV_ALLOW_ANON_USER === 'true' ? 'permitindo criação em ambiente de desenvolvimento' : 'bloqueando operação'));
      if (process.env.DEV_ALLOW_ANON_USER !== 'true') {
        throw new ForbiddenException('Erro ao verificar usuário.');
      }
    }
    return this.servico.criar(dados, usuarioId);
  }

  async editar(id: string, dados: any, usuarioId: string) {
    try {
      const usuario = await this.userRepository.findByEmail(usuarioId);
      if (!usuario) {
        if (process.env.DEV_ALLOW_ANON_USER !== 'true') {
          throw new ForbiddenException('Usuário não encontrado.');
        }
        this.logger.warn('Usuário não encontrado — permitindo edição em ambiente de desenvolvimento');
      }
    } catch (err) {
      this.logger.warn('Erro ao consultar repositório de usuários — ' + (process.env.DEV_ALLOW_ANON_USER === 'true' ? 'permitindo edição em ambiente de desenvolvimento' : 'bloqueando operação'));
      if (process.env.DEV_ALLOW_ANON_USER !== 'true') {
        throw new ForbiddenException('Erro ao verificar usuário.');
      }
    }
    return this.servico.editar(id, dados, usuarioId);
  }

  async deletar(id: string, usuarioId: string) {
    try {
      const usuario = await this.userRepository.findByEmail(usuarioId);
      if (usuario) {
        if (usuario.role !== UserRole.ADMIN) {
          throw new ForbiddenException('Apenas administradores podem excluir pontos turísticos.');
        }
      } else {
        if (process.env.DEV_ALLOW_ANON_USER !== 'true') {
          throw new ForbiddenException('Usuário não encontrado.');
        }
        this.logger.warn('Usuário não encontrado — permitindo deleção em ambiente de desenvolvimento');
      }
    } catch (err) {
      this.logger.warn('Erro ao consultar repositório de usuários — ' + (process.env.DEV_ALLOW_ANON_USER === 'true' ? 'permitindo deleção em ambiente de desenvolvimento' : 'bloqueando operação'));
      if (process.env.DEV_ALLOW_ANON_USER !== 'true') {
        throw new ForbiddenException('Erro ao verificar usuário.');
      }
    }
    return this.servico.deletar(id, usuarioId);
  }
}
