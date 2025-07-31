import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deployment } from './entities/deployment.entity';
import { DeploymentsService } from './deployments.service';
import { AppsModule } from '../apps/apps.module';
import { DeploymentsController } from './deployments.controller'; // Adjust the import path as necessary
import { KubernetesService } from '@containers/kubernetes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Deployment]),
    AppsModule,
  ],
  controllers: [DeploymentsController],
  providers: [DeploymentsService, KubernetesService],
  exports: [DeploymentsService],
})
export class DeploymentsModule {}