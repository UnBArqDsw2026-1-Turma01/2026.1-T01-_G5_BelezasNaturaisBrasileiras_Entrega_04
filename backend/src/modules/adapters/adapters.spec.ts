import { GoogleMapsAdapter } from './map/google-maps.adapter';
import { MapAdapterService } from './map/map-adapter.service';
import { TwilioAdapter } from './notify/twilio.adapter';
import { NotificationAdapterService } from './notify/notification-adapter.service';
import { GoogleAuthAdapter } from './auth/google-auth.adapter';
import { AuthAdapterService } from './auth/auth-adapter.service';

// ─── GoogleMapsAdapter ───────────────────────────────────────────────────────

describe('GoogleMapsAdapter', () => {
  let adapter: GoogleMapsAdapter;

  beforeEach(() => {
    adapter = new GoogleMapsAdapter();
  });

  describe('geocode()', () => {
    it('deve retornar uma LocationDto com lat e lng', async () => {
      const result = await adapter.geocode('Chapada dos Veadeiros, GO');
      expect(result).toHaveProperty('lat');
      expect(result).toHaveProperty('lng');
    });
  });

  describe('route()', () => {
    it('deve retornar uma RouteDto com distance e polyline', async () => {
      const result = await adapter.route(
        { lat: -14, lng: -47 },
        { lat: -15, lng: -48 },
      );
      expect(result).toHaveProperty('distance');
      expect(result).toHaveProperty('polyline');
    });
  });
});

// ─── MapAdapterService (delega ao IMapAdapter) ───────────────────────────────

describe('MapAdapterService — Adapter', () => {
  let mockAdapter: jest.Mocked<GoogleMapsAdapter>;
  let service: MapAdapterService;

  beforeEach(() => {
    mockAdapter = {
      geocode: jest.fn().mockResolvedValue({ lat: -14.5, lng: -47.2 }),
      route: jest.fn().mockResolvedValue({ distance: 120, polyline: 'abc' }),
    } as any;
    service = new MapAdapterService(mockAdapter);
  });

  it('deve delegar geocode() ao adaptador injetado', async () => {
    const result = await service.geocode('Alto Paraíso de Goiás');
    expect(mockAdapter.geocode).toHaveBeenCalledWith('Alto Paraíso de Goiás');
    expect(result).toEqual({ lat: -14.5, lng: -47.2 });
  });

  it('deve delegar route() ao adaptador injetado', async () => {
    const from = { lat: -14, lng: -47 };
    const to = { lat: -15, lng: -48 };
    const result = await service.route(from, to);
    expect(mockAdapter.route).toHaveBeenCalledWith(from, to, undefined);
    expect(result).toEqual({ distance: 120, polyline: 'abc' });
  });

  it('deve permitir substituir o adaptador por outra implementação sem alterar o serviço', async () => {
    const alternativeAdapter = {
      geocode: jest.fn().mockResolvedValue({ lat: 0, lng: 0 }),
      route: jest.fn().mockResolvedValue({ distance: 0, polyline: '' }),
    } as any;
    const altService = new MapAdapterService(alternativeAdapter);

    const result = await altService.geocode('qualquer');
    expect(alternativeAdapter.geocode).toHaveBeenCalled();
    expect(result).toEqual({ lat: 0, lng: 0 });
  });
});

// ─── TwilioAdapter ───────────────────────────────────────────────────────────

describe('TwilioAdapter', () => {
  let adapter: TwilioAdapter;

  beforeEach(() => {
    adapter = new TwilioAdapter();
  });

  describe('sendSMS()', () => {
    it('deve retornar success: true com um externalId', async () => {
      const result = await adapter.sendSMS(
        '+5561999999999',
        'Sua inscrição foi confirmada!',
      );
      expect(result!.success).toBe(true);
      expect(result!.externalId).toBeDefined();
    });
  });

  describe('sendWhatsApp()', () => {
    it('deve retornar success: true com um externalId', async () => {
      const result = await adapter.sendWhatsApp!(
        '+5561999999999',
        'Lembre-se da trilha!',
      );
      expect(result!.success).toBe(true);
      expect(result!.externalId).toBeDefined();
    });
  });
});

// ─── NotificationAdapterService (delega ao INotificationAdapter) ─────────────

describe('NotificationAdapterService — Adapter', () => {
  let mockAdapter: jest.Mocked<TwilioAdapter>;
  let service: NotificationAdapterService;

  beforeEach(() => {
    mockAdapter = {
      sendSMS: jest
        .fn()
        .mockResolvedValue({ success: true, externalId: 'sms-1' }),
      sendWhatsApp: jest
        .fn()
        .mockResolvedValue({ success: true, externalId: 'wa-1' }),
    } as any;
    service = new NotificationAdapterService(mockAdapter);
  });

  it('deve delegar sendSMS() ao adaptador injetado', async () => {
    const result = await service.sendSMS('+5561999999999', 'msg');
    expect(mockAdapter.sendSMS).toHaveBeenCalledWith('+5561999999999', 'msg');
    expect(result!.success).toBe(true);
  });

  it('deve delegar sendWhatsApp() ao adaptador injetado', async () => {
    const result = await service.sendWhatsApp('+5561999999999', 'msg');
    expect(mockAdapter.sendWhatsApp).toHaveBeenCalledWith(
      '+5561999999999',
      'msg',
    );
    expect(result!.success).toBe(true);
  });
});

// ─── GoogleAuthAdapter ───────────────────────────────────────────────────────

describe('GoogleAuthAdapter', () => {
  let adapter: GoogleAuthAdapter;

  beforeEach(() => {
    adapter = new GoogleAuthAdapter();
  });

  describe('validateCallback()', () => {
    it('deve retornar userId extraído do campo sub do payload', async () => {
      const result = await adapter.validateCallback({
        sub: 'google-uid-123',
        email: 'u@g.com',
      });
      expect(result.userId).toBe('google-uid-123');
    });

    it('deve retornar o payload original em tokens', async () => {
      const payload = { sub: 'uid', email: 'a@b.com' };
      const result = await adapter.validateCallback(payload);
      expect(result.tokens).toEqual(payload);
    });
  });

  describe('signIn()', () => {
    it('deve retornar userId com o email do dto', async () => {
      const result = await adapter.signIn({ email: 'org@teste.com' });
      expect(result.userId).toBe('org@teste.com');
    });
  });
});

// ─── AuthAdapterService (delega ao IAuthAdapter) ─────────────────────────────

describe('AuthAdapterService — Adapter', () => {
  let mockAdapter: jest.Mocked<GoogleAuthAdapter>;
  let service: AuthAdapterService;

  beforeEach(() => {
    mockAdapter = {
      validateCallback: jest
        .fn()
        .mockResolvedValue({ userId: 'uid-1', tokens: {} }),
      signIn: jest.fn().mockResolvedValue({ userId: 'uid-1' }),
    } as any;
    service = new AuthAdapterService(mockAdapter);
  });

  it('deve delegar validateCallback() ao adaptador injetado', async () => {
    const result = await service.validateCallback({ sub: 'uid-1' });
    expect(mockAdapter.validateCallback).toHaveBeenCalledWith({ sub: 'uid-1' });
    expect(result.userId).toBe('uid-1');
  });

  it('deve delegar signIn() ao adaptador injetado', async () => {
    const result = await service.signIn({ email: 'x@y.com' });
    expect(mockAdapter.signIn).toHaveBeenCalledWith({ email: 'x@y.com' });
    expect(result.userId).toBe('uid-1');
  });
});
