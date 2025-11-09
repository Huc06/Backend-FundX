import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Basic health check' })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2025-11-09T06:45:18.888Z',
        uptime: 123.456,
        environment: 'development',
        version: '1.0.0',
      },
    },
  })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
    };
  }

  @Get('detailed')
  @ApiOperation({ summary: 'Detailed health check with system metrics' })
  @ApiResponse({
    status: 200,
    description: 'Detailed health information',
    schema: {
      example: {
        status: 'ok',
        timestamp: '2025-11-09T06:45:19.374Z',
        uptime: 123.456,
        environment: 'development',
        version: '1.0.0',
        memory: { used: 25.32, total: 51.84, unit: 'MB' },
        cpu: { user: 366829, system: 110151 },
      },
    },
  })
  detailed() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      memory: {
        used:
          Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) /
          100,
        total:
          Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) /
          100,
        unit: 'MB',
      },
      cpu: process.cpuUsage(),
    };
  }
}
