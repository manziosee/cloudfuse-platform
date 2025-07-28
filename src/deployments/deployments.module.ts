import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deployment } from './entities/deployment.entity';
import { DeploymentsService } from './deployments.service';
import { AppsModule } from '../apps/apps.module';
import { BuildsModule } from '../builds/builds.module';
import { ContainersModule } from '../containers/containers.module';
import { DeploymentsController } from './deployments.controller'; // Adjust the import path as necessary

@Module({
  imports: [
    TypeOrmModule.forFeature([Deployment]),
    AppsModule,
    BuildsModule,
    ContainersModule,
  ],
  controllers: [DeploymentsController],
  providers: [DeploymentsService],
  exports: [DeploymentsService],
})
export class DeploymentsModule {}