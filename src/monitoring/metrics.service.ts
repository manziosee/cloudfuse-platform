import { Injectable } from '@nestjs/common';
import { Gauge, Counter, Histogram } from 'prom-client';

@Injectable()
export class MetricsService {
  public readonly httpRequestCounter: Counter<string>;
  public readonly httpRequestDuration: Histogram<string>;
  public readonly memoryUsage: Gauge<string>;
  public readonly cpuUsage: Gauge<string>;

  constructor() {
    this.httpRequestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'path', 'status'],
    });

    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'path', 'status'],
      buckets: [0.1, 0.5, 1, 5, 10],
    });

    this.memoryUsage = new Gauge({
      name: 'node_memory_usage_bytes',
      help: 'Memory usage in bytes',
      labelNames: ['type'],
    });

    this.cpuUsage = new Gauge({
      name: 'node_cpu_usage_percent',
      help: 'CPU usage percentage',
    });
  }

  recordRequest(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
  ) {
    this.httpRequestCounter.inc({ method, path, status: statusCode });
    this.httpRequestDuration.observe(
      { method, path, status: statusCode },
      duration,
    );
  }

  recordMemoryUsage(heapUsed: number, heapTotal: number) {
    this.memoryUsage.set({ type: 'heap_used' }, heapUsed);
    this.memoryUsage.set({ type: 'heap_total' }, heapTotal);
  }

  recordCpuUsage(usage: number) {
    this.cpuUsage.set(usage);
  }
}