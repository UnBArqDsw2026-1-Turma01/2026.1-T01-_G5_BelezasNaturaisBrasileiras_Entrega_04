import { Controller, Post, Get, Body } from '@nestjs/common';
import { MapAdapterService } from './map/map-adapter.service';
import { NotificationAdapterService } from './notify/notification-adapter.service';
import { AuthAdapterService } from './auth/auth-adapter.service';

@Controller('adapters')
export class AdaptersController {
  constructor(
    private readonly mapAdapter: MapAdapterService,
    private readonly notifyAdapter: NotificationAdapterService,
    private readonly authAdapter: AuthAdapterService,
  ) {}

  @Get('info')
  adapterInfo() {
    return {
      pattern: 'Adapter (Structural GoF)',
      adapters: {
        map: 'GoogleMapsAdapter',
        notification: 'TwilioAdapter',
        auth: 'GoogleAuthAdapter',
      },
    };
  }

  @Post('geocode')
  geocode(@Body() body: { address: string }) {
    return this.mapAdapter.geocode(body.address);
  }

  @Post('route')
  route(@Body() body: { from: { lat: number; lng: number }; to: { lat: number; lng: number }; options?: any }) {
    return this.mapAdapter.route(body.from, body.to, body.options);
  }

  @Post('notify/sms')
  sendSms(@Body() body: { to: string; message: string }) {
    return this.notifyAdapter.sendSMS(body.to, body.message);
  }

  @Post('notify/whatsapp')
  sendWhatsApp(@Body() body: { to: string; message: string }) {
    return this.notifyAdapter.sendWhatsApp(body.to, body.message);
  }

  @Post('auth/validate')
  validateAuth(@Body() data: any) {
    return this.authAdapter.validateCallback(data);
  }
}
