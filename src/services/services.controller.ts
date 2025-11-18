import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new service' })
  @ApiBody({
    type: CreateServiceDto,
    examples: {
      'create service': {
        value: {
          id: 'venue-conference-hall',
          name: 'Conference Hall Rental',
          description: 'Rental of the main conference hall for 3 days.',
          base_cost: 50000,
          category: 'venue',
          popular: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Service created successfully',
    schema: {
      example: {
        is_success: true,
        data: {
          id: 'venue-conference-hall',
          name: 'Conference Hall Rental',
          description: 'Rental of the main conference hall for 3 days.',
          base_cost: 50000,
          category: 'venue',
          popular: true,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  @ApiResponse({
    status: 200,
    description: 'List of services retrieved successfully',
    schema: {
      example: {
        is_success: true,
        data: [
          {
            id: 'venue-conference-hall',
            name: 'Conference Hall Rental',
            description: 'Rental of the main conference hall for 3 days.',
            base_cost: 50000,
            category: 'venue',
            popular: true,
          },
          {
            id: 'merch-tshirts',
            name: 'Branded T-Shirts',
            description: 'High-quality t-shirts with the event logo.',
            base_cost: 15,
            category: 'merchandise',
            popular: true,
          },
        ],
      },
    },
  })
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service by ID' })
  @ApiParam({ name: 'id', required: true, type: String, example: 'venue-conference-hall' })
  @ApiResponse({
    status: 200,
    description: 'Service retrieved successfully',
    schema: {
      example: {
        is_success: true,
        data: {
          id: 'venue-conference-hall',
          name: 'Conference Hall Rental',
          description: 'Rental of the main conference hall for 3 days.',
          base_cost: 50000,
          category: 'venue',
          popular: true,
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Service not found' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Post(':id/update')
  @ApiOperation({ summary: 'Update a service by ID' })
  @ApiParam({ name: 'id', required: true, type: String, example: 'venue-conference-hall' })
  @ApiBody({
    type: UpdateServiceDto,
    examples: {
      'update service': {
        value: {
          name: 'Conference Hall Rental (3 days)',
          description: 'Rental of the main conference hall for the entire 3-day event.',
          base_cost: 55000,
          popular: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Service updated successfully',
    schema: {
      example: {
        is_success: true,
        data: {
          id: 'venue-conference-hall',
          name: 'Conference Hall Rental (3 days)',
          description: 'Rental of the main conference hall for the entire 3-day event.',
          base_cost: 55000,
          category: 'venue',
          popular: true,
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Service not found' })
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Post(':id/delete')
  @ApiOperation({ summary: 'Delete a service by ID' })
  @ApiParam({ name: 'id', required: true, type: String, example: 'venue-conference-hall' })
  @ApiResponse({
    status: 200,
    description: 'Service deleted successfully',
    schema: {
      example: {
        is_success: true,
        data: {
          id: 'venue-conference-hall',
          name: 'Conference Hall Rental (3 days)',
          description: 'Rental of the main conference hall for the entire 3-day event.',
          base_cost: 55000,
          category: 'venue',
          popular: true,
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Service not found' })
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
