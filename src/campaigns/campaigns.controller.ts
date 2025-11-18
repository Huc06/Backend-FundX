import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@ApiTags('Campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new fundraising campaign' })
  @ApiBody({ type: CreateCampaignDto })
  @ApiResponse({
    status: 201,
    description: 'Campaign created successfully',
    schema: {
      example: {
        is_success: true,
        data: {
          campaign_id: '00000000-0000-0000-0000-000000000000',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Body() createCampaignDto: CreateCampaignDto) {
    try {
      return await this.campaignsService.create(createCampaignDto);
    } catch (error) {
      return {
        is_success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get('campaigns')
  @ApiOperation({ summary: 'Get list of campaigns with pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
  @ApiResponse({
    status: 200,
    description: 'List of campaigns retrieved successfully',
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
                images: [
                  {
                    image_id: 'img1-uuid',
                    image_url: 'https://example.com/gallery1.jpg',
                    caption: 'Prototype in action',
                    order: 1,
                  },
                ],
                contributions: [
                  {
                    contribution_id: 'contr1-uuid',
                    user_id: 'user1-uuid',
                    amount: 100,
                    currency: 'USD',
                    transaction_hash: '0x...',
                    created_at: '2023-10-27T10:00:00Z',
                  },
                ],
              },
            ],
            limit: 10,
            offset: 0,
          },
        },
  })
  async getCampaigns(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    try {
      const limitNum = limit ? parseInt(limit, 10) : 10;
      const offsetNum = offset ? parseInt(offset, 10) : 0;
      return await this.campaignsService.getCampaigns(limitNum, offsetNum);
    } catch (error) {
      return {
        is_success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get('campaigns/creator')
  @ApiOperation({ summary: 'Get campaigns by creator wallet address' })
  @ApiQuery({
    name: 'creator',
    required: true,
    type: String,
    example: '0x1234567890abcdef',
    description: 'Creator wallet address',
  })
    @ApiResponse({
      status: 200,
      description: 'Campaigns retrieved successfully',
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
              images: [
                {
                  image_id: 'img1-uuid',
                  image_url: 'https://example.com/gallery1.jpg',
                  caption: 'Prototype in action',
                  order: 1,
                },
              ],
              contributions: [
                {
                  contribution_id: 'contr1-uuid',
                  user_id: 'user1-uuid',
                  amount: 100,
                  currency: 'USD',
                  transaction_hash: '0x...',
                  created_at: '2023-10-27T10:00:00Z',
                },
              ],
              milestones: [
                {
                  milestone_id: 'mile1-uuid',
                  title: 'Milestone 1: Prototype',
                  description: 'The first working prototype.',
                  end_date: '2024-02-28',
                  status: 'in-progress',
                },
              ],
            },
          ],
        },
      },
    })
  @ApiResponse({ status: 400, description: 'Missing creator parameter' })
  async getCampaignsByCreator(@Query('creator') creator?: string) {
    if (!creator) {
      throw new BadRequestException('Missing creator query parameter');
    }
    try {
      return await this.campaignsService.getCampaignsByCreator(creator);
    } catch (error) {
      return {
        is_success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get('voting-campaigns')
  @ApiOperation({
    summary: 'Get campaigns that are completed and have milestones in voting',
  })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'offset', required: false, type: Number, example: 0 })
    @ApiResponse({
      status: 200,
      description: 'Voting campaigns retrieved successfully',
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
              current_amount: 50000,
              currency: 'USD',
              duration_days: 60,
              reward_type: 'token',
              status: 'completed',
              created_at: '2023-10-26T10:00:00Z',
              updated_at: '2023-12-25T10:00:00Z',
              images: [
                {
                  image_id: 'img1-uuid',
                  image_url: 'https://example.com/gallery1.jpg',
                  caption: 'Prototype in action',
                  order: 1,
                },
              ],
              milestone: {
                milestone_id: 'mile2-uuid',
                title: 'Milestone 2: Beta Testing',
                description: 'Beta testing with a select group of users.',
                end_date: '2024-03-31',
                status: 'in-voting',
              },
            },
          ],
          limit: 10,
          offset: 0,
        },
      },
    })
  async getVotingCampaigns(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    try {
      const limitNum = limit ? parseInt(limit, 10) : 10;
      const offsetNum = offset ? parseInt(offset, 10) : 0;
      return await this.campaignsService.getVotingCampaigns(
        limitNum,
        offsetNum,
      );
    } catch (error) {
      return {
        is_success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get('campaign')
  @ApiOperation({ summary: 'Get campaign details by object ID' })
  @ApiQuery({
    name: 'id',
    required: true,
    type: String,
    example: 'obj-123',
    description: 'Campaign object ID',
  })
    @ApiResponse({
      status: 200,
      description: 'Campaign retrieved successfully',
      schema: {
        example: {
          is_success: true,
          data: {
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
            images: [
              {
                image_id: 'img1-uuid',
                image_url: 'https://example.com/gallery1.jpg',
                caption: 'Prototype in action',
                order: 1,
              },
            ],
            contributions: [
              {
                contribution_id: 'contr1-uuid',
                user_id: 'user1-uuid',
                amount: 100,
                currency: 'USD',
                transaction_hash: '0x...',
                created_at: '2023-10-27T10:00:00Z',
              },
            ],
            story_sections: [
              {
                section_id: 'sec1-uuid',
                title: 'Our Vision',
                content: 'We aim to revolutionize sustainable energy.',
                image_url: 'https://example.com/vision.jpg',
                order: 1,
              },
            ],
            roadmap_phases: [
              {
                phase_id: 'phase1-uuid',
                title: 'Phase 1: Research & Development',
                description: 'Initial research and prototype development.',
                start_date: '2023-11-01',
                end_date: '2024-01-31',
                is_completed: false,
                order: 1,
              },
            ],
            team_members: [
              {
                member_id: 'mem1-uuid',
                name: 'Alice Smith',
                role: 'CEO',
                bio: 'Experienced leader in tech.',
                social_media_link: 'https://linkedin.com/in/alicesmith',
                image_url: 'https://example.com/alice.jpg',
                order: 1,
              },
            ],
          },
        },
      },
    })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  @ApiResponse({ status: 400, description: 'Missing id parameter' })
  async getCampaignById(@Query('id') id?: string) {
    if (!id) {
      throw new BadRequestException("Missing 'id' query parameter");
    }
    try {
      return await this.campaignsService.getCampaignById(id);
    } catch (error) {
      return {
        is_success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
