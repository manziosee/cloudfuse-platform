import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { HealthCheckResult } from '@nestjs/terminus';

@ApiTags('Monitoring')
@ApiBearerAuth('JWT-auth')
@Controller('monitor')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) {}

  @Get('health')
  @ApiOperation({ summary: 'Get system health status' })
  @ApiResponse({
    status: 200,
    description: 'System health status',
  })
  async getHealth(): Promise<HealthCheckResult> {
    return this.monitorService.getSystemHealth();
  }

  @Get('metrics/:appId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get application metrics' })
  @ApiResponse({
    status: 200,
    description: 'Application metrics data',
  })
  async getMetrics(@Param('appId') appId: string) {
    return this.monitorService.getDeploymentMetrics(appId);
  }
}