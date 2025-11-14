import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn, IsNumber } from 'class-validator';

export class CreateRoadmapPhaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  timeline: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: ['done', 'in-progress', 'future'] })
  @IsIn(['done', 'in-progress', 'future'])
  @IsNotEmpty()
  state: 'done' | 'in-progress' | 'future';

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  display_order: number;
}
