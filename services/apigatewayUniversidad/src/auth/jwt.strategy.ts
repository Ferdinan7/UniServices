import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true, // We handle validation in AuthService
      secretOrKey: 'placeholder-secret', // Not used for validation
    });
  }

  async validate(payload: any) {
    // This strategy is just a placeholder
    // Real validation happens in AuthGuard
    return payload;
  }
}
