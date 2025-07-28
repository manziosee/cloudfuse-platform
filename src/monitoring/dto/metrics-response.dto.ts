import { ApiProperty } from '@nestjs/swagger';

export class MetricsResponseDto {
  @ApiProperty({
    description: 'CPU usage percentage',
    example: 23.5,
  })
  cpuUsage!: number;  // definite assignment assertion

  @ApiProperty({
    description: 'Memory usage in MB',
    example: 256,
  })
  memoryUsage!: number;

  @ApiProperty({
    description: 'Network input in KB',
    example: 1024,
  })
  networkIn!: number;

  @ApiProperty({
    description: 'Network output in KB',
    example: 512,
  })
  networkOut!: number;

  @ApiProperty({
    description: 'Uptime in seconds',
    example: 3600,
  })
  uptime!: number;

  @ApiProperty({
    description: 'Container status',
    enum: ['running', 'stopped', 'error'],
  })
  status!: string;

  @ApiProperty({
    description: 'Metrics timestamp',
    example: '2023-07-20T12:00:00Z',
  })
  timestamp!: Date;
}