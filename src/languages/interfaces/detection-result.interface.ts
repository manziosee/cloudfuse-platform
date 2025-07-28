export interface DetectionResult {
  language: string;
  version: string;
  framework?: string;
  confidence: number;
  files: string[];
}