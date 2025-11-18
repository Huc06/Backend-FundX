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
import { UpdateProfileDto } from './dto/update-profile.dto';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user profile',
    description:
      'Registers a new user profile with a wallet address, and optionally username, email, bio, and avatar URL.',
  })
  @ApiResponse({
    status: 201,
    description: 'User profile created successfully.',
    schema: {
      example: {
        is_success: true,
        data: {
          id: '00000000-0000-0000-0000-000000000000',
          wallet_address: '0x1234567890abcdef1234567890abcdef12345678',
          username: 'john_doe',
          email: 'john.doe@example.com',
          role: 'user',
          bio: 'Passionate about blockchain and decentralized applications.',
          avatar_url: 'https://example.com/avatar.jpg',
          created_at: '2023-10-27T10:00:00Z',
          updated_at: '2023-10-27T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request. User with wallet address or email already exists.',
  })
  async createProfile(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.createProfile(createProfileDto);
  }

  @Post(':walletAddress/update')
  @ApiOperation({
    summary: 'Update user profile',
    description: 'Updates a user profile using their unique wallet address.',
  })
  @ApiParam({
    name: 'walletAddress',
    required: true,
    description: "The user's public blockchain wallet address",
    example: '0x1234567890abcdef1234567890abcdef12345678',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully.',
    schema: {
      example: {
        is_success: true,
        data: {
          id: '00000000-0000-0000-0000-000000000000',
          wallet_address: '0x1234567890abcdef1234567890abcdef12345678',
          username: 'john_doe_updated',
          email: 'john.doe.updated@example.com',
          role: 'user',
          bio: 'Updated bio.',
          avatar_url: 'https://example.com/avatar_updated.jpg',
          created_at: '2023-10-27T10:00:00Z',
          updated_at: '2023-10-27T11:00:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User profile not found.' })
  async updateProfile(
    @Param('walletAddress') walletAddress: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const updatedProfile = await this.profileService.updateProfile(
      walletAddress,
      updateProfileDto,
    );
    if (!updatedProfile) {
      throw new NotFoundException('User profile not found.');
    }
    return updatedProfile;
  }

  @Get('wallet/:walletAddress')
  @ApiOperation({
    summary: 'Get user profile by wallet address',
    description: 'Retrieves a user profile using their unique wallet address.',
  })
  @ApiParam({
    name: 'walletAddress',
    required: true,
    description: "The user's public blockchain wallet address",
    example: '0x1234567890abcdef1234567890abcdef12345678',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
    schema: {
      example: {
        is_success: true,
        data: {
          id: '00000000-0000-0000-0000-000000000000',
          wallet_address: '0x1234567890abcdef1234567890abcdef12345678',
          username: 'john_doe',
          email: 'john.doe@example.com',
          role: 'user',
          bio: 'Passionate about blockchain and decentralized applications.',
          avatar_url: 'https://example.com/avatar.jpg',
          created_at: '2023-10-27T10:00:00Z',
          updated_at: '2023-10-27T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User profile not found.' })
  async getProfileByWalletAddress(
    @Param('walletAddress') walletAddress: string,
  ) {
    const profile =
      await this.profileService.getProfileByWalletAddress(walletAddress);
    if (!profile) {
      throw new NotFoundException('User profile not found.');
    }
    return profile;
  }

  @Get('email/:email')
  @ApiOperation({
    summary: 'Get user profile by email',
    description: 'Retrieves a user profile using their email address.',
  })
  @ApiParam({
    name: 'email',
    required: true,
    description: "The user's email address",
    example: 'john.doe@example.com',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully.',
    schema: {
      example: {
        is_success: true,
        data: {
          id: '00000000-0000-0000-0000-000000000000',
          wallet_address: '0x1234567890abcdef1234567890abcdef12345678',
          username: 'john_doe',
          email: 'john.doe@example.com',
          role: 'user',
          bio: 'Passionate about blockchain and decentralized applications.',
          avatar_url: 'https://example.com/avatar.jpg',
          created_at: '2023-10-27T10:00:00Z',
          updated_at: '2023-10-27T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User profile not found.' })
  async getProfileByEmail(@Param('email') email: string) {
    const profile = await this.profileService.getProfileByEmail(email);
    if (!profile) {
      throw new NotFoundException('User profile not found.');
    }
    return profile;
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get logged-in user profile',
    description:
      'Returns profile information for the authenticated user including campaign and contribution statistics',
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
        is_success: true,
        data: {
          id: '00000000-0000-0000-0000-000000000000',
          wallet_address: '0x1234567890abcdef1234567890abcdef12345678',
          username: 'john_doe',
          email: 'john.doe@example.com',
          role: 'user',
          bio: 'Passionate about blockchain and decentralized applications.',
          avatar_url: 'https://example.com/avatar.jpg',
          created_at: '2023-10-27T10:00:00Z',
          updated_at: '2023-10-27T10:00:00Z',
          totalCampaignsCreated: 5,
          totalContributions: 12,
          totalContributionAmount: 1500,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Missing wallet address parameter' })
  async getMyProfile(@Query('address') address: string) {
    if (!address) {
      throw new BadRequestException('address query parameter is required');
    }

    return this.profileService.getUserProfile(address);
  }

  @Get('me/created-campaigns')
  @ApiOperation({
    summary: 'Get campaigns created by user',
    description:
      'Returns a list of all campaigns created by the authenticated user with full details',
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
            campaign_id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            creator_id: '00000000-0000-0000-0000-000000000000',
            on_chain_object_id: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
            title: 'Innovate for a Better Tomorrow',
            short_description: 'Supporting groundbreaking projects in sustainable technology.',
            category: 'technology',
            goal_amount: 50000,
            current_amount: 15000,
            currency: 'USD',
            duration_days: 60,
            reward_type: 'token',
            status: 'active',
            created_at: '2023-10-26T10:00:00Z',
            updated_at: '2023-10-26T10:00:00Z',
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

    return this.profileService.getCreatedCampaigns(address);
  }

  @Get('me/contributions')
  @ApiOperation({
    summary: 'Get contributions made by user',
    description:
      'Returns a list of all contributions made by the authenticated user, including campaign details for each contribution',
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
            id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            user_id: '00000000-0000-0000-0000-000000000000',
            campaign_id: 'campaign-123',
            event_id: null,
            amount: 100,
            transaction_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
            currency: 'SUI',
            tier: 'gold',
            created_at: '2023-10-27T10:00:00Z',
            campaign: {
              id: 'campaign-123',
              title: 'Build a DeFi Platform',
              goal_amount: 10000,
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

    return this.profileService.getContributions(address);
  }
}
