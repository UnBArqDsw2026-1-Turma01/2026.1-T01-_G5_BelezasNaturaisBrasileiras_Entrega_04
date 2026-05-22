import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './shared/infrastructure/prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('debug/stats')
  async getStats() {
    return {
      users: await this.prisma.user.count(),
      trilhas: await this.prisma.trilha.count(),
      inscricoes: await this.prisma.inscricao.count(),
      chatActivity: await this.prisma.chatActivity.count(),
      notificationLogs: await this.prisma.notificationLog.count(),
      lifecycleEvents: await this.prisma.trailLifecycleEvent.count(),
      sagaStates: await this.prisma.trailSagaState.count(),
    };
  }
}
