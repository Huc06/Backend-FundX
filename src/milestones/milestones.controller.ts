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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateVoteResultDto } from './dto/update-vote-result.dto';

@ApiTags('Milestones')
@Controller()
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Post('upload-milestone')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create a new milestone for a campaign' })
  @ApiBody({ type: CreateMilestoneDto })
  @ApiResponse({
    status: 200,
    description: 'Milestone created successfully',
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
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
  @ApiOperation({ summary: 'Update vote result for a milestone' })
  @ApiParam({
    name: 'object_id',
    type: String,
    description: 'Campaign object ID',
    example: 'obj-123',
  })
  @ApiParam({
    name: 'milestone_id',
    type: String,
    description: 'Milestone ID',
    example: 'm1',
  })
  @ApiBody({ type: UpdateVoteResultDto })
  @ApiResponse({
    status: 200,
    description: 'Vote result updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Milestone not found or invalid status',
  })
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
  @ApiOperation({ summary: 'Mark milestone as claimed' })
  @ApiParam({
    name: 'object_id',
    type: String,
    description: 'Campaign object ID',
    example: 'obj-123',
  })
  @ApiParam({
    name: 'milestone_id',
    type: String,
    description: 'Milestone ID',
    example: 'm1',
  })
  @ApiResponse({
    status: 200,
    description: 'Milestone marked as claimed successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Milestone not found or invalid status',
  })
  async updateIsClaimed(
    @Param('object_id') objectId: string,
    @Param('milestone_id') milestoneId: string,
  ) {
    try {
      return await this.milestonesService.updateIsClaimed(
        objectId,
        milestoneId,
      );
    } catch (error) {
      return {
        is_success: false,
        error: error.message,
      };
    }
  }

  @Get('milestones')
  @ApiOperation({ summary: 'Get milestones for a campaign' })
  @ApiQuery({
    name: 'id',
    required: true,
    type: String,
    example: 'obj-123',
    description: 'Campaign object ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Milestones retrieved successfully',
  })
  @ApiResponse({ status: 400, description: 'Missing id parameter' })
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
