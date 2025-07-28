import { Module } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { MonitorController } from './monitor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deployment } from '@deployments/entities/deployment.entity';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MetricsService } from './metrics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Deployment]),
    PrometheusModule.register(),
  ],
  controllers: [MonitorController],
  providers: [MonitorService, MetricsService],
  exports: [MonitorService, MetricsService],
})
export class MonitorModule {}