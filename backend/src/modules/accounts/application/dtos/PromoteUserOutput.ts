import { UserRole } from '../../domain/entities/User';

export class PromoteUserOutput {
  id!: string;
  email!: string;
  nome!: string;
  role!: UserRole;
  promotedAt!: Date;
}
