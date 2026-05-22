import { Injectable, Logger } from '@nestjs/common';
import { INotificationChannel } from './INotificationChannel';

@Injectable()
export class LoggerNotificationChannel implements INotificationChannel {
  private readonly logger = new Logger(LoggerNotificationChannel.name);

  send(participanteId: string, mensagem: string): void {
    this.logger.log(`participante=${participanteId} - ${mensagem}`);
  }
}
