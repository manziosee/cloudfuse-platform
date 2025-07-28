import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { SUPPORTED_LANGUAGES } from '@languages/constants/language.constants';

export class CreateAppDto {
  @ApiProperty({
    example: 'my-awesome-app',
    description: 'Application name',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;  // definite assignment assertion

  @ApiProperty({
    example: 'A description of my awesome app',
    description: 'Application description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description!: string;

  @ApiProperty({
    example: 'node',
    description: 'Application language',
    enum: Object.keys(SUPPORTED_LANGUAGES),
  })
  @IsNotEmpty()
  @IsString()
  language!: string;  // definite assignment assertion

  @ApiProperty({
    example: '18',
    description: 'Language version',
    required: false,
  })
  @IsOptional()
  @IsString()
  languageVersion?: string;
}