import { Provider } from '@nestjs/common';
import { CommonUserFactory } from '../../infrastructure/factories/CommonUserFactory';
import { UserFactoryRegistry } from '../../infrastructure/factories/UserFactoryRegistry';
import { UserRole } from '../../domain/entities/User';

export const userFactoryProviders: Provider[] = [
  CommonUserFactory,
  {
    provide: 'IUserFactoryRegistry',
    useFactory: (commonUserFactory: CommonUserFactory) => {
      const registry = new UserFactoryRegistry();
      registry.register(UserRole.COMMON_USER, commonUserFactory);
      return registry;
    },
    inject: [CommonUserFactory],
  },
];
