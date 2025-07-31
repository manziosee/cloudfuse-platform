import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  environment: process.env.NODE_ENV || 'development',
  app: {
    port: parseInt(process.env.PORT || '3000', 10),
    apiPrefix: process.env.API_PREFIX || 'api',
  },
  database: {
    host: process.env.DB_HOST || 'db.qrnpxjurvbhxixmlwbbr.supabase.co',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'MuAvbp7QnQdZZJEb1LyOvJHuL8qr85VtgC222g6dTQ6E+QLLQhxS7nmx9tIxfALqQQ13SbXw4My7pT2Hiap9ng==',
    name: process.env.DB_NAME || 'postgres',
  },
  supabase: {
    url: process.env.SUPABASE_URL || 'https://qrnpxjurvbhxixmlwbbr.supabase.co',
    anonKey: process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFybnB4anVydmJoeGl4bWx3YmJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzU2NjYsImV4cCI6MjA2OTU1MTY2Nn0._MN_c6XDyVClFnv-eZvvudtHEzldHpXAMJlH5Eq9uhg',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFybnB4anVydmJoeGl4bWx3YmJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk3NTY2NiwiZXhwIjoyMDY5NTUxNjY2fQ.0KdtCNhuHWMTmJyON0hbheGbYpsRtlAx9oisj7nT4As',
    jwtSecret: process.env.SUPABASE_JWT_SECRET || 'MuAvbp7QnQdZZJEb1LyOvJHuL8qr85VtgC222g6dTQ6E+QLLQhxS7nmx9tIxfALqQQ13SbXw4My7pT2Hiap9ng==',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'MuAvbp7QnQdZZJEb1LyOvJHuL8qr85VtgC222g6dTQ6E+QLLQhxS7nmx9tIxfALqQQ13SbXw4My7pT2Hiap9ng==',
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