import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
  type: 'postgres',
  host: configService.get<string>('database.host'),
  port: configService.get<number>('database.port'),
  username: configService.get<string>('database.username'),
  password: configService.get<string>('database.password'),
  database: configService.get<string>('database.name'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: configService.get<string>('environment') !== 'production',
  logging: configService.get<string>('environment') === 'development',
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  migrationsRun: true,
  ssl: {
    rejectUnauthorized: false,
  },
  extra: {
    connectionLimit: 10,
  },
});