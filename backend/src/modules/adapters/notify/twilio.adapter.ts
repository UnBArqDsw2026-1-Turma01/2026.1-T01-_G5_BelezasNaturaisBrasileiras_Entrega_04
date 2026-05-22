import { Injectable } from '@nestjs/common';
import { INotificationAdapter, NotifyResult } from './interfaces/notification-adapter.interface';

@Injectable()
export class TwilioAdapter implements INotificationAdapter {
  async sendSMS(to: string, message: string): Promise<NotifyResult> {
    // Integrate Twilio SDK here
    return { success: true, externalId: 'twilio-123' };
  }

  async sendWhatsApp(to: string, message: string): Promise<NotifyResult> {
    return { success: true, externalId: 'twilio-wa-123' };
  }
}
