import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  environment: process.env.NODE_ENV || 'development',
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
    apiPrefix: process.env.API_PREFIX || 'api',
  },
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  docker: {
    socketPath: process.env.DOCKER_SOCKET || '/var/run/docker.sock',
  },
  kubernetes: {
    configPath: process.env.KUBE_CONFIG_PATH || '~/.kube/config',
    namespace: process.env.KUBE_NAMESPACE || 'default',
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
}));