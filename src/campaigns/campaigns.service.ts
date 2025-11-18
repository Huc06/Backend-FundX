import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import type { IDatabaseService } from '../database/interfaces/database.interface';

@Injectable()
export class CampaignsService {
  constructor(
    @Inject('DATABASE_SERVICE')
    private readonly databaseService: IDatabaseService,
  ) {}

  /**
   * Create a new campaign
   */
  async create(createCampaignDto: CreateCampaignDto) {
    const campaignData = {
      creator_address: createCampaignDto.creator_address,
      on_chain_object_id: createCampaignDto.on_chain_object_id,
      title: createCampaignDto.title,
      short_description: createCampaignDto.short_description,
      category: createCampaignDto.category,
      goal_amount: createCampaignDto.goal_amount,
      currency: createCampaignDto.currency || 'USD',
      duration_days: createCampaignDto.duration_days,
      reward_type: createCampaignDto.reward_type || 'none',
      story_sections: createCampaignDto.story_sections,
      roadmap_phases: createCampaignDto.roadmap_phases,
      team_members: createCampaignDto.team_members,
      gallery_images: createCampaignDto.gallery_images,
    };

    const newCampaign =
      await this.databaseService.createCampaignWithDetails(campaignData);

    return {
      is_success: true,
      data: {
        campaign_id: newCampaign.id,
      },
    };
  }

  /**
   * Get list of campaigns with pagination
   */
  async getCampaigns(limit: number = 10, offset: number = 0) {
    const campaigns = await this.databaseService.getCampaigns(limit, offset);
    const enrichedCampaigns = await Promise.all(
      campaigns.map(async (campaign) => {
        const campaignId = campaign.id;

        // Get images
        const images =
          await this.databaseService.getImagesByCampaignId(campaignId);

        // Get contributions
        const contributions =
          await this.databaseService.getContributionsByCampaignId(campaignId);

        return {
          ...campaign,
          images: images || [],
          contributions: contributions || [],
        };
      }),
    );

    return {
      is_success: true,
      data: enrichedCampaigns,
      limit,
      offset,
    };
  }

  /**
   * Get campaigns by creator address
   */
  async getCampaignsByCreator(creatorAddress: string) {
    const campaigns =
      await this.databaseService.getCampaignsByCreator(creatorAddress);

    const enrichedCampaigns = await Promise.all(
      campaigns.map(async (campaign) => {
        const campaignId = campaign.id;

        // Get images
        const images =
          await this.databaseService.getImagesByCampaignId(campaignId);

        // Get contributions
        const contributions =
          await this.databaseService.getContributionsByCampaignId(campaignId);

        // Get milestones
        const milestones = await this.databaseService.getMilestonesByObjectId(
          campaign.object_id,
        );

        return {
          ...campaign,
          images: images || [],
          contributions: contributions || [],
          milestones: milestones || [],
        };
      }),
    );

    return {
      is_success: true,
      data: enrichedCampaigns,
    };
  }

  /**
   * Get campaigns that are completed and have milestones in voting
   */
  async getVotingCampaigns(limit: number = 10, offset: number = 0) {
    const allCampaigns = await this.databaseService.getCampaigns(1000, 0);
    const completedCampaigns = allCampaigns.filter(
      (c) => c.is_completed === true,
    );

    const enrichedCampaigns: any[] = [];

    for (const campaign of completedCampaigns.slice(offset, offset + limit)) {
      const campaignId = campaign.id;

      // Get milestones with status 'in-voting'
      const milestones =
        await this.databaseService.getMilestonesByCampaignIdAndStatus(
          campaignId,
          'in-voting',
        );

      if (milestones && milestones.length > 0) {
        // Get images
        const images =
          await this.databaseService.getImagesByCampaignId(campaignId);

        enrichedCampaigns.push({
          ...campaign,
          images: images || [],
          milestone: milestones[0] || null,
        });
      }
    }

    return {
      is_success: true,
      data: enrichedCampaigns,
      limit,
      offset,
    };
  }

  /**
   * Get campaign by object_id
   */
  async getCampaignById(id: string) {
    const isUUID =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        id,
      );

    let campaign;
    if (isUUID) {
      campaign = await this.databaseService.getCampaignByDbId(id);
    } else {
      campaign = await this.databaseService.getCampaignByObjectId(id);
    }

    if (!campaign) {
      throw new NotFoundException(`Campaign with id ${id} not found`);
    }

    const campaignId = campaign.id;

    // Get images
    const images = await this.databaseService.getImagesByCampaignId(campaignId);

    // Get contributions
    const contributions =
      await this.databaseService.getContributionsByCampaignId(campaignId);

    // Get story sections
    const storySections =
      await this.databaseService.getStorySectionsByCampaignId(campaignId);

    // Get roadmap phases
    const roadmapPhases =
      await this.databaseService.getRoadmapPhasesByCampaignId(campaignId);

    // Get team members
    const teamMembers =
      await this.databaseService.getTeamMembersByCampaignId(campaignId);

    return {
      is_success: true,
      data: {
        ...campaign,
        images: images || [],
        contributions: contributions || [],
        story_sections: storySections || [],
        roadmap_phases: roadmapPhases || [],
        team_members: teamMembers || [],
      },
      campaign_id: id,
    };
  }
}
