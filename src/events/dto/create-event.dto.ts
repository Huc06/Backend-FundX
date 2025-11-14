import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsArray,
  ValidateNested,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateEventMilestoneDto } from './create-event-milestone.dto';
import { CreateEventGalleryImageDto } from './create-event-gallery-image.dto';

export enum EventStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class CreateEventDto {
  @ApiProperty({ example: '5139ad64-31b4-4842-a43d-002dcc5e4816' })
  @IsUUID()
  @IsNotEmpty()
  creator_id: string;

  @ApiProperty({ example: 'My Tech Conference 2025' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'A conference about the future of technology.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2025-12-01T09:00:00Z' })
  @IsDateString()
  start_time: string;

  @ApiProperty({ example: '2025-12-03T17:00:00Z' })
  @IsDateString()
  end_time: string;

  @ApiProperty({ example: '2025-11-01T23:59:59Z' })
  @IsDateString()
  funding_deadline: string;

  @ApiProperty({ example: 'America/Los_Angeles' })
  @IsString()
  @IsNotEmpty()
  timezone: string;

  @ApiProperty({ example: 'San Francisco, CA', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: 'public', required: false })
  @IsString()
  @IsOptional()
  visibility?: string;

  @ApiProperty({ example: 100000.0 })
  @IsNumber()
  target_amount: number;

  @ApiProperty({ example: 'nft' })
  @IsString()
  @IsNotEmpty()
  reward_type: string;

  @ApiProperty({ example: 500, required: false })
  @IsNumber()
  @IsOptional()
  capacity?: number;

  @ApiProperty({ example: 299.0, required: false })
  @IsNumber()
  @IsOptional()
  ticket_price?: number;

  @ApiProperty({
    enum: EventStatus,
    example: EventStatus.PENDING,
    required: false,
  })
  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;

  @ApiProperty({ type: [CreateEventMilestoneDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEventMilestoneDto)
  milestones: CreateEventMilestoneDto[];

  @ApiProperty({ example: ['venue-conference-hall', 'merch-tshirts'] })
  @IsArray()
  @IsString({ each: true })
  services: string[];

  @ApiProperty({ type: [CreateEventGalleryImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEventGalleryImageDto)
  gallery_images: CreateEventGalleryImageDto[];
}
