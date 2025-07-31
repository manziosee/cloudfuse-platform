export interface BuildResult {
  success: boolean;
  imageName?: string;
  language?: string;
  version?: string;
  framework?: string;
  error?: string;
}