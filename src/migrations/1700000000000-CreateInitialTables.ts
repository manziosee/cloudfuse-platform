import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1700000000000 implements MigrationInterface {
  name = 'CreateInitialTables1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "name" character varying NOT NULL,
        "supabaseId" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )
    `);

    // Create apps table
    await queryRunner.query(`
      CREATE TABLE "apps" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying NOT NULL,
        "description" text,
        "repositoryUrl" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" uuid,
        CONSTRAINT "PK_947a9aae37ceb5c87a0b2c7c8e9" PRIMARY KEY ("id")
      )
    `);

    // Create deployments table
    await queryRunner.query(`
      CREATE TABLE "deployments" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "version" character varying NOT NULL,
        "status" character varying NOT NULL DEFAULT 'pending',
        "url" character varying,
        "metadata" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "appId" uuid,
        "userId" uuid,
        CONSTRAINT "PK_deployments_id" PRIMARY KEY ("id")
      )
    `);

    // Create containers table
    await queryRunner.query(`
      CREATE TABLE "containers" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying NOT NULL,
        "containerId" character varying NOT NULL,
        "type" character varying NOT NULL,
        "status" character varying NOT NULL DEFAULT 'stopped',
        "metadata" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "appId" uuid,
        CONSTRAINT "PK_containers_id" PRIMARY KEY ("id")
      )
    `);

    // Create languages table
    await queryRunner.query(`
      CREATE TABLE "languages" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying NOT NULL,
        "versions" text NOT NULL,
        "metadata" jsonb,
        CONSTRAINT "UQ_languages_name" UNIQUE ("name"),
        CONSTRAINT "PK_languages_id" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "apps" 
      ADD CONSTRAINT "FK_apps_userId" 
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "deployments" 
      ADD CONSTRAINT "FK_deployments_appId" 
      FOREIGN KEY ("appId") REFERENCES "apps"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "deployments" 
      ADD CONSTRAINT "FK_deployments_userId" 
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "containers" 
      ADD CONSTRAINT "FK_containers_appId" 
      FOREIGN KEY ("appId") REFERENCES "apps"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Insert default language data
    await queryRunner.query(`
      INSERT INTO "languages" ("name", "versions", "metadata") VALUES
      ('NODE', '16,18,20', '{"dockerImagePattern": "node:{{version}}", "defaultVersion": "18", "packageManager": "npm"}'),
      ('PYTHON', '3.8,3.9,3.10,3.11', '{"dockerImagePattern": "python:{{version}}", "defaultVersion": "3.11", "packageManager": "pip"}'),
      ('JAVA', '8,11,17,21', '{"dockerImagePattern": "openjdk:{{version}}", "defaultVersion": "17", "packageManager": "maven"}'),
      ('GO', '1.19,1.20,1.21', '{"dockerImagePattern": "golang:{{version}}", "defaultVersion": "1.21", "packageManager": "go mod"}'),
      ('RUBY', '3.0,3.1,3.2', '{"dockerImagePattern": "ruby:{{version}}", "defaultVersion": "3.2", "packageManager": "bundle"}'),
      ('PHP', '8.0,8.1,8.2', '{"dockerImagePattern": "php:{{version}}", "defaultVersion": "8.2", "packageManager": "composer"}')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    await queryRunner.query(`ALTER TABLE "containers" DROP CONSTRAINT "FK_containers_appId"`);
    await queryRunner.query(`ALTER TABLE "deployments" DROP CONSTRAINT "FK_deployments_userId"`);
    await queryRunner.query(`ALTER TABLE "deployments" DROP CONSTRAINT "FK_deployments_appId"`);
    await queryRunner.query(`ALTER TABLE "apps" DROP CONSTRAINT "FK_apps_userId"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "languages"`);
    await queryRunner.query(`DROP TABLE "containers"`);
    await queryRunner.query(`DROP TABLE "deployments"`);
    await queryRunner.query(`DROP TABLE "apps"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
} 