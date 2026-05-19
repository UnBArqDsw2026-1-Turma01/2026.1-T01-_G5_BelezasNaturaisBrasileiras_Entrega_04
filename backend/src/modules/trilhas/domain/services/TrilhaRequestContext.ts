import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

interface TrilhaRequestStore {
  requesterId: string;
}

@Injectable()
export class TrilhaRequestContext {
  private readonly storage =
    new AsyncLocalStorage<TrilhaRequestStore>();

  run<T>(requesterId: string, fn: () => Promise<T>): Promise<T> {
    return this.storage.run({ requesterId }, fn);
  }

  getRequesterId(): string | undefined {
    return this.storage.getStore()?.requesterId;
  }
}
