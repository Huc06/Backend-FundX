import { Injectable, Inject } from '@nestjs/common';
import { CreateContributionDto } from './dto/create-contribution.dto';
import type { IDatabaseService } from '../database/interfaces/database.interface';

@Injectable()
export class ContributionsService {
  constructor(
    @Inject('DATABASE_SERVICE')
    private readonly databaseService: IDatabaseService,
  ) {}

  /**
   * Create a new contribution and update campaign current_amount
   */
  async createContribution(createContributionDto: CreateContributionDto) {
    const contribution = {
      campaign_id: createContributionDto.campaignId,
      wallet_address: createContributionDto.walletAddress,
      amount: createContributionDto.amount,
      tx_hash: createContributionDto.txHash,
      tier_type: createContributionDto.tierType,
      currency: createContributionDto.currency,
      created_at: new Date().toISOString(),
    };

    const savedContribution = await this.databaseService.createContribution(contribution);

    // Update campaign current_amount
    const campaign = await this.databaseService.getCampaignByBlobId(
      createContributionDto.campaignId,
    );
    if (!campaign) {
      return {
        is_success: false,
        error: `Campaign with blob_id ${createContributionDto.campaignId} not found`,
        data: savedContribution,
      };
    }
    const newAmount = (campaign.current_amount || 0) + createContributionDto.amount;
    const updatedCampaign = await this.databaseService.updateCampaignCurrentAmount(
      createContributionDto.campaignId,
      newAmount,
    );

    return {
      is_success: true,
      data: savedContribution,
      updated_campaign: updatedCampaign,
    };
  }

  /**
   * Get contributions by wallet address
   */
  async getContributionsByAddress(address: string) {
    const contributions = await this.databaseService.getContributionsByAddress(address);

    // Group by campaign and calculate totals
    const campaignContributions = new Map<string, number>();
    const campaignDetails = new Map<string, any>();

    for (const contribution of contributions) {
      const campaignId = contribution.campaign_id;
      const amount = contribution.amount;

      if (!campaignContributions.has(campaignId)) {
        campaignContributions.set(campaignId, 0);
      }
      campaignContributions.set(
        campaignId,
        campaignContributions.get(campaignId)! + amount,
      );

      // Get campaign details (simplified - in real implementation, join with campaigns)
      if (!campaignDetails.has(campaignId)) {
        const campaign = await this.databaseService.getCampaignByBlobId(campaignId);
        if (campaign) {
          campaignDetails.set(campaignId, {
            blob_id: campaign.blob_id,
            campaign_name: campaign.campaign_name,
            creator_address: campaign.creator_address,
            creator: campaign.creator,
            goal: campaign.goal,
            reward_type: campaign.reward_type,
            currency: campaign.currency,
            current_amount: campaign.current_amount,
            description: campaign.description,
            object_id: campaign.object_id,
            category: campaign.category,
          });
        }
      }
    }

    const results: any[] = [];
    for (const [campaignId, totalContributed] of campaignContributions.entries()) {
      const campaignInfo = campaignDetails.get(campaignId);

      // Get first image
      const images = await this.databaseService.getImagesByCampaignId(campaignId);

      results.push({
        campaign_id: campaignId,
        total_contributed_by_user: totalContributed,
        campaign_details: campaignInfo || null,
        images: images && images.length > 0 ? images[0] : null,
      });
    }

    const totalContributedAllCampaigns = Array.from(campaignContributions.values()).reduce(
      (sum, amount) => sum + amount,
      0,
    );

    return {
      is_success: true,
      data: results,
      total_contributed: totalContributedAllCampaigns,
    };
  }

  /**
   * Get all wallet addresses that contributed to a campaign
   */
  async getAddressesByCampaign(campaignId: string) {
    const contributions = await this.databaseService.getContributionsByCampaignId(campaignId);

    const addresses = new Set<string>();
    for (const contribution of contributions) {
      addresses.add(contribution.wallet_address);
    }

    return {
      is_success: true,
      data: {
        campaign_id: campaignId,
        addresses: Array.from(addresses),
      },
    };
  }
}
