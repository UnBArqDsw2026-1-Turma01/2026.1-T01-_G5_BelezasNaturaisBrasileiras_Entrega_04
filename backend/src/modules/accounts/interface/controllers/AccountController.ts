import {
  Controller,
  Post,
  Body,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { CreateAccountUseCase } from '../../application/use-cases/CreateAccountUseCase';
import { CreateAccountInput } from '../../application/dtos/CreateAccountInput';
import { CreateAccountOutput } from '../../application/dtos/CreateAccountOutput';

@Controller('accounts')
export class AccountController {
  constructor(private createAccountUseCase: CreateAccountUseCase) {}

  @Post('signup')
  @HttpCode(201)
  async signup(
    @Body() input: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      return await this.createAccountUseCase.execute(input);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
