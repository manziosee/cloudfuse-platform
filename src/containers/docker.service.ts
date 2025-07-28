import { Injectable, Logger } from '@nestjs/common';
import Docker from 'dockerode';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DockerService {
  private docker: Docker;
  private readonly logger = new Logger(DockerService.name);

  constructor(private readonly configService: ConfigService) {
    this.docker = new Docker({
      socketPath: this.configService.get<string>('docker.socketPath'),
    });
  }

  async createContainer(image: string, options: any) {
    try {
      const container = await this.docker.createContainer({
        Image: image,
        ...options,
      });
      this.logger.log(`Container created: ${container.id}`);
      return container;
    } catch (error) {
      this.logger.error(`Error creating container: ${error.message}`);
      throw error;
    }
  }

  async startContainer(containerId: string) {
    try {
      const container = this.docker.getContainer(containerId);
      await container.start();
      this.logger.log(`Container started: ${containerId}`);
      return container;
    } catch (error) {
      this.logger.error(`Error starting container: ${error.message}`);
      throw error;
    }
  }

  async listContainers(all = true) {
    try {
      return await this.docker.listContainers({ all });
    } catch (error) {
      this.logger.error(`Error listing containers: ${error.message}`);
      throw error;
    }
  }

  async removeContainer(containerId: string) {
    try {
      const container = this.docker.getContainer(containerId);
      await container.remove({ force: true });
      this.logger.log(`Container removed: ${containerId}`);
    } catch (error) {
      this.logger.error(`Error removing container: ${error.message}`);
      throw error;
    }
  }
}