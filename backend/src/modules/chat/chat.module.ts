import { Module } from '@nestjs/common';
import { ChatConnectionFactoryService } from './chat-connection.factory.service';
import { ChatObjectPoolService } from './pool/chat-object-pool.service';
import { ChatSessionManagerService } from './chat-session.manager.service';
import { ChatSessionRepository } from './repositories/chat-session.repository';
import { ChatActivityRepository } from './repositories/chat-activity.repository';
import { ChatController } from './chat.controller';
import { PrismaService } from '../../shared/infrastructure/prisma/prisma.service';

@Module({
  controllers: [ChatController],
  providers: [
    ChatConnectionFactoryService,
    ChatObjectPoolService,
    ChatSessionManagerService,
    ChatSessionRepository,
    ChatActivityRepository,
    PrismaService,
  ],
  exports: [ChatSessionManagerService, ChatSessionRepository, ChatActivityRepository],
})
export class ChatModule {}
