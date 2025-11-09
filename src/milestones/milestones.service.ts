import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateVoteResultDto } from './dto/update-vote-result.dto';

@Injectable()
export class MilestonesService {
  /**
   * Create a new milestone for a campaign
   * TODO: Implement database logic with Walrus
   */
  async createMilestone(createMilestoneDto: CreateMilestoneDto) {
    const now = new Date();
    const votingEnd = new Date(
      now.getTime() + createMilestoneDto.votingDurationDays * 24 * 60 * 60 * 1000,
    );

    const milestone = {
      created_at: now.toISOString(),
      campaign_id: createMilestoneDto.campaignId,
      object_id: createMilestoneDto.objectId,
      milestone_id: createMilestoneDto.milestoneId,
      title: createMilestoneDto.title,
      status: createMilestoneDto.status || 'pending',
      description: createMilestoneDto.description,
      deliverables: createMilestoneDto.deliverables,
      goal_milestone: createMilestoneDto.amount,
      is_claimed: false,
      timeline_start: createMilestoneDto.timelineStart,
      timeline_end: createMilestoneDto.timelineEnd,
      voting_end: votingEnd.toISOString(),
      information_id: createMilestoneDto.informationId,
      vote_result: 0,
      currency: createMilestoneDto.currency,
    };

    // TODO: Save to Walrus database
    // const savedMilestone = await this.databaseService.createMilestone(milestone);

    return {
      is_success: true,
      data: milestone,
    };
  }

  /**
   * Update vote result for a milestone
   * TODO: Implement database logic with Walrus
   */
  async updateVoteResult(
    objectId: string,
    milestoneId: string,
    updateVoteResultDto: UpdateVoteResultDto,
  ) {
    // TODO: Check if milestone exists and status is "in-voting"
    // const milestone = await this.databaseService.getMilestone(objectId, milestoneId);
    
    // if (!milestone) {
    //   throw new BadRequestException('Milestone not found');
    // }
    
    // if (milestone.status !== 'in-voting') {
    //   return {
    //     is_success: false,
    //     message: "Milestone status is not 'in-voting'. Cannot update vote result.",
    //   };
    // }

    // TODO: Update vote_result in Walrus
    // const currentVoteResult = milestone.vote_result || 0;
    // const newVoteResult = currentVoteResult + updateVoteResultDto.voteResult;
    // await this.databaseService.updateMilestoneVoteResult(objectId, milestoneId, newVoteResult);

    return {
      is_success: true,
      message: `Vote result for campaign ${objectId}, milestone ${milestoneId} updated successfully.`,
      new_vote_result: updateVoteResultDto.voteResult,
    };
  }

  /**
   * Update is_claimed for a milestone
   * TODO: Implement database logic with Walrus
   */
  async updateIsClaimed(objectId: string, milestoneId: string) {
    // TODO: Check if milestone exists and status is "approved"
    // const milestone = await this.databaseService.getMilestone(objectId, milestoneId);
    
    // if (!milestone) {
    //   throw new BadRequestException('Milestone not found');
    // }
    
    // if (milestone.status !== 'approved') {
    //   return {
    //     is_success: false,
    //     message: "Milestone status is not 'approved'. Cannot update is_claimed.",
    //   };
    // }

    // TODO: Update is_claimed in Walrus
    // await this.databaseService.updateMilestoneIsClaimed(objectId, milestoneId, true);

    return {
      is_success: true,
      message: `is_claimed for campaign ${objectId}, milestone ${milestoneId} updated to true.`,
    };
  }

  /**
   * Get milestones by campaign object_id
   * TODO: Implement database logic with Walrus
   */
  async getMilestonesByCampaign(objectId: string) {
    // TODO: Fetch milestones from Walrus
    // const milestones = await this.databaseService.getMilestonesByObjectId(objectId);

    return {
      is_success: true,
      data: {
        object_id: objectId,
        milestones: [],
      },
    };
  }
}

