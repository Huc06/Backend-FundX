import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import type { IDatabaseService } from '../database/interfaces/database.interface';

@Injectable()
export class EventsService {
  constructor(
    @Inject('DATABASE_SERVICE')
    private readonly databaseService: IDatabaseService,
  ) {}

  async create(createEventDto: CreateEventDto) {
    const newEvent =
      await this.databaseService.createEventWithDetails(createEventDto);

    return {
      is_success: true,
      data: {
        event_id: newEvent.id,
      },
    };
  }

  async getEvents(limit: number, offset: number) {
    const events = await this.databaseService.getEvents(limit, offset);
    const enrichedEvents = await Promise.all(
      events.map(async (event) => {
        const galleryImages =
          await this.databaseService.getEventGalleryImagesByEventId(event.id);
        return {
          ...event,
          gallery_images: galleryImages || [],
        };
      }),
    );
    return {
      is_success: true,
      data: enrichedEvents,
      limit,
      offset,
    };
  }

  async getEventById(eventId: string) {
    const event = await this.databaseService.getEventById(eventId);
    if (!event) {
      throw new NotFoundException(`Event with id ${eventId} not found`);
    }

    const milestones =
      await this.databaseService.getEventMilestonesByEventId(eventId);
    const services =
      await this.databaseService.getEventServicesByEventId(eventId);
    const galleryImages =
      await this.databaseService.getEventGalleryImagesByEventId(eventId);

    return {
      is_success: true,
      data: {
        ...event,
        milestones: milestones || [],
        services: services || [],
        gallery_images: galleryImages || [],
      },
    };
  }
}
