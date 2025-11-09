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
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Controller()
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post('create-campaign')
  @HttpCode(HttpStatus.OK)
  async createCampaign(@Body() createCampaignDto: CreateCampaignDto) {
    try {
      return await this.campaignsService.createCampaign(createCampaignDto);
    } catch (error) {
      return {
        is_success: false,
        error: error.message,
      };
    }
  }

  @Get('campaigns')
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
        error: error.message,
      };
    }
  }

  @Get('campaigns/creator')
  async getCampaignsByCreator(@Query('creator') creator?: string) {
    if (!creator) {
      throw new BadRequestException('Missing creator query parameter');
    }
    try {
      return await this.campaignsService.getCampaignsByCreator(creator);
    } catch (error) {
      return {
        is_success: false,
        error: error.message,
      };
    }
  }

  @Get('voting-campaigns')
  async getVotingCampaigns(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    try {
      const limitNum = limit ? parseInt(limit, 10) : 10;
      const offsetNum = offset ? parseInt(offset, 10) : 0;
      return await this.campaignsService.getVotingCampaigns(limitNum, offsetNum);
    } catch (error) {
      return {
        is_success: false,
        error: error.message,
      };
    }
  }

  @Get('campaign')
  async getCampaignById(@Query('id') id?: string) {
    if (!id) {
      throw new BadRequestException("Missing 'id' query parameter");
    }
    try {
      return await this.campaignsService.getCampaignById(id);
    } catch (error) {
      return {
        is_success: false,
        error: error.message,
      };
    }
  }
}

