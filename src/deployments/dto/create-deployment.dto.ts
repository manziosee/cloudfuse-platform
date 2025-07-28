import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsBase64 } from 'class-validator';

export class CreateDeploymentDto {
  @ApiProperty({
    example: '1.0.0',
    description: 'Deployment version',
  })
  @IsNotEmpty()
  @IsString()
  version!: string;  // definite assignment assertion

  @ApiProperty({
    example: 'base64-encoded-tar-gz',
    description: 'Base64 encoded tar.gz of application source code',
  })
  @IsNotEmpty()
  @IsBase64()
  sourceCode!: string;  // definite assignment assertion

  @ApiProperty({
    example: 'app-id',
    description: 'ID of the app being deployed',
  })
  @IsNotEmpty()
  @IsString()
  appId!: string;  // definite assignment assertion
}