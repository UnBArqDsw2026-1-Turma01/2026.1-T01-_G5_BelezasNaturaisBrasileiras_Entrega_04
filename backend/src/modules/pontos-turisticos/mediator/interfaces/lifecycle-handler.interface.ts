export interface TrailLifecycleEvent { trailId: string; actorId: string; timestamp?: string; payload?: any }

export interface ILifecycleHandler {
  handle(event: TrailLifecycleEvent): Promise<void>;
}
