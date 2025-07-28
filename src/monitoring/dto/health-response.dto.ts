import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({
    description: 'Overall system status',
    enum: ['ok', 'degraded', 'critical'],
  })
  status!: string;  // definite assignment assertion to fix error

  @ApiProperty({
    description: 'Health check details',
    type: 'object',
    additionalProperties: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        details: { type: 'object' },
      },
    },
    example: {
      database: { status: 'up' },
      redis: { status: 'up' },
    },
  })
  details!: Record<string, any>;  // definite assignment assertion to fix error
}