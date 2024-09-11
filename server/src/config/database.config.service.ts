import { Injectable } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  private readonly defaultPostgresUrl = 'pgsql://root:root@postgres:5432/test';

  get postgresUrl(): string {
    return process.env.POSTGRES_URL || this.defaultPostgresUrl;
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: this.postgresUrl,
      autoLoadEntities: true,
      synchronize: true,
    };
  }
}
