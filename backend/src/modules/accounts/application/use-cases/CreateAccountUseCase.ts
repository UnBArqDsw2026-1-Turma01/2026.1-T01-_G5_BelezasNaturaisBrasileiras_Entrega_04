import { Injectable, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../domain/interfaces/IUserRepository';
import type { ISupabaseAuthService } from '../../domain/interfaces/ISupabaseAuthService';
import type { IUserFactoryRegistry } from '../../domain/interfaces/IUserFactoryRegistry';
import { CreateAccountInput } from '../dtos/CreateAccountInput';
import { CreateAccountOutput } from '../dtos/CreateAccountOutput';
import { UserRole } from '../../domain/entities/User';
import { UserMapper } from '../../infrastructure/mappers/UserMapper';

@Injectable()
export class CreateAccountUseCase {
  constructor(
    @Inject('IUserRepository')
    private userRepository: IUserRepository,
    @Inject('ISupabaseAuthService')
    private supabaseAuthService: ISupabaseAuthService,
    @Inject('IUserFactoryRegistry')
    private userFactoryRegistry: IUserFactoryRegistry,
  ) {}

  async execute(input: CreateAccountInput): Promise<CreateAccountOutput> {
    let supabaseUser: { uid: string };
    try {
      supabaseUser = await this.supabaseAuthService.createUser(
        input.email,
        input.password,
      );
    } catch (error) {
      throw new Error(
        `Falha ao criar usuário no Supabase: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    const factory = this.userFactoryRegistry.get(UserRole.COMMON_USER);
    const user = factory.create(supabaseUser.uid, input.email, input.nome);

    try {
      const savedUser = await this.userRepository.save(user);
      return UserMapper.toPersistence(savedUser);
    } catch (error) {
      try {
        await this.supabaseAuthService.deleteUser(supabaseUser.uid);
      } catch (rollbackError) {
        console.error(
          `Erro ao fazer rollback no Supabase: ${rollbackError instanceof Error ? rollbackError.message : String(rollbackError)}`,
        );
      }
      throw new Error(
        `Falha ao salvar usuário no banco de dados: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
