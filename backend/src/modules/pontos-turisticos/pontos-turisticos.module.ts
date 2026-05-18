import { Module } from '@nestjs/common';
import { PontosTuristicosService } from './application/PontosTuristicosService';
import { PontosAuthProxy } from './interface/proxies/PontosAuthProxy';
import { PontosCacheProxy } from './interface/proxies/PontosCacheProxy';
import { PontosTuristicosController } from './interface/controllers/PontosTuristicosController';
import { PrismaService } from '../../shared/infrastructure/prisma/prisma.service';
import { AccountsModule } from '../accounts/accounts.module';

import { BuscarFeedUseCase } from './application/use-cases/BuscarFeedUseCase';
import { CriarPontoUseCase } from './application/use-cases/CriarPontoUseCase';
import { EditarPontoUseCase } from './application/use-cases/EditarPontoUseCase';
import { DeletarPontoUseCase } from './application/use-cases/DeletarPontoUseCase';

import { PrismaPontosRepository } from './infrastructure/persistence/PrismaPontosRepository';

@Module({
  imports: [AccountsModule],
  controllers: [PontosTuristicosController],
  providers: [
    PrismaService,
    // Provide Prisma repository and service (service receives repo and falls back to in-memory if needed)
    PrismaPontosRepository,
    {
      provide: PontosTuristicosService,
      useFactory: (repo: PrismaPontosRepository) => new PontosTuristicosService(repo),
      inject: [PrismaPontosRepository],
    },

    // Application use-cases
    BuscarFeedUseCase,
    CriarPontoUseCase,
    EditarPontoUseCase,
    DeletarPontoUseCase,

    {
      provide: PontosAuthProxy,
      useFactory: (servico: PontosTuristicosService, userRepo: any) =>
        new PontosAuthProxy(servico, userRepo),
      inject: [PontosTuristicosService, 'IUserRepository'],
    },

    {
      provide: 'PONTOS_SERVICE',
      useFactory: (authProxy: PontosAuthProxy) => new PontosCacheProxy(authProxy),
      inject: [PontosAuthProxy],
    },
  ],
})
export class PontosTuristicosModule {}

