import { Injectable, Inject } from '@nestjs/common';
import { IMapAdapter } from './interfaces/map-adapter.interface';

@Injectable()
export class MapAdapterService {
  constructor(@Inject('IMapAdapter') private readonly adapter: IMapAdapter) {}

  geocode(address: string) {
    return this.adapter.geocode(address);
  }

  route(from: any, to: any, options?: any) {
    return this.adapter.route(from, to, options);
  }
}
