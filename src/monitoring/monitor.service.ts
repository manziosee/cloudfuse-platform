import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthCheckResult } from '@nestjs/terminus';
import { KubernetesService } from '../containers/kubernetes.service'; 
import { Deployment } from '../deployments/entities/deployment.entity'; // Adjust the import path as necessary

@Injectable()
export class MonitorService {
  constructor(
    @InjectRepository(Deployment)
    private deploymentsRepository: Repository<Deployment>,
    private kubernetesService: KubernetesService,
  ) {}

  async getSystemHealth(): Promise<HealthCheckResult> {
    // Implement comprehensive health check
    return {
      status: 'ok',
      details: {
        database: { status: 'up' },
        kubernetes: { status: 'up' },
      },
    };
  }

  async getDeploymentMetrics(appId: string) {
    const deployment = await this.deploymentsRepository.findOne({
      where: { app: { id: appId } },
    });

    if (!deployment) {
      throw new Error('Deployment not found');
    }

    const deploymentName = deployment.metadata?.deploymentName;
    if (!deploymentName) {
      throw new Error('Deployment name is missing');
    }

    return this.kubernetesService.getDeploymentMetrics(deploymentName);
  }
}