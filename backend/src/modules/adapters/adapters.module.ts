import { Module } from '@nestjs/common';
import { GoogleAuthAdapter } from './auth/google-auth.adapter';
import { LocalAuthAdapter } from './auth/local-auth.adapter';
import { AuthAdapterService } from './auth/auth-adapter.service';
import { GoogleMapsAdapter } from './map/google-maps.adapter';
import { MapAdapterService } from './map/map-adapter.service';
import { TwilioAdapter } from './notify/twilio.adapter';
import { NotificationAdapterService } from './notify/notification-adapter.service';
import { AdaptersController } from './adapters.controller';
import { ExternalProviderConfigRepository } from './repositories/external-provider-config.repository';
import { SecretsClient } from '../../shared/infrastructure/secrets/secrets.client';

@Module({
  controllers: [AdaptersController],
  providers: [
    SecretsClient,
    ExternalProviderConfigRepository,

    GoogleAuthAdapter,
    LocalAuthAdapter,
    AuthAdapterService,
    { provide: 'IAuthAdapter', useClass: GoogleAuthAdapter },

    GoogleMapsAdapter,
    MapAdapterService,
    { provide: 'IMapAdapter', useClass: GoogleMapsAdapter },

    TwilioAdapter,
    NotificationAdapterService,
    { provide: 'INotificationAdapter', useClass: TwilioAdapter },
  ],
  exports: [AuthAdapterService, MapAdapterService, NotificationAdapterService, 'IAuthAdapter', 'IMapAdapter', 'INotificationAdapter'],
})
export class AdaptersModule {}
