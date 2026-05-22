import { Injectable } from '@nestjs/common';
import { IAuthAdapter, AuthResult } from './interfaces/auth-adapter.interface';

@Injectable()
export class LocalAuthAdapter implements IAuthAdapter {
  async validateCallback(data: any): Promise<AuthResult> {
    // For local auth, callback is direct credentials
    return { userId: data?.id };
  }

  async signIn(dto: any): Promise<AuthResult> {
    // Validate email/password and return tokens
    return { userId: dto?.email };
  }
}
