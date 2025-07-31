import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { HttpExceptionFilter } from '@common/exceptions/http-exception.filter';
import { LoggingInterceptor } from '@common/interceptors/logging.interceptor';
import { parse } from 'url';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Parse Redis URL
  const redisUrl = configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
  const parsed = parse(redisUrl);
  const [host, port] = (parsed.host || 'localhost:6379').split(':');

  // Microservice setup
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host,
      port: Number(port),
      // Add password if needed: password: parsed.auth?.split(':')[1]
    },
  });

  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('CloudFuse API')
    .setDescription('Multi-language PaaS Platform API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(configService.get('APP_URL') || 'http://localhost:3000')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // Generate OpenAPI spec files
  writeFileSync('./swagger.yaml', dump(document));
  writeFileSync('./swagger.json', JSON.stringify(document, null, 2));

  await app.startAllMicroservices();

  const portNum = configService.get<number>('PORT') || 3000;
  await app.listen(portNum);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();