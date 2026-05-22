import { Injectable } from '@nestjs/common';
import { ILifecycleHandler, TrailLifecycleEvent } from '../interfaces/lifecycle-handler.interface';

@Injectable()
export class TrailStateHandler implements ILifecycleHandler {
  async handle(event: TrailLifecycleEvent): Promise<void> {
    // mark trail as inactive/closed in repository
    return;
  }
}
