import { INotificationChannel } from './INotificationChannel';

export abstract class TrilhaNotification {
  constructor(protected readonly channel: INotificationChannel) {}

  abstract notify(participanteIds: string[]): Promise<void>;
}
