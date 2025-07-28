export interface DeploymentMetrics {
  cpuUsage: number;
  memoryUsage: number;
  networkIn: number;
  networkOut: number;
  uptime: number;
  restarts: number;
  status: 'running' | 'stopped' | 'error';
  timestamp: Date;
}

export interface SystemMetrics {
  totalMemory: number;
  freeMemory: number;
  loadAverage: number[];
  diskUsage: {
    total: number;
    free: number;
    used: number;
  };
  containers: {
    total: number;
    running: number;
    stopped: number;
  };
}