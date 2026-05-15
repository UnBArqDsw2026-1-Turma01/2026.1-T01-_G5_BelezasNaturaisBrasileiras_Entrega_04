import { Injectable } from '@nestjs/common';
import { IUserFactory } from '../../domain/interfaces/IUserFactory';
import { User, UserRole } from '../../domain/entities/User';
import { UserBuilder } from '../../domain/builders/UserBuilder';

@Injectable()
export class OrganizerUserFactory implements IUserFactory {
  create(id: string, email: string, nome: string): User {
    return new UserBuilder()
      .withId(id)
      .withEmail(email)
      .withNome(nome)
      .withRole(UserRole.ORGANIZER)
      .build();
  }
}
