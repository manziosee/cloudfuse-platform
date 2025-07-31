import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Deployment } from './entities/deployment.entity';
import { KubernetesService } from '@containers/kubernetes.service';
import { User } from '@users/entities/user.entity';
import { CreateDeploymentDto } from './dto/create-deployment.dto';

@Injectable()
export class DeploymentsService {
  constructor(
    @InjectRepository(Deployment)
    private deploymentsRepository: Repository<Deployment>,
    private kubernetesService: KubernetesService,
  ) {}

  async create(
    createDeploymentDto: CreateDeploymentDto,
    appId: string,
    user: User,
  ): Promise<Deployment> {
    // TODO: Implement actual creation logic
    throw new Error('Not implemented');
  }

  async findAll(options: FindManyOptions<Deployment>) {
    const [results, total] = await this.deploymentsRepository.findAndCount({
      ...options,
      relations: ['app', 'user'],
      order: { createdAt: 'DESC' },
    });

    return {
      results,
      total,
      page: options.skip && options.take ? options.skip / options.take + 1 : 1,
      limit: options.take,
    };
  }

  async findOne(id: string, userId: string): Promise<Deployment> {
    const deployment = await this.deploymentsRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['app', 'user'],
    });

    if (!deployment) {
      throw new NotFoundException('Deployment not found');
    }

    return deployment;
  }

  async getLogs(id: string, userId: string) {
    const deployment = await this.findOne(id, userId);
    const deploymentName = deployment.metadata?.deploymentName;
    if (!deploymentName) {
      throw new NotFoundException('Deployment name is missing');
    }
    const logs = await this.kubernetesService.getPodLogs(deploymentName);

    return {
      buildLogs: deployment.metadata.buildLogs || [],
      runtimeLogs: logs,
    };
  }

  async restart(id: string, userId: string): Promise<Deployment> {
    const deployment = await this.findOne(id, userId);
    const deploymentName = deployment.metadata?.deploymentName;
    if (!deploymentName) {
      throw new NotFoundException('Deployment name is missing');
    }
    await this.kubernetesService.restartDeployment(deploymentName);

    return this.deploymentsRepository.save({
      ...deployment,
      status: 'active',
      updatedAt: new Date(),
    });
  }

  async scale(id: string, replicas: number, userId: string): Promise<Deployment> {
    const deployment = await this.findOne(id, userId);
    const deploymentName = deployment.metadata?.deploymentName;
    if (!deploymentName) {
      throw new NotFoundException('Deployment name is missing');
    }
    await this.kubernetesService.scaleDeployment(deploymentName, replicas);

    return this.deploymentsRepository.save({
      ...deployment,
      metadata: {
        ...deployment.metadata,
        replicas,
      },
      updatedAt: new Date(),
    });
  }
}