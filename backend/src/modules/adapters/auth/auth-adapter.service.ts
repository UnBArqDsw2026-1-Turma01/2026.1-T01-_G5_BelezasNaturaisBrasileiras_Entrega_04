import { Injectable, Inject } from '@nestjs/common';
import { IAuthAdapter } from './interfaces/auth-adapter.interface';

@Injectable()
export class AuthAdapterService {
  constructor(
    @Inject('IAuthAdapter') private readonly adapter: IAuthAdapter,
  ) {}

  async validateCallback(data: any) {
    return this.adapter.validateCallback(data);
  }

  async signIn(dto: any) {
    return this.adapter.signIn(dto);
  }
}
