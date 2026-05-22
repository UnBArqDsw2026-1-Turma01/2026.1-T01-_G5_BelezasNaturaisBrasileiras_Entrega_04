import { Injectable } from '@nestjs/common';
import { ILifecycleHandler, TrailLifecycleEvent } from '../interfaces/lifecycle-handler.interface';

@Injectable()
export class AttendanceHandler implements ILifecycleHandler {
  async handle(event: TrailLifecycleEvent): Promise<void> {
    // call AttendanceService to validate and close presences
    // Placeholder: implement actual injection and logic
    return;
  }
}
