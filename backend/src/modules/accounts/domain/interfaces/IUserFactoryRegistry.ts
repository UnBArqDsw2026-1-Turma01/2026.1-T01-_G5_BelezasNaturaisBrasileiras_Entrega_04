import { IUserFactory } from './IUserFactory';
import { UserRole } from '../entities/User';

export interface IUserFactoryRegistry {
  register(role: UserRole, factory: IUserFactory): void;
  get(role: UserRole): IUserFactory;
}
