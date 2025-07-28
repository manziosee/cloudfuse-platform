import { Injectable } from '@nestjs/common';
import { SUPPORTED_LANGUAGES, FRAMEWORK_CONFIGS } from '../constants/language.constants';
import { BuildService } from '../../builds/builds.service';
import { ConfigService } from '@nestjs/config';
import { LanguageConfig } from '../interfaces/language-config.interface';

@Injectable()
export class LanguagesService {
  constructor(
    private readonly buildService: BuildService,
    private readonly configService: ConfigService,
  ) {}

  getSupportedLanguages() {
    return Object.keys(SUPPORTED_LANGUAGES).map(key => ({
      id: key,
      name: SUPPORTED_LANGUAGES[key].name,
      versions: SUPPORTED_LANGUAGES[key].versions,
    }));
  }

  getSupportedFrameworks() {
    return Object.keys(FRAMEWORK_CONFIGS).map(key => ({
      id: key,
      name: FRAMEWORK_CONFIGS[key].name,
      language: FRAMEWORK_CONFIGS[key].language,
    }));
  }

  async detectLanguage(sourceCode: Buffer): Promise<LanguageConfig> {
    // Implementation for detecting language/framework from source code
    // This would analyze the files in the source code to determine the language/framework
    // For simplicity, we'll return a default configuration
    
    return {
      language: 'NODE',
      version: '18',
      framework: 'EXPRESS',
      buildCommand: 'npm install',
      startCommand: 'node app.js',
    };
  }

  async generateDockerfile(config: LanguageConfig): Promise<string> {
    const { language, version, framework } = config;
    
    if (framework && FRAMEWORK_CONFIGS[framework]) {
      const frameworkConfig = FRAMEWORK_CONFIGS[framework];
      return this.generateFrameworkDockerfile(frameworkConfig, version);
    }
    
    if (SUPPORTED_LANGUAGES[language]) {
      return SUPPORTED_LANGUAGES[language].template.replace('{{version}}', version);
    }
    
    throw new Error(`Unsupported language: ${language}`);
  }

  private generateFrameworkDockerfile(frameworkConfig: any, version: string): string {
    const languageConfig = SUPPORTED_LANGUAGES[frameworkConfig.language];
    let dockerfile = languageConfig.template.replace('{{version}}', version);
    
    // Add framework-specific commands
    dockerfile += `\nRUN ${frameworkConfig.buildCommand}`;
    dockerfile += `\nCMD ${frameworkConfig.startCommand}`;
    
    return dockerfile;
  }
}