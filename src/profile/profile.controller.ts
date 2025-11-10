import {
  Controller,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ProfileService } from './profile.service';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Get logged-in user profile',
    description: 'Returns profile information for the authenticated user including campaign and contribution statistics',
  })
  @ApiQuery({
    name: 'address',
    required: true,
    description: 'User wallet address',
    example: '0x1234567890abcdef1234567890abcdef12345678',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      example: {
        address: '0x1234567890abcdef1234567890abcdef12345678',
        totalCampaignsCreated: 5,
        totalContributions: 12,
        totalContributionAmount: 1500,
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Missing wallet address parameter' })
  async getMyProfile(@Query('address') address: string) {
    if (!address) {
      throw new BadRequestException('address query parameter is required');
    }

    return {
      is_success: true,
      data: await this.profileService.getUserProfile(address),
    };
  }

  @Get('me/created-campaigns')
  @ApiOperation({
    summary: 'Get campaigns created by user',
    description: 'Returns a list of all campaigns created by the authenticated user with full details',
  })
  @ApiQuery({
    name: 'address',
    required: true,
    description: 'Creator wallet address',
    example: '0x1234567890abcdef1234567890abcdef12345678',
  })
  @ApiResponse({
    status: 200,
    description: 'List of created campaigns retrieved successfully',
    schema: {
      example: {
        is_success: true,
        data: [
          {
            blob_id: 'campaign-123',
            campaign_name: 'Build a DeFi Platform',
            goal: 10000,
            current_amount: 7500,
            end_at: '2025-12-31T23:59:59.000Z',
            images: [],
            contributions: [],
            milestones: [],
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Missing wallet address parameter' })
  async getMyCreatedCampaigns(@Query('address') address: string) {
    if (!address) {
      throw new BadRequestException('address query parameter is required');
    }

    return {
      is_success: true,
      data: await this.profileService.getCreatedCampaigns(address),
    };
  }

  @Get('me/contributions')
  @ApiOperation({
    summary: 'Get contributions made by user',
    description: 'Returns a list of all contributions made by the authenticated user, including campaign details for each contribution',
  })
  @ApiQuery({
    name: 'address',
    required: true,
    description: 'Contributor wallet address',
    example: '0x1234567890abcdef1234567890abcdef12345678',
  })
  @ApiResponse({
    status: 200,
    description: 'List of contributions retrieved successfully',
    schema: {
      example: {
        is_success: true,
        data: [
          {
            campaign_id: 'campaign-123',
            wallet_address: '0x1234567890abcdef1234567890abcdef12345678',
            amount: 100,
            currency: 'SUI',
            tx_hash: '0xabcdef1234567890',
            created_at: '2025-11-10T00:00:00.000Z',
            campaign: {
              blob_id: 'campaign-123',
              campaign_name: 'Build a DeFi Platform',
              goal: 10000,
              current_amount: 7500,
            },
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Missing wallet address parameter' })
  async getMyContributions(@Query('address') address: string) {
    if (!address) {
      throw new BadRequestException('address query parameter is required');
    }

    return {
      is_success: true,
      data: await this.profileService.getContributions(address),
    };
  }
}

