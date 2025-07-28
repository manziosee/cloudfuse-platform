import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { SUPPORTED_LANGUAGES } from '@languages/constants/language.constants';

export class UpdateAppDto {
  @ApiProperty({
    example: 'my-updated-app',
    description: 'Updated application name',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    example: 'Updated description',
    description: 'Updated application description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'python',
    description: 'Updated application language',
    enum: Object.keys(SUPPORTED_LANGUAGES),
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  language?: string;

  @ApiProperty({
    example: '3.9',
    description: 'Updated language version',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  languageVersion?: string;
}