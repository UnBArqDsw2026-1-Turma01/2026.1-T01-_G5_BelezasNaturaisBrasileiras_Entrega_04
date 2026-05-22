import { IsEmail, IsEnum } from 'class-validator';
import { UserRole } from '../../domain/entities/User';

export class PromoteUserInput {
  @IsEmail()
  email!: string;

  @IsEnum(UserRole)
  newRole!: UserRole;
}
