import { Controller, Get } from '@nestjs/common';
import { Public } from './modules/auth/public.decorator';

@Controller()
export class AppController {
  @Get('health')
  @Public()
  checkHealth() {
    return {
      status: 'ok',
      timestamp: Date.now(),
    };
  }
}
