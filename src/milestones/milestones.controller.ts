import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateVoteResultDto } from './dto/update-vote-result.dto';

@Controller()
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Post('upload-milestone')
  @HttpCode(HttpStatus.OK)
  async uploadMilestone(@Body() createMilestoneDto: CreateMilestoneDto) {
    try {
      return await this.milestonesService.createMilestone(createMilestoneDto);
    } catch (error) {
      return {
        is_success: false,
        error: error.message,
      };
    }
  }

  @Put('campaigns/:object_id/milestones/:milestone_id/vote-result')
  @HttpCode(HttpStatus.OK)
  async updateVoteResult(
    @Param('object_id') objectId: string,
    @Param('milestone_id') milestoneId: string,
    @Body() updateVoteResultDto: UpdateVoteResultDto,
  ) {
    try {
      return await this.milestonesService.updateVoteResult(
        objectId,
        milestoneId,
        updateVoteResultDto,
      );
    } catch (error) {
      return {
        is_success: false,
        error: error.message,
      };
    }
  }

  @Put('campaigns/:object_id/milestones/:milestone_id/claimed')
  @HttpCode(HttpStatus.OK)
  async updateIsClaimed(
    @Param('object_id') objectId: string,
    @Param('milestone_id') milestoneId: string,
  ) {
    try {
      return await this.milestonesService.updateIsClaimed(objectId, milestoneId);
    } catch (error) {
      return {
        is_success: false,
        error: error.message,
      };
    }
  }

  @Get('milestones')
  async getMilestones(@Query('id') id?: string) {
    if (!id) {
      throw new BadRequestException('Missing id parameter');
    }
    try {
      return await this.milestonesService.getMilestonesByCampaign(id);
    } catch (error) {
      return {
        is_success: false,
        error: error.message,
      };
    }
  }
}

