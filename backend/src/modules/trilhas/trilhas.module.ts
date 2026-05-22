import { Module, OnModuleInit } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../../shared/infrastructure/prisma/prisma.service';
import { ConfirmationCodeService } from './domain/services/ConfirmationCodeService';
import { TrilhaEventEmitter } from './domain/observers/TrilhaEventEmitter';
import { BadgeDistribuicaoObserver } from './domain/observers/BadgeDistribuicaoObserver';
import { NotificacaoObserver } from './domain/observers/NotificacaoObserver';
import { BadgeDistribuicaoVisitor } from './domain/visitors/BadgeDistribuicaoVisitor';
import { NotificacaoInscricaoVisitor } from './domain/visitors/NotificacaoInscricaoVisitor';
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
import { RestaurarTrilhaUseCase } from './application/use-cases/RestaurarTrilhaUseCase';
import { EditarTrilhaUseCase } from './application/use-cases/EditarTrilhaUseCase';
import { ListarInscricoesUseCase } from '../inscricoes/application/use-cases/ListarInscricoesUseCase';
import { TrilhaFacade } from './application/TrilhaFacade';
import { TrilhasController } from './interface/controllers/TrilhasController';
import { TrilhaCaretaker } from './domain/memento/TrilhaCaretaker';
import { TrailLifecycleModule } from '../pontos-turisticos/mediator/trail-lifecycle.module';
import { LoggerNotificationChannel } from './domain/notifications/LoggerNotificationChannel';
import { OrdenarTrilhasPorDataStrategy } from './domain/strategies/OrdenarTrilhasPorDataStrategy';
import { OrdenarTrilhasPorTituloStrategy } from './domain/strategies/OrdenarTrilhasPorTituloStrategy';
import { TrilhaOrdenacaoContext } from './domain/strategies/TrilhaOrdenacaoContext';
import { ITrilhaRepository } from './domain/interfaces/ITrilhaRepository';
import { IInscricaoRepository } from '../inscricoes/domain/interfaces/IInscricaoRepository';
import { IInscricaoVisitor } from '../inscricoes/domain/interfaces/IInscricaoVisitor';
import { ITrailLifecycleMediator } from '../pontos-turisticos/mediator/interfaces/trail-lifecycle-mediator.interface';

@Module({
  imports: [PassportModule, TrailLifecycleModule],
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
    LoggerNotificationChannel,
    BadgeDistribuicaoObserver,
    NotificacaoObserver,
    BadgeDistribuicaoVisitor,
    NotificacaoInscricaoVisitor,
    {
      provide: 'IInscricaoVisitors',
      useFactory: (
        badge: BadgeDistribuicaoVisitor,
        notif: NotificacaoInscricaoVisitor,
      ) => [badge, notif],
      inject: [BadgeDistribuicaoVisitor, NotificacaoInscricaoVisitor],
    },
    TrilhaCaretaker,
    OrdenarTrilhasPorDataStrategy,
    OrdenarTrilhasPorTituloStrategy,
    TrilhaOrdenacaoContext,
    CriarTrilhaUseCase,
    ListarTrilhasUseCase,
    {
      provide: FinalizarTrilhaUseCase,
      useFactory: (
        repo: ITrilhaRepository,
        inscRepo: IInscricaoRepository,
        caretaker: TrilhaCaretaker,
        mediator: ITrailLifecycleMediator,
        visitors: IInscricaoVisitor[],
      ) =>
        new FinalizarTrilhaUseCase(
          repo,
          inscRepo,
          caretaker,
          mediator,
          visitors,
        ),
      inject: [
        'ITrilhaRepository',
        'IInscricaoRepository',
        TrilhaCaretaker,
        'ITrailLifecycleMediator',
        'IInscricaoVisitors',
      ],
    },
    RestaurarTrilhaUseCase,
    EditarTrilhaUseCase,
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
