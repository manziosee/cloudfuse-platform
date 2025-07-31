import { Module } from '@nestjs/common';
import { BuildService } from './builds.service';
import { BuildsController } from './builds.controller';
import { DockerService } from '@containers/docker.service';
import { LanguagesService } from '@languages/services/languages.service';

@Module({
  imports: [],
  controllers: [BuildsController],
  providers: [BuildService, DockerService, LanguagesService],
  exports: [BuildService],
})
export class BuildsModule {}