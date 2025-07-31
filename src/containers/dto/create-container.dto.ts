import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateContainerDto {
  @ApiProperty({
    example: 'my-container',
    description: 'Container name',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'node:18',
    description: 'Docker image to use',
  })
  @IsNotEmpty()
  @IsString()
  image!: string;

  @ApiProperty({
    example: 3000,
    description: 'Port to expose',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  port?: number;

  @ApiProperty({
    example: { NODE_ENV: 'production' },
    description: 'Environment variables',
    required: false,
  })
  @IsOptional()
  env?: Record<string, string>;
}