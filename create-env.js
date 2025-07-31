const fs = require('fs');

const envContent = `# Supabase Configuration
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
`;

fs.writeFileSync('.env', envContent);
console.log('✅ .env file created successfully!');
console.log('📋 Environment variables configured for Supabase integration'); 