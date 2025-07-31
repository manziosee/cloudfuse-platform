import { Injectable } from '@nestjs/common';
import { SUPPORTED_LANGUAGES, FRAMEWORK_CONFIGS } from '../constants/language.constants';
import { ConfigService } from '@nestjs/config';
import { LanguageConfig } from '../interfaces/language-config.interface';

@Injectable()
export class LanguagesService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  getSupportedLanguages() {
    return Object.keys(SUPPORTED_LANGUAGES).map(key => ({
      id: key,
      name: SUPPORTED_LANGUAGES[key as keyof typeof SUPPORTED_LANGUAGES].name,
      versions: SUPPORTED_LANGUAGES[key as keyof typeof SUPPORTED_LANGUAGES].versions,
    }));
  }

  getSupportedFrameworks() {
    return Object.keys(FRAMEWORK_CONFIGS).map(key => ({
      id: key,
      name: FRAMEWORK_CONFIGS[key as keyof typeof FRAMEWORK_CONFIGS].name,
      language: FRAMEWORK_CONFIGS[key as keyof typeof FRAMEWORK_CONFIGS].language,
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
    
    if (framework && FRAMEWORK_CONFIGS[framework as keyof typeof FRAMEWORK_CONFIGS]) {
      const frameworkConfig = FRAMEWORK_CONFIGS[framework as keyof typeof FRAMEWORK_CONFIGS];
      return this.generateFrameworkDockerfile(frameworkConfig, version);
    }
    
    if (SUPPORTED_LANGUAGES[language as keyof typeof SUPPORTED_LANGUAGES]) {
      return SUPPORTED_LANGUAGES[language as keyof typeof SUPPORTED_LANGUAGES].template.replace('{{version}}', version);
    }
    
    throw new Error(`Unsupported language: ${language}`);
  }

  private generateFrameworkDockerfile(frameworkConfig: any, version: string): string {
    const languageConfig = SUPPORTED_LANGUAGES[frameworkConfig.language as keyof typeof SUPPORTED_LANGUAGES];
    let dockerfile = languageConfig.template.replace('{{version}}', version);
    
    // Add framework-specific commands
    dockerfile += `\nRUN ${frameworkConfig.buildCommand}`;
    dockerfile += `\nCMD ${frameworkConfig.startCommand}`;
    
    return dockerfile;
  }
}