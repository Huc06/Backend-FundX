import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user profile',
    description: 'Registers a new user profile with a wallet address, and optionally username, email, bio, and avatar URL.',
  })
  @ApiResponse({ status: 201, description: 'User profile created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request. User with wallet address or email already exists.' })
  async createProfile(@Body() createProfileDto: CreateProfileDto) {
    const newProfile = await this.profileService.createProfile(createProfileDto);
    return {
      is_success: true,
      data: newProfile,
    };
  }

  @Get('wallet/:walletAddress')
  @ApiOperation({
    summary: 'Get user profile by wallet address',
    description: 'Retrieves a user profile using their unique wallet address.',
  })
  @ApiParam({
    name: 'walletAddress',
    required: true,
    description: 'The user\'s public blockchain wallet address',
    example: '0x1234567890abcdef1234567890abcdef12345678',
  })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User profile not found.' })
  async getProfileByWalletAddress(@Param('walletAddress') walletAddress: string) {
    const profile = await this.profileService.getProfileByWalletAddress(walletAddress);
    if (!profile) {
      throw new NotFoundException('User profile not found.');
    }
    return {
      is_success: true,
      data: profile,
    };
  }

  @Get('email/:email')
  @ApiOperation({
    summary: 'Get user profile by email',
    description: 'Retrieves a user profile using their email address.',
  })
  @ApiParam({
    name: 'email',
    required: true,
    description: 'The user\'s email address',
    example: 'john.doe@example.com',
  })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User profile not found.' })
  async getProfileByEmail(@Param('email') email: string) {
    const profile = await this.profileService.getProfileByEmail(email);
    if (!profile) {
      throw new NotFoundException('User profile not found.');
    }
    return {
      is_success: true,
      data: profile,
    };
  }

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

