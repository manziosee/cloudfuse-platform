import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';
import configuration from '@config/configuration';
import { getDatabaseConfig } from '@config/database.config';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@users/users.module';
import { AppsModule } from '@apps/apps.module';
import { DeploymentsModule } from '@deployments/deployments.module';
import { BuildsModule } from '../src/builds/builds.module';
import { ContainersModule } from '@containers/containers.module';
import { HealthModule } from '../src/health/health.module';
import { LanguagesModule } from '@languages/module/languages.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('THROTTLE_TTL', 60),
        limit: config.get('THROTTLE_LIMIT', 100),
      }),
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger'),
      serveRoot: '/api/swagger-static',
    }),
    TerminusModule,
    AuthModule,
    UsersModule,
    AppsModule,
    DeploymentsModule,
    BuildsModule,
    ContainersModule,
    HealthModule,
    LanguagesModule,
  ],
})
export class AppModule {}