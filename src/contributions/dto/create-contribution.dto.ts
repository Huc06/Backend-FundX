import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContributionDto {
  @ApiProperty({
    description: 'Campaign ID',
    example: 'campaign-123',
  })
  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @ApiProperty({
    description: 'Contributor wallet address',
    example: '0x1234567890abcdef1234567890abcdef12345678',
  })
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @ApiProperty({
    description: 'Contribution amount',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'Transaction hash from blockchain',
    example:
      '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
  })
  @IsString()
  @IsNotEmpty()
  txHash: string;

  @ApiProperty({
    description: 'Tier type',
    example: 'gold',
    enum: ['bronze', 'silver', 'gold', 'platinum'],
  })
  @IsString()
  @IsNotEmpty()
  tierType: string;

  @ApiProperty({
    description: 'Currency code',
    example: 'SUI',
  })
  @IsString()
  @IsNotEmpty()
  currency: string;
}
