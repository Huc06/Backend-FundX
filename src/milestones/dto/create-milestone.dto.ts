import { IsString, IsNumber, IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMilestoneDto {
  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @IsString()
  @IsNotEmpty()
  objectId: string;

  @IsString()
  @IsNotEmpty()
  milestoneId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  deliverables: string[];

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsNumber()
  @IsNotEmpty()
  votingDurationDays: number;

  @IsString()
  @IsOptional()
  timelineStart?: string;

  @IsString()
  @IsOptional()
  timelineEnd?: string;

  @IsString()
  @IsOptional()
  informationId?: string;
}

