import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  IsArray,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateStorySectionDto } from './create-story-section.dto';
import { CreateRoadmapPhaseDto } from './create-roadmap-phase.dto';
import { CreateTeamMemberDto } from './create-team-member.dto';
import { CreateGalleryImageDto } from './create-gallery-image.dto';

export class CreateCampaignDto {
  @ApiProperty({
    description: 'Creator wallet address',
    example: '0x0000000000000000000000000000000000000000',
  })
  @IsString()
  @IsNotEmpty()
  creator_address: string;

  @ApiPropertyOptional({
    description: 'The object ID on the Sui blockchain.',
  })
  @IsString()
  @IsOptional()
  on_chain_object_id?: string;

  @ApiProperty({
    description: 'Campaign title',
    example: 'My Awesome Campaign',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    description: 'A brief summary for campaign cards.',
  })
  @IsString()
  @IsOptional()
  short_description?: string;

  @ApiProperty({
    description: 'Campaign category',
    example: 'technology',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: 'Target fundraising amount',
    example: 10000,
  })
  @IsNumber()
  @IsNotEmpty()
  goal_amount: number;

  @ApiPropertyOptional({
    description: 'Currency code',
    example: 'USD',
    default: 'USD',
  })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({
    description: 'Campaign duration in days',
    example: 30,
  })
  @IsNumber()
  @IsNotEmpty()
  duration_days: number;

  @ApiPropertyOptional({
    description: 'Reward type',
    example: 'none',
    enum: ['none', 'token', 'nft'],
    default: 'none',
  })
  @IsIn(['none', 'token', 'nft'])
  @IsOptional()
  reward_type?: 'none' | 'token' | 'nft';

  @ApiProperty({ type: [CreateStorySectionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStorySectionDto)
  story_sections: CreateStorySectionDto[];

  @ApiProperty({ type: [CreateRoadmapPhaseDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoadmapPhaseDto)
  roadmap_phases: CreateRoadmapPhaseDto[];

  @ApiProperty({ type: [CreateTeamMemberDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTeamMemberDto)
  team_members: CreateTeamMemberDto[];

  @ApiProperty({ type: [CreateGalleryImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGalleryImageDto)
  gallery_images: CreateGalleryImageDto[];
}
