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
        data: [],
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
