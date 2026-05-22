import { Injectable } from '@nestjs/common';
import { ILifecycleHandler, TrailLifecycleEvent } from '../interfaces/lifecycle-handler.interface';

@Injectable()
export class BadgeHandler implements ILifecycleHandler {
  async handle(event: TrailLifecycleEvent): Promise<void> {
    // call BadgeService to compute and assign badges
    return;
  }
}
