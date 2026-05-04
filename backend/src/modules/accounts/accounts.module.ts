import { Module } from '@nestjs/common';
import { AccountController } from './interface/controllers/AccountController';
import { CreateAccountUseCase } from './application/use-cases/CreateAccountUseCase';
import { PrismaUserRepository } from './infrastructure/persistence/PrismaUserRepository';
import { SupabaseAuthService } from './infrastructure/services/SupabaseAuthService';
import { userFactoryProviders } from './interface/providers/UserFactoryProvider';
import { supabaseProvider } from '../../shared/infrastructure/supabase/supabase.provider';

@Module({
  controllers: [AccountController],
  providers: [
    supabaseProvider,
    CreateAccountUseCase,
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
