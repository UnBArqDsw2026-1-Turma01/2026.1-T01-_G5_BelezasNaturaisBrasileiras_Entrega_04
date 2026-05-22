import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AccountController } from './interface/controllers/AccountController';
import { CreateAccountUseCase } from './application/use-cases/CreateAccountUseCase';
import { LoginUseCase } from './application/use-cases/LoginUseCase';
import { PromoteUserUseCase } from './application/use-cases/PromoteUserUseCase';
import { PrismaUserRepository } from './infrastructure/persistence/PrismaUserRepository';
import { SupabaseAuthService } from './infrastructure/services/SupabaseAuthService';
import { userFactoryProviders } from './interface/providers/UserFactoryProvider';
import { supabaseProvider } from '../../shared/infrastructure/supabase/supabase.provider';
import { PrismaService } from '../../shared/infrastructure/prisma/prisma.service';
import { JwtStrategy } from './auth/strategies/jwt.strategy';

@Module({
  imports: [PassportModule],
  controllers: [AccountController],
  providers: [
    PrismaService,
    JwtStrategy,
    supabaseProvider,
    CreateAccountUseCase,
    LoginUseCase,
    PromoteUserUseCase,
    {
      provide: 'IUserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'ISupabaseAuthService',
      useClass: SupabaseAuthService,
    },
    ...userFactoryProviders,
  ],
  exports: ['IUserRepository', 'IUserFactoryRegistry'],
})
export class AccountsModule {}
