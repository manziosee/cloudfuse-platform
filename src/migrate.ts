import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

async function runMigrations() {
  console.log('🚀 Starting database migrations...');
  
  try {
    // Create a minimal app instance to get the DataSource
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);
    const configService = app.get(ConfigService);

    console.log('📊 Database configuration:');
    console.log(`   Host: ${configService.get('database.host')}`);
    console.log(`   Database: ${configService.get('database.name')}`);
    console.log(`   Port: ${configService.get('database.port')}`);

    // Test database connection
    console.log('🔌 Testing database connection...');
    await dataSource.initialize();
    console.log('✅ Database connection successful!');

    // Run migrations
    console.log('🔄 Running migrations...');
    const migrations = await dataSource.runMigrations();
    
    if (migrations.length === 0) {
      console.log('✅ No pending migrations to run.');
    } else {
      console.log(`✅ Successfully ran ${migrations.length} migration(s):`);
      migrations.forEach((migration, index) => {
        console.log(`   ${index + 1}. ${migration.name}`);
      });
    }

    // Show current migration status
    console.log('📋 Current migration status:');
    const executedMigrations = await dataSource.query(
      'SELECT * FROM "migrations" ORDER BY "timestamp"'
    );
    
    if (executedMigrations.length === 0) {
      console.log('   No migrations have been executed yet.');
    } else {
      executedMigrations.forEach((migration: any) => {
        console.log(`   ✅ ${migration.name} (${new Date(migration.timestamp).toISOString()})`);
      });
    }

    await dataSource.destroy();
    await app.close();
    
    console.log('🎉 Migration process completed successfully!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
} 