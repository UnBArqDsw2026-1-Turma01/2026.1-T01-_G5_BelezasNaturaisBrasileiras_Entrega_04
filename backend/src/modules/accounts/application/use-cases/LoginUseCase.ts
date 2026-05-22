import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { ISupabaseAuthService } from '../../domain/interfaces/ISupabaseAuthService';
import type { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { LoginInput } from '../dtos/LoginInput';
import { LoginOutput } from '../dtos/LoginOutput';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('ISupabaseAuthService')
    private supabaseAuthService: ISupabaseAuthService,
    @Inject('IUserRepository')
    private userRepository: IUserRepository,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    try {
      const { uid } = await this.supabaseAuthService.signIn(
        input.email,
        input.password,
      );

      const user = await this.userRepository.findByEmail(input.email);
      if (!user) {
        throw new Error('Usuário não encontrado no banco de dados local.');
      }

      // Sign a local JWT that matches what our JwtStrategy expects
      const payload = {
        sub: uid,
        email: user.email,
        role: user.role,
      };

      const access_token = jwt.sign(
        payload,
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' }
      );

      return { access_token };
    } catch (error) {
      throw new BadRequestException(
        `Falha ao realizar login: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
