import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App } from './entities/app.entity';
import { AppsService } from './apps.service';
import { AppsController } from '../apps/apps.controller';
import { DeploymentsModule } from '../deployments/deployments.module';

@Module({
  imports: [TypeOrmModule.forFeature([App]), DeploymentsModule],
  controllers: [AppsController],
  providers: [AppsService],
  exports: [AppsService],
})
export class AppsModule {}