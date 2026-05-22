import { Injectable, Inject } from '@nestjs/common';
import { INotificationAdapter } from './interfaces/notification-adapter.interface';

@Injectable()
export class NotificationAdapterService {
  constructor(@Inject('INotificationAdapter') private readonly adapter: INotificationAdapter) {}

  sendSMS(to: string, message: string) {
    return this.adapter.sendSMS(to, message);
  }

  sendWhatsApp(to: string, message: string) {
    return this.adapter.sendWhatsApp?.(to, message);
  }
}
