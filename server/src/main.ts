import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { StandardValidationPipe } from './common/pipes/standard-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new StandardValidationPipe());
  await app.listen(configService.port);
  console.log(`Server is running on port ${configService.port}`);
}
bootstrap();
