import { User } from '../entities/User';

export interface IUserFactory {
  create(id: string, email: string, nome: string): User;
}
