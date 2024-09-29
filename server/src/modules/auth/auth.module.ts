import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from 'src/config/jwt.config.service';
import { AuthGuard } from './auth.guard';
import { ConfigModule } from 'src/config/config.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({ useClass: JwtConfigService }),
  ],
  controllers: [AuthController],
  providers: [AuthService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AuthModule {}
