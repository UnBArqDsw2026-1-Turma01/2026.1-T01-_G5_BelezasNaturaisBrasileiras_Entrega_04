import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateAccountInput {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsNotEmpty()
  nome!: string;
}
