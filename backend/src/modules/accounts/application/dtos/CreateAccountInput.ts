import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../domain/entities/User';

export class CreateAccountInput {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsNotEmpty()
  nome!: string;

  @IsBoolean()
  aceitouTermos!: boolean;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
