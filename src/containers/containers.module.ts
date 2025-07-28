import { Module } from '@nestjs/common';
import { ContainersService } from './containers.service';
import { ContainersController } from './containers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Container } from './entities/container.entity';
import { DockerService } from './docker.service';
import { KubernetesService } from './kubernetes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Container])],
  controllers: [ContainersController],
  providers: [ContainersService, DockerService, KubernetesService],
  exports: [ContainersService],
})
export class ContainersModule {}