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
import { ContributionsService } from './contributions.service';
import { CreateContributionDto } from './dto/create-contribution.dto';

@Controller()
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Post('create-contribution')
  @HttpCode(HttpStatus.OK)
  async createContribution(@Body() createContributionDto: CreateContributionDto) {
    try {
      return await this.contributionsService.createContribution(createContributionDto);
    } catch (error) {
      return {
        is_success: false,
        error: error.message,
      };
    }
  }

  @Get('contributions')
  async getContributions(
    @Query('address') address?: string,
    @Query('campaign_id') campaignId?: string,
  ) {
    if (address) {
      try {
        return await this.contributionsService.getContributionsByAddress(address);
      } catch (error) {
        return {
          is_success: false,
          error: error.message,
        };
      }
    }

    if (campaignId) {
      try {
        return await this.contributionsService.getAddressesByCampaign(campaignId);
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

