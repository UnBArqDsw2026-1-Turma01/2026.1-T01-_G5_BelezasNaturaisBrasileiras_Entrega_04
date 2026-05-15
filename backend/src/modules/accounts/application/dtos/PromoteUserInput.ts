import { UserRole } from '../../domain/entities/User';

export class PromoteUserInput {
  email!: string;
  newRole!: UserRole;
}
