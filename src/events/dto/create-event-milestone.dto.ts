import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventMilestoneDto {
  @ApiProperty({ example: 'Venue Secured' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Secure the venue for the conference.', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 20000.00 })
  @IsNumber()
  @IsNotEmpty()
  funding_goal: number;

  @ApiProperty({ example: 'pending', required: false })
  @IsString()
  @IsOptional()
  status?: string;
}
