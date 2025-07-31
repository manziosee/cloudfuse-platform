import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class LanguageConfigDto {
  @ApiProperty({
    example: 'node',
    description: 'Programming language',
  })
  @IsString()
  language!: string;

  @ApiProperty({
    example: '18',
    description: 'Language version',
    required: false,
  })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiProperty({
    example: 'express',
    description: 'Framework',
    required: false,
  })
  @IsOptional()
  @IsString()
  framework?: string;

  @ApiProperty({
    example: 'npm start',
    description: 'Start command',
    required: false,
  })
  @IsOptional()
  @IsString()
  startCommand?: string;

  @ApiProperty({
    example: 'npm install',
    description: 'Build command',
    required: false,
  })
  @IsOptional()
  @IsString()
  buildCommand?: string;
}