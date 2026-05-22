import { Injectable } from '@nestjs/common';
import { IMapAdapter, LocationDto, RouteDto } from './interfaces/map-adapter.interface';

@Injectable()
export class GoogleMapsAdapter implements IMapAdapter {
  async geocode(address: string): Promise<LocationDto> {
    // Call Google Maps API (placeholder)
    return { lat: 0, lng: 0 };
  }
  async route(from: LocationDto, to: LocationDto, options?: any): Promise<RouteDto> {
    return { distance: 0, polyline: '' };
  }
  async uploadMarkerImage(file: any): Promise<string> {
    return 'https://example.com/image.png';
  }
}
