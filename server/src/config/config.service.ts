import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private readonly defaultPort = 3000;

  get port(): number {
    return Number(process.env.PORT) || this.defaultPort;
  }
}
