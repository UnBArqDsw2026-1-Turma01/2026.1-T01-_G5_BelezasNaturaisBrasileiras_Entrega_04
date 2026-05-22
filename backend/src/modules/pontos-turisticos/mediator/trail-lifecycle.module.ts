import { Module } from '@nestjs/common';
import { TrailLifecycleMediatorService } from './trail-lifecycle-mediator.service';
import { TrailLifecycleRepository } from '../repositories/trail-lifecycle.repository';
import { TrailSagaStateRepository } from '../repositories/trail-saga-state.repository';
import { AttendanceHandler } from './handlers/attendance.handler';
import { BadgeHandler } from './handlers/badge.handler';
import { HistoryNotificationHandler } from './handlers/history-notification.handler';
import { TrailStateHandler } from './handlers/trail-state.handler';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Module({
  providers: [
    PrismaService,
    TrailLifecycleMediatorService,
    { provide: 'ITrailLifecycleMediator', useClass: TrailLifecycleMediatorService },
    TrailLifecycleRepository,
    TrailSagaStateRepository,
    AttendanceHandler,
    BadgeHandler,
    HistoryNotificationHandler,
    TrailStateHandler,
  ],
  exports: [TrailLifecycleMediatorService, 'ITrailLifecycleMediator'],
})
export class TrailLifecycleModule {}
