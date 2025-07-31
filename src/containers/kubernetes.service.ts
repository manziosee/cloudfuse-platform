import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KubeConfig, AppsV1Api, CoreV1Api } from '@kubernetes/client-node';

@Injectable()
export class KubernetesService {
  private readonly logger = new Logger(KubernetesService.name);
  private appsApi: AppsV1Api;
  private coreApi: CoreV1Api;

  constructor(private configService: ConfigService) {
    const kubeConfig = new KubeConfig();
    kubeConfig.loadFromDefault();
    this.appsApi = kubeConfig.makeApiClient(AppsV1Api);
    this.coreApi = kubeConfig.makeApiClient(CoreV1Api);
  }

  async createDeployment(namespace: string, deployment: any) {
    try {
      const response = await this.appsApi.createNamespacedDeployment({
        namespace,
        body: deployment,
      });
      this.logger.log(`Deployment created: ${deployment.metadata.name}`);
      return response;
    } catch (error: any) {
      this.logger.error(
        `Error creating deployment: ${error?.body?.message || error.message}`,
      );
      throw error;
    }
  }

  async createService(namespace: string, service: any) {
    try {
      const response = await this.coreApi.createNamespacedService({
        namespace,
        body: service,
      });
      this.logger.log(`Service created: ${service.metadata.name}`);
      return response;
    } catch (error: any) {
      this.logger.error(
        `Error creating service: ${error?.body?.message || error.message}`,
      );
      throw error;
    }
  }

  async getPodLogs(deploymentName: string): Promise<string[]> {
    try {
      const namespace = this.configService.get('KUBE_NAMESPACE');
      const pods = await this.coreApi.listNamespacedPod({
        namespace,
        labelSelector: `app=${deploymentName}`,
      });

      if (pods.items.length === 0) {
        return ['No pods found'];
      }

      const logs = await Promise.all(
        pods.items.map(async (pod: any) => {
          const log = await this.coreApi.readNamespacedPodLog({
            name: pod.metadata.name,
            namespace,
          });
          return log;
        }),
      );

      return logs;
    } catch (error: any) {
      this.logger.error(`Error getting pod logs: ${error.message}`);
      return [`Error retrieving logs: ${error.message}`];
    }
  }

  async restartDeployment(deploymentName: string): Promise<void> {
    try {
      const namespace = this.configService.get('KUBE_NAMESPACE');
      await this.appsApi.patchNamespacedDeployment({
        name: deploymentName,
        namespace,
        body: {
          spec: {
            template: {
              metadata: {
                annotations: {
                  'kubectl.kubernetes.io/restartedAt': new Date().toISOString(),
                },
              },
            },
          },
        },
      });
      this.logger.log(`Deployment restarted: ${deploymentName}`);
    } catch (error: any) {
      this.logger.error(`Error restarting deployment: ${error.message}`);
      throw error;
    }
  }

  async scaleDeployment(deploymentName: string, replicas: number): Promise<void> {
    try {
      const namespace = this.configService.get('KUBE_NAMESPACE');
      await this.appsApi.patchNamespacedDeploymentScale({
        name: deploymentName,
        namespace,
        body: {
          spec: {
            replicas,
          },
        },
      });
      this.logger.log(`Deployment scaled: ${deploymentName} to ${replicas} replicas`);
    } catch (error: any) {
      this.logger.error(`Error scaling deployment: ${error.message}`);
      throw error;
    }
  }

  // For monitoring and metrics
  async getDeploymentMetrics(deploymentName: string): Promise<any> {
    // TODO: Implement actual logic to fetch metrics from Kubernetes
    return {
      deploymentName,
      metrics: {
        cpu: 'N/A',
        memory: 'N/A',
        // Add more fields as needed
      },
    };
  }
}