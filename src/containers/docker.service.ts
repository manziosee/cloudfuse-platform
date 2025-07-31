import { Injectable, Logger } from '@nestjs/common';
import * as Docker from 'dockerode';
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
    } catch (error: any) {
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
    } catch (error: any) {
      this.logger.error(`Error starting container: ${error.message}`);
      throw error;
    }
  }

  async stopContainer(containerId: string) {
    try {
      const container = this.docker.getContainer(containerId);
      await container.stop();
      this.logger.log(`Container stopped: ${containerId}`);
      return container;
    } catch (error: any) {
      this.logger.error(`Error stopping container: ${error.message}`);
      throw error;
    }
  }

  async getContainerLogs(containerId: string): Promise<string[]> {
    try {
      const container = this.docker.getContainer(containerId);
      const logs = await container.logs({
        stdout: true,
        stderr: true,
        tail: 100, // Get last 100 lines
      });
      
      // Convert Buffer to string and split by lines
      const logLines = logs.toString('utf8').split('\n').filter(line => line.trim());
      this.logger.log(`Retrieved ${logLines.length} log lines for container: ${containerId}`);
      return logLines;
    } catch (error: any) {
      this.logger.error(`Error getting container logs: ${error.message}`);
      return [`Error retrieving logs: ${error.message}`];
    }
  }

  async getContainerStats(containerId: string): Promise<any> {
    try {
      const container = this.docker.getContainer(containerId);
      const stats = await container.stats({ stream: false });
      
      // Parse Docker stats format
      const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
      const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
      const cpuPercent = (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100;
      
      const memoryUsage = stats.memory_stats.usage || 0;
      const memoryLimit = stats.memory_stats.limit || 1;
      const memoryPercent = (memoryUsage / memoryLimit) * 100;
      
      const result = {
        containerId,
        type: 'docker',
        stats: {
          cpu: {
            usage: cpuPercent.toFixed(2) + '%',
            raw: cpuPercent
          },
          memory: {
            usage: this.formatBytes(memoryUsage),
            limit: this.formatBytes(memoryLimit),
            percent: memoryPercent.toFixed(2) + '%',
            raw: memoryUsage
          },
          network: {
            rx_bytes: stats.networks ? Object.values(stats.networks).reduce((acc: any, net: any) => acc + (net.rx_bytes || 0), 0) : 0,
            tx_bytes: stats.networks ? Object.values(stats.networks).reduce((acc: any, net: any) => acc + (net.tx_bytes || 0), 0) : 0
          },
          timestamp: new Date().toISOString()
        }
      };
      
      this.logger.log(`Retrieved stats for container: ${containerId}`);
      return result;
    } catch (error: any) {
      this.logger.error(`Error getting container stats: ${error.message}`);
      return {
        containerId,
        type: 'docker',
        stats: {
          cpu: 'N/A',
          memory: 'N/A',
          network: 'N/A',
          error: error.message
        }
      };
    }
  }

  async listContainers(all = true) {
    try {
      return await this.docker.listContainers({ all });
    } catch (error: any) {
      this.logger.error(`Error listing containers: ${error.message}`);
      throw error;
    }
  }

  async removeContainer(containerId: string) {
    try {
      const container = this.docker.getContainer(containerId);
      await container.remove({ force: true });
      this.logger.log(`Container removed: ${containerId}`);
    } catch (error: any) {
      this.logger.error(`Error removing container: ${error.message}`);
      throw error;
    }
  }

  async getContainerInfo(containerId: string) {
    try {
      const container = this.docker.getContainer(containerId);
      const info = await container.inspect();
      return {
        id: info.Id,
        name: info.Name,
        state: info.State.Status,
        image: info.Config.Image,
        created: info.Created,
        ports: info.NetworkSettings.Ports,
        env: info.Config.Env,
        command: info.Config.Cmd
      };
    } catch (error: any) {
      this.logger.error(`Error getting container info: ${error.message}`);
      throw error;
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}