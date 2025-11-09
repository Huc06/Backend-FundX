import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateContributionDto {
  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  txHash: string;

  @IsString()
  @IsNotEmpty()
  tierType: string;

  @IsString()
  @IsNotEmpty()
  currency: string;
}

