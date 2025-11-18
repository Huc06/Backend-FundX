import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ContributionsService } from './contributions.service';
import { CreateContributionDto } from './dto/create-contribution.dto';

@ApiTags('Contributions')
@Controller('contributions')
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new contribution for a campaign or event',
  })
  @ApiResponse({
    status: 201,
    description: 'Contribution created successfully',
    schema: {
      example: {
        is_success: true,
        data: {
          id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
          user_id: '00000000-0000-0000-0000-000000000000',
          campaign_id: 'campaign-123',
          event_id: null,
          amount: 100,
          transaction_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          currency: 'SUI',
          tier: 'gold',
          created_at: '2023-10-27T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Campaign or Event not found' })
  async createContribution(
    @Body() createContributionDto: CreateContributionDto,
  ) {
    try {
      return await this.contributionsService.createContribution(
        createContributionDto,
      );
    } catch (error) {
      return { is_success: false, error: error.message };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all contributions' })
  @ApiResponse({
    status: 200,
    description: 'A list of all contributions',
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
          },
        ],
      },
    },
  })
  async getAllContributions() {
    try {
      return await this.contributionsService.getAllContributions();
    } catch (error) {
      return { is_success: false, error: error.message };
    }
  }

  @Get('wallet/:address')
  @ApiOperation({ summary: 'Get all contributions for a given wallet address' })
  @ApiParam({
    name: 'address',
    description: 'The wallet address of the contributor',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of contributions for the given wallet address',
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
          },
        ],
      },
    },
  })
  async getContributionsByWalletAddress(@Param('address') address: string) {
    try {
      return await this.contributionsService.getContributionsByWalletAddress(
        address,
      );
    } catch (error) {
      return { is_success: false, error: error.message };
    }
  }

  @Get('campaign/:id')
  @ApiOperation({ summary: 'Get all contributions for a given campaign' })
  @ApiParam({ name: 'id', description: 'The ID of the campaign' })
  @ApiResponse({
    status: 200,
    description: 'A list of contributions for the given campaign',
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
          },
        ],
      },
    },
  })
  async getContributionsByCampaignId(@Param('id') id: string) {
    try {
      return await this.contributionsService.getContributionsByCampaignId(id);
    } catch (error) {
      return { is_success: false, error: error.message };
    }
  }

  @Get('event/:id')
  @ApiOperation({ summary: 'Get all contributions for a given event' })
  @ApiParam({ name: 'id', description: 'The ID of the event' })
  @ApiResponse({
    status: 200,
    description: 'A list of contributions for the given event',
    schema: {
      example: {
        is_success: true,
        data: [
          {
            id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            user_id: '00000000-0000-0000-0000-000000000000',
            campaign_id: null,
            event_id: 'event-123',
            amount: 100,
            transaction_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
            currency: 'SUI',
            tier: 'gold',
            created_at: '2023-10-27T10:00:00Z',
          },
        ],
      },
    },
  })
  async getContributionsByEventId(@Param('id') id: string) {
    try {
      return await this.contributionsService.getContributionsByEventId(id);
    } catch (error) {
      return { is_success: false, error: error.message };
    }
  }

  @Get('campaigns')
  @ApiOperation({ summary: 'Get all contributions made to campaigns' })
  @ApiResponse({
    status: 200,
    description: 'A list of all contributions made to campaigns',
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
          },
        ],
      },
    },
  })
  async getContributionsOfAllCampaigns() {
    try {
      return await this.contributionsService.getContributionsOfAllCampaigns();
    } catch (error) {
      return { is_success: false, error: error.message };
    }
  }

  @Get('events')
  @ApiOperation({ summary: 'Get all contributions made to events' })
  @ApiResponse({
    status: 200,
    description: 'A list of all contributions made to events',
    schema: {
      example: {
        is_success: true,
        data: [
          {
            id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
            user_id: '00000000-0000-0000-0000-000000000000',
            campaign_id: null,
            event_id: 'event-123',
            amount: 100,
            transaction_hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
            currency: 'SUI',
            tier: 'gold',
            created_at: '2023-10-27T10:00:00Z',
          },
        ],
      },
    },
  })
  async getContributionsOfAllEvents() {
    try {
      return await this.contributionsService.getContributionsOfAllEvents();
    } catch (error) {
      return { is_success: false, error: error.message };
    }
  }
}
