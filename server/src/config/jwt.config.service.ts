import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  createJwtOptions(): JwtModuleOptions {
    return {
      global: true,
      secret: this.secret,
      signOptions: { expiresIn: '30d' },
    };
  }

  get secret(): string {
    return process.env.JWT_SECRET || 'secret';
  }
}
