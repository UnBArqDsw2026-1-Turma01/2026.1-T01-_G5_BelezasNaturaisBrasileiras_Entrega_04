import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountsModule } from './modules/accounts/accounts.module';
import { PontosTuristicosModule } from './modules/pontos-turisticos/pontos-turisticos.module';
import { ChatModule } from './modules/chat/chat.module';
import { AdaptersModule } from './modules/adapters/adapters.module';
import { TrilhasModule } from './modules/trilhas/trilhas.module';
import { InscricoesModule } from './modules/inscricoes/inscricoes.module';
import { PrismaService } from './shared/infrastructure/prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    AccountsModule,
    PontosTuristicosModule,
    ChatModule,
    AdaptersModule,
    TrilhasModule,
    InscricoesModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
