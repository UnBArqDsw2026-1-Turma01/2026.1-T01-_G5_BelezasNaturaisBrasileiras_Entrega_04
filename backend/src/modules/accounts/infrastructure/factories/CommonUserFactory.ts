// src/modules/accounts/infrastructure/factories/CommonUserFactory.ts

import { Injectable } from '@nestjs/common';
import { IUserFactory } from '../../domain/interfaces/IUserFactory';
import { User, UserRole } from '../../domain/entities/User';
import { UserBuilder } from '../../domain/builders/UserBuilder';

@Injectable()
export class CommonUserFactory implements IUserFactory {
  create(id: string, email: string, nome: string): User {
    return new UserBuilder()
      .withId(id)
      .withEmail(email)
      .withNome(nome)
      .withRole(UserRole.COMMON_USER)
      .build();
  }
}
