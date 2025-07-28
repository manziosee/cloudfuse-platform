import { Module } from '@nestjs/common';
import { LanguagesService } from '../services/languages.service';
import { LanguagesController } from '../controllers/languages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BuildsModule } from '../../builds/builds.module';
@Module({
  imports: [TypeOrmModule.forFeature([]), ConfigModule, BuildsModule],
  controllers: [LanguagesController],
  providers: [LanguagesService],
  exports: [LanguagesService],
})
export class LanguagesModule {}