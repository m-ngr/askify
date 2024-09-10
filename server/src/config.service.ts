import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private readonly defaultPort = 3000;
  private readonly defaultPostgresUrl = 'pgsql://root:root@postgres:5432/test';

  get port(): number {
    return Number(process.env.PORT) || this.defaultPort;
  }

  get postgresUrl(): string {
    return process.env.POSTGRES_URL || this.defaultPostgresUrl;
  }
}
