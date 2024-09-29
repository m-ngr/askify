import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { DatabaseConfigService } from './database.config.service';
import { JwtConfigService } from './jwt.config.service';

@Module({
  providers: [ConfigService, DatabaseConfigService, JwtConfigService],
  exports: [ConfigService, DatabaseConfigService, JwtConfigService],
})
export class ConfigModule {}
