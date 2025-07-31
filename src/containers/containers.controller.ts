import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContainersService } from './containers.service';
import { DockerService } from './docker.service';
import { KubernetesService } from './kubernetes.service';

@ApiTags('containers')
@Controller('containers')
export class ContainersController {
  constructor(
    private readonly containersService: ContainersService,
    private readonly dockerService: DockerService,
    private readonly kubernetesService: KubernetesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all containers' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of containers retrieved successfully' 
  })
  async getAllContainers() {
    return this.containersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get container by ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Container retrieved successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Container not found' 
  })
  async getContainerById(@Param('id') id: string) {
    return this.containersService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new container' })
  @ApiResponse({ 
    status: 201, 
    description: 'Container created successfully' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request' 
  })
  async createContainer(@Body() createContainerDto: any) {
    return this.containersService.create(createContainerDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update container' })
  @ApiResponse({ 
    status: 200, 
    description: 'Container updated successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Container not found' 
  })
  async updateContainer(
    @Param('id') id: string,
    @Body() updateContainerDto: any,
  ) {
    return this.containersService.update(id, updateContainerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete container' })
  @ApiResponse({ 
    status: 204, 
    description: 'Container deleted successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Container not found' 
  })
  async deleteContainer(@Param('id') id: string) {
    return this.containersService.delete(id);
  }

  @Get(':id/logs')
  @ApiOperation({ summary: 'Get container logs' })
  @ApiResponse({ 
    status: 200, 
    description: 'Container logs retrieved successfully' 
  })
  async getContainerLogs(@Param('id') id: string) {
    return this.containersService.getLogs(id);
  }

  @Post(':id/start')
  @ApiOperation({ summary: 'Start container' })
  @ApiResponse({ 
    status: 200, 
    description: 'Container started successfully' 
  })
  async startContainer(@Param('id') id: string) {
    return this.containersService.start(id);
  }

  @Post(':id/stop')
  @ApiOperation({ summary: 'Stop container' })
  @ApiResponse({ 
    status: 200, 
    description: 'Container stopped successfully' 
  })
  async stopContainer(@Param('id') id: string) {
    return this.containersService.stop(id);
  }

  @Post(':id/restart')
  @ApiOperation({ summary: 'Restart container' })
  @ApiResponse({ 
    status: 200, 
    description: 'Container restarted successfully' 
  })
  async restartContainer(@Param('id') id: string) {
    return this.containersService.restart(id);
  }
}