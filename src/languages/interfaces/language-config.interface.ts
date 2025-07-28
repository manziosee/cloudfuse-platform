export interface LanguageConfig {
  language: string;
  version: string;
  framework?: string;
  buildCommand?: string;
  startCommand?: string;
  envVars?: Record<string, string>;
  port?: number;
}