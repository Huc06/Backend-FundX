import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  blobId: string;

  @IsString()
  @IsNotEmpty()
  creatorAddress: string;

  @IsString()
  @IsOptional()
  creatorName?: string;

  @IsNumber()
  @IsNotEmpty()
  targetAmount: number;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsNotEmpty()
  rewardType: string;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  txHash: string;

  @IsString()
  @IsNotEmpty()
  objectId: string;

  @IsString()
  @IsNotEmpty()
  category: string;
}

