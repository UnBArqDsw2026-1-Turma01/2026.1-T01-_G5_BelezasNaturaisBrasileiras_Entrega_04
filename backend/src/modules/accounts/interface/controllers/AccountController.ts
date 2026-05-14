import {
  Controller,
  Post,
  Body,
  HttpCode,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { CreateAccountUseCase } from '../../application/use-cases/CreateAccountUseCase';
import { CreateAccountInput } from '../../application/dtos/CreateAccountInput';
import { CreateAccountOutput } from '../../application/dtos/CreateAccountOutput';
import { PromoteUserUseCase } from '../../application/use-cases/PromoteUserUseCase';
import { PromoteUserInput } from '../../application/dtos/PromoteUserInput';
import { PromoteUserOutput } from '../../application/dtos/PromoteUserOutput';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/enums/role.enum';

@Controller('accounts')
export class AccountController {
  constructor(
    private createAccountUseCase: CreateAccountUseCase,
    private promoteUserUseCase: PromoteUserUseCase,
  ) {}

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

  @Post('promote')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async promote(@Body() input: PromoteUserInput): Promise<PromoteUserOutput> {
    try {
      return await this.promoteUserUseCase.execute(input);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
