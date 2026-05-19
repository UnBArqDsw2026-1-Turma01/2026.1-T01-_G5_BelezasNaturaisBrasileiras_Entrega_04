import { Module, OnModuleInit } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../../shared/infrastructure/prisma/prisma.service';
import { ConfirmationCodeService } from './domain/services/ConfirmationCodeService';
import { TrilhaEventEmitter } from './domain/observers/TrilhaEventEmitter';
import { BadgeDistribuicaoObserver } from './domain/observers/BadgeDistribuicaoObserver';
import { NotificacaoObserver } from './domain/observers/NotificacaoObserver';
import { PrismaTrilhaRepository } from './infrastructure/persistence/PrismaTrilhaRepository';
import { CachedTrilhaRepository } from './infrastructure/persistence/CachedTrilhaRepository';
import { AuditedTrilhaRepository } from './infrastructure/persistence/AuditedTrilhaRepository';
import { AuditLog } from './domain/services/AuditLog';
import { TrilhaRequestContext } from './domain/services/TrilhaRequestContext';
import { TrilhaProxyRepository } from './infrastructure/persistence/TrilhaProxyRepository';
import { PrismaInscricaoRepository } from '../inscricoes/infrastructure/persistence/PrismaInscricaoRepository';
import { PrismaBadgeRepository } from './infrastructure/persistence/PrismaBadgeRepository';
import { CriarTrilhaUseCase } from './application/use-cases/CriarTrilhaUseCase';
import { ListarTrilhasUseCase } from './application/use-cases/ListarTrilhasUseCase';
import { FinalizarTrilhaUseCase } from './application/use-cases/FinalizarTrilhaUseCase';
import { ListarInscricoesUseCase } from '../inscricoes/application/use-cases/ListarInscricoesUseCase';
import { TrilhaFacade } from './application/TrilhaFacade';
import { TrilhasController } from './interface/controllers/TrilhasController';

@Module({
  imports: [PassportModule],
  controllers: [TrilhasController],
  providers: [
    PrismaService,
    {
      provide: ConfirmationCodeService,
      useValue: ConfirmationCodeService.getInstance(),
    },
    AuditLog,
    TrilhaRequestContext,
    {
      provide: 'ITrilhaRepository',
      useFactory: (
        prisma: PrismaService,
        auditLog: AuditLog,
        context: TrilhaRequestContext,
      ) => {
        const base = new PrismaTrilhaRepository(prisma);
        const cached = new CachedTrilhaRepository(base);
        const audited = new AuditedTrilhaRepository(cached, auditLog);
        return new TrilhaProxyRepository(audited, context);
      },
      inject: [PrismaService, AuditLog, TrilhaRequestContext],
    },
    { provide: 'IInscricaoRepository', useClass: PrismaInscricaoRepository },
    { provide: 'IBadgeRepository', useClass: PrismaBadgeRepository },
    TrilhaEventEmitter,
    BadgeDistribuicaoObserver,
    NotificacaoObserver,
    CriarTrilhaUseCase,
    ListarTrilhasUseCase,
    FinalizarTrilhaUseCase,
    ListarInscricoesUseCase,
    TrilhaFacade,
  ],
  exports: [ConfirmationCodeService, TrilhaEventEmitter],
})
export class TrilhasModule implements OnModuleInit {
  constructor(
    private readonly eventEmitter: TrilhaEventEmitter,
    private readonly badgeObserver: BadgeDistribuicaoObserver,
    private readonly notificacaoObserver: NotificacaoObserver,
  ) {}

  onModuleInit(): void {
    this.eventEmitter.subscribe(this.badgeObserver);
    this.eventEmitter.subscribe(this.notificacaoObserver);
  }
}
