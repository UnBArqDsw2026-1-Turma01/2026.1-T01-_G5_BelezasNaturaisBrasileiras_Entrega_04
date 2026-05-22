import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '../enums/role.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // Prefer JWT_SECRET (HS256) when set — LoginUseCase signs with this.
    // SUPABASE_JWT_PUBLIC_KEY (ES256) is a fallback for Supabase-issued tokens.
    const jwtSecret = process.env.JWT_SECRET;
    const publicKey = jwtSecret
      ? undefined
      : process.env.SUPABASE_JWT_PUBLIC_KEY?.replace(/\\n/g, '\n');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret ?? publicKey ?? '',
      algorithms: publicKey ? ['ES256'] : ['HS256'],
    });
  }

  validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role as Role,
    };
  }
}
