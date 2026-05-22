export interface MediatorResult { success: boolean; errors?: any[] }

import { ILifecycleHandler } from './lifecycle-handler.interface';

export interface ITrailLifecycleMediator {
  finishTrail(trailId: string, actorId: string): Promise<MediatorResult>;
  registerHandler(name: string, handler: ILifecycleHandler): void;
}
