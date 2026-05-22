export interface IObjectPool<T> {
  acquire(): Promise<T>;
  release(obj: T): Promise<void>;
  size(): number;
  cleanIdle(): Promise<void>;
}
