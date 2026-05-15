import { UserRole } from '../../domain/entities/User';

export class CreateAccountOutput {
  id!: string;
  email!: string;
  nome!: string;
  role!: UserRole;
  createdAt!: Date;
  updatedAt!: Date;
}
