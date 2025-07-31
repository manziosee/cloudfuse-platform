import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DeploymentsService } from './deployments.service';
import { CreateDeploymentDto } from './dto/create-deployment.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { User } from '@users/entities/user.entity';
import { Deployment } from './entities/deployment.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { ApiPaginatedResponse } from '@common/decorators/api-pagination.decorator';

@ApiTags('Deployments')
@ApiBearerAuth('JWT-auth')
@Controller('deployments')
@UseGuards(JwtAuthGuard)
export class DeploymentsController {
  constructor(private readonly deploymentsService: DeploymentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new deployment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Deployment created successfully',
    type: Deployment,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiBody({ type: CreateDeploymentDto })
  async create(
    @Body() createDeploymentDto: CreateDeploymentDto,
    @Req() req: Request & { user: User },
  ) {
    return this.deploymentsService.create(
      createDeploymentDto,
      createDeploymentDto.appId,
      req.user,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all deployments for current user' })
  @ApiPaginatedResponse(Deployment)
  @ApiQuery({
    name: 'appId',
    required: false,
    description: 'Filter deployments by application ID',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter deployments by status',
    enum: ['pending', 'building', 'active', 'failed'],
  })
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @Req() req: Request & { user: User },
    @Query('appId') appId?: string,
    @Query('status') status?: string,
  ) {
    const where: any = {
      user: { id: req.user.id },
    };

    if (appId) {
      where.app = { id: appId };
    }

    if (status) {
      where.status = status;
    }

    return this.deploymentsService.findAll({
      ...paginationQuery,
      where,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get deployment by ID' })
  @ApiParam({ name: 'id', description: 'Deployment ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deployment details',
    type: Deployment,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Deployment not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async findOne(
    @Param('id') id: string,
    @Req() req: Request & { user: User },
  ) {
    return this.deploymentsService.findOne(id, req.user.id);
  }

  @Get(':id/logs')
  @ApiOperation({ summary: 'Get deployment logs' })
  @ApiParam({ name: 'id', description: 'Deployment ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deployment logs',
    schema: {
      type: 'object',
      properties: {
        buildLogs: { type: 'array', items: { type: 'string' } },
        runtimeLogs: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  async getLogs(
    @Param('id') id: string,
    @Req() req: Request & { user: User },
  ) {
    return this.deploymentsService.getLogs(id, req.user.id);
  }

  @Post(':id/restart')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restart a deployment' })
  @ApiParam({ name: 'id', description: 'Deployment ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deployment restarted successfully',
    type: Deployment,
  })
  async restart(
    @Param('id') id: string,
    @Req() req: Request & { user: User },
  ) {
    return this.deploymentsService.restart(id, req.user.id);
  }

  @Post(':id/scale')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Scale a deployment' })
  @ApiParam({ name: 'id', description: 'Deployment ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        replicas: { type: 'number', minimum: 1, maximum: 10 },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Deployment scaled successfully',
    type: Deployment,
  })
  async scale(
    @Param('id') id: string,
    @Body('replicas') replicas: number,
    @Req() req: Request & { user: User },
  ) {
    return this.deploymentsService.scale(id, replicas, req.user.id);
  }
}