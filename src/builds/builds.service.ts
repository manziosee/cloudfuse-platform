import { Injectable, Logger } from '@nestjs/common';
import Docker from 'dockerode';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import * as tar from 'tar-fs';
import * as tmp from 'tmp';
import { LanguagesService } from '@languages/services/languages.service';
import { BuildResult } from '../interfaces/build-result.interface';

@Injectable()
export class BuildService {
  private docker: Docker;
  private readonly logger = new Logger(BuildService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly languagesService: LanguagesService,
  ) {
    this.docker = new Docker({
      socketPath: this.configService.get<string>('DOCKER_SOCKET'),
    });
  }

  async buildImage(
    appId: string,
    sourceCode: Buffer,
    language?: string,
    version?: string,
  ): Promise<BuildResult> {
    const tmpDir = tmp.dirSync({ unsafeCleanup: true });
    const buildDir = tmpDir.name;
    const imageName = `cloudfuse-app-${appId}:${uuidv4()}`;

    try {
      // Write source code to a temporary file
      const sourceTarPath = path.join(buildDir, 'source.tar.gz');
      fs.writeFileSync(sourceTarPath, sourceCode);

      // Extract source code
      await this.extractTar(sourceTarPath, buildDir);

      // Detect language/framework if not specified
      let detectedConfig;
      if (!language) {
        detectedConfig = await this.languagesService.detectLanguage(sourceCode);
        language = detectedConfig.language;
        version = detectedConfig.version;
      }

      // Generate Dockerfile
      const dockerfileContent = await this.languagesService.generateDockerfile({
        language,
        version,
        framework: detectedConfig?.framework,
      });
      fs.writeFileSync(path.join(buildDir, 'Dockerfile'), dockerfileContent);

      // Build Docker image
      const tarStream = tar.pack(buildDir);
      const buildStream = await this.docker.buildImage(tarStream, {
        t: imageName,
      });

      await new Promise((resolve, reject) => {
        this.docker.modem.followProgress(buildStream, (err, res) =>
          err ? reject(err) : resolve(res),
        );
      });

      this.logger.log(`Successfully built image: ${imageName}`);
      return {
        success: true,
        imageName,
        language,
        version,
        framework: detectedConfig?.framework,
      };
    } catch (error) {
      this.logger.error(`Error building image: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    } finally {
      tmpDir.removeCallback();
    }
  }

  private async extractTar(tarPath: string, destination: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const extract = tar.extract(destination);
      const readStream = fs.createReadStream(tarPath);

      readStream.pipe(extract);

      extract.on('finish', resolve);
      extract.on('error', reject);
      readStream.on('error', reject);
    });
  }
}