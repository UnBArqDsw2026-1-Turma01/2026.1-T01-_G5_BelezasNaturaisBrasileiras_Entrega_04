import { Provider } from '@nestjs/common';
import { CommonUserFactory } from '../../infrastructure/factories/CommonUserFactory';
import { OrganizerUserFactory } from '../../infrastructure/factories/OrganizerUserFactory';
import { AdminUserFactory } from '../../infrastructure/factories/AdminUserFactory';
import { UserFactoryRegistry } from '../../infrastructure/factories/UserFactoryRegistry';
import { UserRole } from '../../domain/entities/User';

export const userFactoryProviders: Provider[] = [
  CommonUserFactory,
  OrganizerUserFactory,
  AdminUserFactory,
  {
    provide: 'IUserFactoryRegistry',
    useFactory: (
      commonUserFactory: CommonUserFactory,
      organizerUserFactory: OrganizerUserFactory,
      adminUserFactory: AdminUserFactory,
    ) => {
      const registry = new UserFactoryRegistry();
      registry.register(UserRole.COMMON_USER, commonUserFactory);
      registry.register(UserRole.COMMON, commonUserFactory);
      registry.register(UserRole.ORGANIZER, organizerUserFactory);
      registry.register(UserRole.ADMIN, adminUserFactory);
      return registry;
    },
    inject: [CommonUserFactory, OrganizerUserFactory, AdminUserFactory],
  },
];
