import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '../enums/role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // Garante que o user está no request, funcionando no RolesGuard
  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role as Role,
    };
  }
}