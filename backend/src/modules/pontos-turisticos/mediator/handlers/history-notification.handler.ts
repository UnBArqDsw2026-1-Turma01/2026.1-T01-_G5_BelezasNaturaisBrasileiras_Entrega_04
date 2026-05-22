import { Injectable } from '@nestjs/common';
import { ILifecycleHandler, TrailLifecycleEvent } from '../interfaces/lifecycle-handler.interface';

@Injectable()
export class HistoryNotificationHandler implements ILifecycleHandler {
  async handle(event: TrailLifecycleEvent): Promise<void> {
    // append to EditHistory and send notifications via NotificationAdapterService
    return;
  }
}
