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
  async createCampaign(createCampaignDto: CreateCampaignDto) {
    const now = new Date();
    const endAt = new Date(
      now.getTime() + createCampaignDto.duration * 24 * 60 * 60 * 1000,
    );

    const campaign = {
      blob_id: createCampaignDto.blobId,
      created_at: now.toISOString(),
      creator_address: createCampaignDto.creatorAddress,
      creator: createCampaignDto.creatorName,
      goal: createCampaignDto.targetAmount,
      reward_type: createCampaignDto.rewardType,
      is_completed: false,
      currency: createCampaignDto.currency,
      current_amount: 0,
      start_at: now.toISOString(),
      end_at: endAt.toISOString(),
      is_pending: false,
      description: createCampaignDto.description,
      campaign_name: createCampaignDto.title,
      object_id: createCampaignDto.objectId,
      tx_hash: createCampaignDto.txHash,
      category: createCampaignDto.category,
    };

    const savedCampaign = await this.databaseService.createCampaign(campaign);

    return {
      is_success: true,
      data: savedCampaign,
    };
  }

  /**
   * Get list of campaigns with pagination
   */
  async getCampaigns(limit: number = 10, offset: number = 0) {
    const campaigns = await this.databaseService.getCampaigns(limit, offset);

    const enrichedCampaigns = await Promise.all(
      campaigns.map(async (campaign) => {
        const campaignId = campaign.blob_id;

        // Get images
        const images = await this.databaseService.getImagesByCampaignId(campaignId);

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
    const campaigns = await this.databaseService.getCampaignsByCreator(creatorAddress);

    const enrichedCampaigns = await Promise.all(
      campaigns.map(async (campaign) => {
        const campaignId = campaign.blob_id;

        // Get images
        const images = await this.databaseService.getImagesByCampaignId(campaignId);

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
    const completedCampaigns = allCampaigns.filter((c) => c.is_completed === true);

    const enrichedCampaigns: any[] = [];

    for (const campaign of completedCampaigns.slice(offset, offset + limit)) {
      const campaignId = campaign.blob_id;

      // Get milestones with status 'in-voting'
      const milestones = await this.databaseService.getMilestonesByCampaignIdAndStatus(
        campaignId,
        'in-voting',
      );

      if (milestones && milestones.length > 0) {
        // Get images
        const images = await this.databaseService.getImagesByCampaignId(campaignId);

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
  async getCampaignById(objectId: string) {
    const campaign = await this.databaseService.getCampaignByObjectId(objectId);

    if (!campaign) {
      throw new NotFoundException(`Campaign with id ${objectId} not found`);
    }

    const campaignId = campaign.blob_id;

    // Get images
    const images = await this.databaseService.getImagesByCampaignId(campaignId);

    // Get contributions
    const contributions =
      await this.databaseService.getContributionsByCampaignId(campaignId);

    return {
      is_success: true,
      data: {
        ...campaign,
        images: images || [],
        contributions: contributions || [],
      },
      object_id: objectId,
    };
  }
}
