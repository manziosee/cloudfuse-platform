import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Container } from './entities/container.entity';
import { DockerService } from './docker.service';
import { KubernetesService } from './kubernetes.service';

@Injectable()
export class ContainersService {
  private readonly logger = new Logger(ContainersService.name);

  constructor(
    @InjectRepository(Container)
    private containerRepository: Repository<Container>,
    private dockerService: DockerService,
    private kubernetesService: KubernetesService,
  ) {}

  async findAll() {
    try {
      const containers = await this.containerRepository.find({
        relations: ['app'],
      });
      this.logger.log(`Retrieved ${containers.length} containers`);
      return containers;
    } catch (error: any) {
      this.logger.error(`Error retrieving containers: ${error.message}`);
      throw error;
    }
  }

  async findById(id: string) {
    try {
      const container = await this.containerRepository.findOne({
        where: { id },
        relations: ['app'],
      });

      if (!container) {
        throw new NotFoundException(`Container with ID ${id} not found`);
      }

      this.logger.log(`Retrieved container: ${id}`);
      return container;
    } catch (error: any) {
      this.logger.error(`Error retrieving container ${id}: ${error.message}`);
      throw error;
    }
  }

  async create(createContainerDto: any) {
    try {
      const container = this.containerRepository.create(createContainerDto);
      const savedContainer = await this.containerRepository.save(container);
      const containerEntity = Array.isArray(savedContainer) ? savedContainer[0] : savedContainer;
      this.logger.log(`Created container: ${containerEntity.id}`);
      return containerEntity;
    } catch (error: any) {
      this.logger.error(`Error creating container: ${error.message}`);
      throw error;
    }
  }

  async update(id: string, updateContainerDto: any) {
    try {
      const container = await this.findById(id);
      Object.assign(container, updateContainerDto);
      const savedContainer = await this.containerRepository.save(container);
      const containerEntity = Array.isArray(savedContainer) ? savedContainer[0] : savedContainer;
      this.logger.log(`Updated container: ${id}`);
      return containerEntity;
    } catch (error: any) {
      this.logger.error(`Error updating container ${id}: ${error.message}`);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const container = await this.findById(id);
      // Stop the container if it's running
      if (container.status === 'running') {
        await this.stop(id);
      }
      await this.containerRepository.remove(container);
      this.logger.log(`Deleted container: ${id}`);
      return { deleted: true, id };
    } catch (error: any) {
      this.logger.error(`Error deleting container ${id}: ${error.message}`);
      throw error;
    }
  }

  async getLogs(id: string) {
    try {
      const container = await this.findById(id);
      if (container.type === 'docker') {
        return await this.dockerService.getContainerLogs(container.containerId);
      } else if (container.type === 'kubernetes') {
        return await this.kubernetesService.getPodLogs(container.containerId);
      }
      throw new Error(`Unsupported container type: ${container.type}`);
    } catch (error: any) {
      this.logger.error(`Error getting logs for container ${id}: ${error.message}`);
      throw error;
    }
  }

  async start(id: string) {
    try {
      const container = await this.findById(id);
      if (container.type === 'docker') {
        await this.dockerService.startContainer(container.containerId);
      } else if (container.type === 'kubernetes') {
        await this.kubernetesService.scaleDeployment(container.containerId, 1);
      }
      // Update container status
      container.status = 'running';
      await this.containerRepository.save(container);
      this.logger.log(`Started container: ${id}`);
      return { started: true, id };
    } catch (error: any) {
      this.logger.error(`Error starting container ${id}: ${error.message}`);
      throw error;
    }
  }

  async stop(id: string) {
    try {
      const container = await this.findById(id);
      if (container.type === 'docker') {
        await this.dockerService.stopContainer(container.containerId);
      } else if (container.type === 'kubernetes') {
        await this.kubernetesService.scaleDeployment(container.containerId, 0);
      }
      // Update container status
      container.status = 'stopped';
      await this.containerRepository.save(container);
      this.logger.log(`Stopped container: ${id}`);
      return { stopped: true, id };
    } catch (error: any) {
      this.logger.error(`Error stopping container ${id}: ${error.message}`);
      throw error;
    }
  }

  async restart(id: string) {
    try {
      await this.stop(id);
      await this.start(id);
      this.logger.log(`Restarted container: ${id}`);
      return { restarted: true, id };
    } catch (error: any) {
      this.logger.error(`Error restarting container ${id}: ${error.message}`);
      throw error;
    }
  }

  async getContainerStats(id: string) {
    try {
      const container = await this.findById(id);
      if (container.type === 'docker') {
        return await this.dockerService.getContainerStats(container.containerId);
      } else if (container.type === 'kubernetes') {
        return await this.kubernetesService.getDeploymentMetrics(container.containerId);
      }
      throw new Error(`Unsupported container type: ${container.type}`);
    } catch (error: any) {
      this.logger.error(`Error getting stats for container ${id}: ${error.message}`);
      throw error;
    }
  }
}