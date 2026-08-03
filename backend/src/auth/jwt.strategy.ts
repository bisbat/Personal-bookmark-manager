import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-yg.us.auth0.com/.well-known/jwks.json',
      }),
      audience: 'https://bbl-candidate-test-api', // ต้อง match กับ audience ที่ frontend ขอ token มา
      issuer: 'https://dev-yg.us.auth0.com/',
      algorithms: ['RS256'], // lock ไว้ตรงๆ — ยืนยันจากที่ verify JWKS มาแล้วก่อนหน้า
    });
  }

  async validate(payload: any) {
    // ค่านี้จะไปโผล่ที่ request.user ให้ @CurrentUser() ดึงใช้ต่อ
    return { sub: payload.sub, email: payload.email };
  }
}