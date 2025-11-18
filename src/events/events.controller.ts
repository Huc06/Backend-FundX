import { Controller, Post, Body, Get, Query, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new event' })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
    schema: {
      example: {
        is_success: true,
        data: {
          event_id: '00000000-0000-0000-0000-000000000000',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of events' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
  @ApiResponse({
    status: 200,
    description: 'List of events retrieved successfully',
    schema: {
      example: {
        is_success: true,
        data: [
          {
            event_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            creator_id: '00000000-0000-0000-0000-000000000000',
            name: 'My Tech Conference 2025',
            description: 'A conference about the future of technology.',
            start_time: '2025-12-01T09:00:00Z',
            end_time: '2025-12-03T17:00:00Z',
            funding_deadline: '2025-11-01T23:59:59Z',
            timezone: 'America/Los_Angeles',
            location: 'San Francisco, CA',
            visibility: 'public',
            theme: 'tech',
            target_amount: 100000.0,
            reward_type: 'nft',
            capacity: 500,
            ticket_price: 299.0,
            status: 'pending',
            gallery_images: [
              {
                image_id: 'img1-uuid',
                image_url: 'https://example.com/gallery1.jpg',
                caption: 'Venue',
                order: 1,
              },
            ],
          },
        ],
        limit: 10,
        offset: 0,
      },
    },
  })
  getEvents(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const offsetNum = offset ? parseInt(offset, 10) : 0;
    return this.eventsService.getEvents(limitNum, offsetNum);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an event by ID' })
  @ApiParam({ name: 'id', required: true, type: String, example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  @ApiResponse({
    status: 200,
    description: 'Event retrieved successfully',
    schema: {
      example: {
        is_success: true,
        data: {
          event_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
          creator_id: '00000000-0000-0000-0000-000000000000',
          name: 'My Tech Conference 2025',
          description: 'A conference about the future of technology.',
          start_time: '2025-12-01T09:00:00Z',
          end_time: '2025-12-03T17:00:00Z',
          funding_deadline: '2025-11-01T23:59:59Z',
          timezone: 'America/Los_Angeles',
          location: 'San Francisco, CA',
          visibility: 'public',
          theme: 'tech',
          target_amount: 100000.0,
          reward_type: 'nft',
          capacity: 500,
          ticket_price: 299.0,
          status: 'pending',
          milestones: [
            {
              milestone_id: 'mile1-uuid',
              title: 'Milestone 1: Venue Booked',
              description: 'The venue has been booked and confirmed.',
              end_date: '2025-01-15',
              status: 'completed',
            },
          ],
          services: [
            {
              service_id: 'serv1-uuid',
              name: 'Catering',
              description: 'Catering for all attendees.',
              provider: 'Awesome Catering Co.',
              cost: 20000,
            },
          ],
          gallery_images: [
            {
              image_id: 'img1-uuid',
              image_url: 'https://example.com/gallery1.jpg',
              caption: 'Venue',
              order: 1,
            },
          ],
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Event not found' })
  getEventById(@Param('id') id: string) {
    return this.eventsService.getEventById(id);
  }
}
