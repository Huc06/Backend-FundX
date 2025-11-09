import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Welcome message' })
  @ApiResponse({
    status: 200,
    description: 'Welcome message',
    schema: {
      example: {
        message: 'Welcome to FundX backend!',
      },
    },
  })
  getHello() {
    return { message: 'Welcome to FundX backend!' };
  }
}
