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
import { ContributionsService } from './contributions.service';
import { CreateContributionDto } from './dto/create-contribution.dto';

@ApiTags('Contributions')
@Controller()
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Post('create-contribution')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create a new contribution and update campaign amount',
  })
  @ApiBody({ type: CreateContributionDto })
  @ApiResponse({
    status: 200,
    description: 'Contribution created and campaign updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  async createContribution(
    @Body() createContributionDto: CreateContributionDto,
  ) {
    try {
      return await this.contributionsService.createContribution(
        createContributionDto,
      );
    } catch (error) {
      return {
        is_success: false,
        error: error.message,
      };
    }
  }

  @Get('contributions')
  @ApiOperation({
    summary: 'Get contributions by wallet address or contributors by campaign',
  })
  @ApiQuery({
    name: 'address',
    required: false,
    type: String,
    example: '0x1234567890abcdef',
    description: 'Wallet address to get contributions for',
  })
  @ApiQuery({
    name: 'campaign_id',
    required: false,
    type: String,
    example: 'campaign-123',
    description: 'Campaign ID to get contributors for',
  })
  @ApiResponse({
    status: 200,
    description: 'Contributions retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Missing address or campaign_id parameter',
  })
  async getContributions(
    @Query('address') address?: string,
    @Query('campaign_id') campaignId?: string,
  ) {
    if (address) {
      try {
        return await this.contributionsService.getContributionsByAddress(
          address,
        );
      } catch (error) {
        return {
          is_success: false,
          error: error.message,
        };
      }
    }

    if (campaignId) {
      try {
        return await this.contributionsService.getAddressesByCampaign(
          campaignId,
        );
      } catch (error) {
        return {
          is_success: false,
          error: error.message,
        };
      }
    }

    throw new BadRequestException('Missing address or campaign_id parameter');
  }
}
