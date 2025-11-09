import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateTierDto {
  @IsString()
  @IsNotEmpty()
  campaign_id: string;

  @IsString()
  @IsNotEmpty()
  tier: string;

  @IsNumber()
  @IsNotEmpty()
  limit: number;

  @IsString()
  @IsOptional()
  description?: string;
}

