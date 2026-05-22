export interface LocationDto { lat: number; lng: number; }
export interface RouteDto { distance: number; polyline?: string; }

export interface IMapAdapter {
  geocode(address: string): Promise<LocationDto>;
  route(from: LocationDto, to: LocationDto, options?: any): Promise<RouteDto>;
  uploadMarkerImage?(file: any): Promise<string>;
}
