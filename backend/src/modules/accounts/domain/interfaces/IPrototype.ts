export interface IPrototype<T> {
  clone(overrides?: Partial<T>): T;
}
