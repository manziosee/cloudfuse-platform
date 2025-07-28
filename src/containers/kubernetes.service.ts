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
      const response = await this.appsApi.createNamespacedDeployment(
        namespace,
        deployment,
      );
      this.logger.log(`Deployment created: ${deployment.metadata.name}`);
      return response.body;
    } catch (error) {
      this.logger.error(
        `Error creating deployment: ${error?.body?.message || error.message}`,
      );
      throw error;
    }
  }

  async createService(namespace: string, service: any) {
    try {
      const response = await this.coreApi.createNamespacedService(
        namespace,
        service,
      );
      this.logger.log(`Service created: ${service.metadata.name}`);
      return response.body;
    } catch (error) {
      this.logger.error(
        `Error creating service: ${error?.body?.message || error.message}`,
      );
      throw error;
    }
  }

  async getPodLogs(deploymentName: string): Promise<string[]> {
    try {
      const namespace = this.configService.get('KUBE_NAMESPACE');
      const pods = await this.coreApi.listNamespacedPod(
        namespace,
        undefined,
        undefined,
        undefined,
        undefined,
        `app=${deploymentName}`,
      );

      if (pods.body.items.length === 0) {
        return ['No pods found'];
      }

      const logs = await Promise.all(
        pods.body.items.map(async (pod) => {
          const log = await this.coreApi.readNamespacedPodLog(
            pod.metadata.name,
            namespace,
          );
          return log.body;
        }),
      );

      return logs;
    } catch (error) {
      this.logger.error(`Error getting pod logs: ${error.message}`);
      return [`Error retrieving logs: ${error.message}`];
    }
  }

  async restartDeployment(deploymentName: string): Promise<void> {
    try {
      const namespace = this.configService.get('KUBE_NAMESPACE');
      await this.appsApi.patchNamespacedDeployment(
        deploymentName,
        namespace,
        {
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
        undefined,
        undefined,
        undefined,
        undefined,
        {
          headers: {
            'Content-Type': 'application/strategic-merge-patch+json',
          },
        },
      );
    } catch (error) {
      this.logger.error(`Error restarting deployment: ${error.message}`);
      throw error;
    }
  }

  async scaleDeployment(deploymentName: string, replicas: number): Promise<void> {
    try {
      const namespace = this.configService.get('KUBE_NAMESPACE');
      await this.appsApi.patchNamespacedDeploymentScale(
        deploymentName,
        namespace,
        {
          spec: {
            replicas,
          },
        },
      );
    } catch (error) {
      this.logger.error(`Error scaling deployment: ${error.message}`);
      throw error;
    }
  }
}