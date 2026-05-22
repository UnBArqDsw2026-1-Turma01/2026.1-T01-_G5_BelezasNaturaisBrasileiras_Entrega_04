import { Injectable } from '@nestjs/common';
import { IAuthAdapter, AuthResult } from './interfaces/auth-adapter.interface';

@Injectable()
export class GoogleAuthAdapter implements IAuthAdapter {
  async validateCallback(data: any): Promise<AuthResult> {
    // Implement Google token validation using OAuth2 client
    return { userId: data?.sub?.toString(), tokens: data };
  }

  async signIn(dto: any): Promise<AuthResult> {
    // Not typically used for Google (redirect flow)
    return { userId: dto?.email };
  }
}
