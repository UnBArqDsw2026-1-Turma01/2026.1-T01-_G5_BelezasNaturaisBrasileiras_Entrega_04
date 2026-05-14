import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { PromoteUserInput } from '../dtos/PromoteUserInput';
import { PromoteUserOutput } from '../dtos/PromoteUserOutput';

@Injectable()
export class PromoteUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private userRepository: IUserRepository,
  ) {}

  async execute(input: PromoteUserInput): Promise<PromoteUserOutput> {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Padrão Prototype: Clona o objeto imutável alterando apenas a role
    const promotedUser = user.clone({
      role: input.newRole,
      updatedAt: new Date(),
    });

    const savedUser = await this.userRepository.update(promotedUser);

    return {
      id: savedUser.id,
      email: savedUser.email,
      nome: savedUser.nome,
      role: savedUser.role,
      promotedAt: savedUser.updatedAt,
    };
  }
}
