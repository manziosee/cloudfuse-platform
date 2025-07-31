# Supabase Setup Guide for CloudFuse Platform

This guide will help you set up and configure Supabase for your CloudFuse Platform project.

## 🚀 Quick Start

### 1. Environment Configuration

Create a `.env` file in your project root with the following configuration:

```env
# Supabase Configuration
SUPABASE_URL=https://qrnpxjurvbhxixmlwbbr.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFybnB4anVydmJoeGl4bWx3YmJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzU2NjYsImV4cCI6MjA2OTU1MTY2Nn0._MN_c6XDyVClFnv-eZvvudtHEzldHpXAMJlH5Eq9uhg
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFybnB4anVydmJoeGl4bWx3YmJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk3NTY2NiwiZXhwIjoyMDY5NTUxNjY2fQ.0KdtCNhuHWMTmJyON0hbheGbYpsRtlAx9oisj7nT4As
SUPABASE_JWT_SECRET=MuAvbp7QnQdZZJEb1LyOvJHuL8qr85VtgC222g6dTQ6E+QLLQhxS7nmx9tIxfALqQQ13SbXw4My7pT2Hiap9ng==

# Database Configuration (Supabase)
DB_HOST=db.qrnpxjurvbhxixmlwbbr.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=MuAvbp7QnQdZZJEb1LyOvJHuL8qr85VtgC222g6dTQ6E+QLLQhxS7nmx9tIxfALqQQ13SbXw4My7pT2Hiap9ng==
DB_NAME=postgres

# JWT Configuration
JWT_SECRET=MuAvbp7QnQdZZJEb1LyOvJHuL8qr85VtgC222g6dTQ6E+QLLQhxS7nmx9tIxfALqQQ13SbXw4My7pT2Hiap9ng==
JWT_EXPIRES_IN=24h

# App Configuration
PORT=3000
NODE_ENV=development

# Docker Configuration
DOCKER_SOCKET=/var/run/docker.sock

# Kubernetes Configuration
KUBE_NAMESPACE=default

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Throttle Configuration
THROTTLE_TTL=60
THROTTLE_LIMIT=100
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build the Project

```bash
npm run build
```

### 4. Start the Application

```bash
npm run start:dev
```

## 🔧 Features Implemented

### Authentication Integration
- **Supabase Auth**: Integrated Supabase authentication with fallback to local auth
- **JWT Tokens**: Uses Supabase JWT tokens for authentication
- **User Management**: Automatic user creation in local database when authenticated via Supabase

### Database Integration
- **PostgreSQL**: Connected to Supabase PostgreSQL database
- **SSL Support**: Configured for secure database connections
- **TypeORM**: Full TypeORM integration with Supabase

### API Features
- **Swagger Documentation**: Auto-generated API documentation
- **Rate Limiting**: Configured with ThrottlerModule
- **Health Checks**: Built-in health monitoring
- **Container Management**: Docker and Kubernetes integration

## 📊 Database Schema

The application will automatically create the following tables in your Supabase database:

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  supabase_id VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Apps Table
```sql
CREATE TABLE apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  description TEXT,
  repository_url VARCHAR,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Deployments Table
```sql
CREATE TABLE deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'pending',
  url VARCHAR,
  metadata JSONB,
  app_id UUID REFERENCES apps(id),
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Containers Table
```sql
CREATE TABLE containers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  container_id VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'stopped',
  metadata JSONB,
  app_id UUID REFERENCES apps(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Authentication Flow

1. **Registration**: Users can register via Supabase Auth or local registration
2. **Login**: Supports both Supabase and local authentication
3. **Token Verification**: JWT tokens are verified using Supabase JWT secret
4. **User Sync**: Local database is automatically synced with Supabase users

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Applications
- `GET /api/apps` - List applications
- `POST /api/apps` - Create application
- `GET /api/apps/:id` - Get application details
- `PUT /api/apps/:id` - Update application
- `DELETE /api/apps/:id` - Delete application

### Deployments
- `GET /api/deployments` - List deployments
- `POST /api/deployments` - Create deployment
- `GET /api/deployments/:id` - Get deployment details
- `POST /api/deployments/:id/restart` - Restart deployment
- `POST /api/deployments/:id/scale` - Scale deployment

### Containers
- `GET /api/containers` - List containers
- `POST /api/containers` - Create container
- `GET /api/containers/:id` - Get container details
- `PUT /api/containers/:id` - Update container
- `DELETE /api/containers/:id` - Delete container

### Languages
- `GET /api/languages` - Get supported languages
- `GET /api/languages/frameworks` - Get supported frameworks

## 📚 Swagger Documentation

Generate API documentation:

```bash
npm run swagger:generate
```

This will create:
- `swagger.yaml` - OpenAPI specification
- `swagger.json` - JSON format specification

Access the Swagger UI at: `http://localhost:3000/api/docs`

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SUPABASE_URL` | Supabase project URL | Required |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | Required |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Required |
| `SUPABASE_JWT_SECRET` | JWT secret for token verification | Required |
| `DB_HOST` | Database host | Supabase host |
| `DB_PORT` | Database port | 5432 |
| `DB_USERNAME` | Database username | postgres |
| `DB_PASSWORD` | Database password | Supabase password |
| `DB_NAME` | Database name | postgres |
| `JWT_SECRET` | JWT signing secret | Supabase JWT secret |
| `JWT_EXPIRES_IN` | JWT expiration time | 24h |

## 🛠️ Development

### Running Tests
```bash
npm run test
```

### Linting
```bash
npm run lint
```

### Building for Production
```bash
npm run build
npm run start:prod
```

## 🔍 Monitoring

### Health Checks
- `GET /health` - Application health status
- `GET /health/database` - Database connection status
- `GET /health/kubernetes` - Kubernetes cluster status

### Logging
The application uses Winston for logging with different levels:
- `error` - Error messages
- `warn` - Warning messages
- `info` - Information messages
- `debug` - Debug messages (development only)

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify Supabase credentials in `.env` file
   - Check if Supabase project is active
   - Ensure SSL is properly configured

2. **Authentication Errors**
   - Verify JWT secret matches Supabase configuration
   - Check if user exists in both Supabase and local database
   - Ensure proper CORS configuration

3. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript configuration
   - Verify all environment variables are set

### Support

For issues related to:
- **Supabase**: Check [Supabase Documentation](https://supabase.com/docs)
- **NestJS**: Check [NestJS Documentation](https://docs.nestjs.com)
- **TypeORM**: Check [TypeORM Documentation](https://typeorm.io)

## 📝 License

This project is licensed under the ISC License. 