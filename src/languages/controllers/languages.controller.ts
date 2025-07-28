import { Controller, Get } from '@nestjs/common';
import { LanguagesService } from '../services/languages.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Languages')
@ApiBearerAuth('JWT-auth')
@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all supported languages' })
  @ApiResponse({
    status: 200,
    description: 'List of supported languages',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  getSupportedLanguages() {
    return this.languagesService.getSupportedLanguages();
  }

  @Get('frameworks')
  @ApiOperation({ summary: 'Get all supported frameworks' })
  @ApiResponse({
    status: 200,
    description: 'List of supported frameworks',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  getSupportedFrameworks() {
    return this.languagesService.getSupportedFrameworks();
  }
}