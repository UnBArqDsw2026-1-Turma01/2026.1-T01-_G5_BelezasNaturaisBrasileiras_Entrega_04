// src/modules/accounts/infrastructure/factories/UserFactoryRegistry.ts

import { Injectable } from '@nestjs/common';
import { IUserFactoryRegistry } from '../../domain/interfaces/IUserFactoryRegistry';
import { IUserFactory } from '../../domain/interfaces/IUserFactory';
import { UserRole } from '../../domain/entities/User';

@Injectable()
export class UserFactoryRegistry implements IUserFactoryRegistry {
  private registry: Map<UserRole, IUserFactory> = new Map();

  register(role: UserRole, factory: IUserFactory): void {
    this.registry.set(role, factory);
  }

  get(role: UserRole): IUserFactory {
    const factory = this.registry.get(role);
    if (!factory) {
      throw new Error(`Factory não registrada para role: ${role}`);
    }
    return factory;
  }
}
