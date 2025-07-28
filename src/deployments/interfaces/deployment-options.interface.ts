import { FindManyOptions } from 'typeorm';
import { Deployment } from '../entities/deployment.entity';

export interface DeploymentOptions extends FindManyOptions<Deployment> {
  where: {
    user: { id: string };
    app?: { id: string };
    status?: 'pending' | 'building' | 'active' | 'failed';
  };
}