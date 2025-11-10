import { Injectable, Inject } from '@nestjs/common';
import type { IDatabaseService } from '../database/interfaces/database.interface';

export interface UserProfile {
  address: string;
  totalCampaignsCreated: number;
  totalContributions: number;
  totalContributionAmount: number;
}

/**
 * Profile Service - Manages user profile data
 * Aggregates data from campaigns and contributions
 */
@Injectable()
export class ProfileService {
  constructor(
    @Inject('DATABASE_SERVICE')
    private readonly databaseService: IDatabaseService,
  ) {}

  /**
   * Get user profile information
   * @param userAddress - Wallet address
   * @returns User profile data
   */
  async getUserProfile(userAddress: string): Promise<UserProfile> {
    // Get user's created campaigns
    const createdCampaigns = await this.databaseService.getCampaignsByCreator(userAddress);

    // Get user's contributions
    const contributions = await this.databaseService.getContributionsByAddress(userAddress);

    // Calculate total contribution amount
    const totalContributionAmount = contributions.reduce(
      (total, contribution) => total + (contribution.amount || 0),
      0,
    );

    return {
      address: userAddress,
      totalCampaignsCreated: createdCampaigns.length,
      totalContributions: contributions.length,
      totalContributionAmount,
    };
  }

  /**
   * Get campaigns created by user
   * @param userAddress - Wallet address
   * @returns Array of campaigns
   */
  async getCreatedCampaigns(userAddress: string) {
    const campaigns = await this.databaseService.getCampaignsByCreator(userAddress);

    // Enrich each campaign with additional data
    const enrichedCampaigns = await Promise.all(
      campaigns.map(async (campaign) => {
        const campaignId = campaign.blob_id;

        // Get images
        const images = await this.databaseService.getImagesByCampaignId(campaignId);

        // Get contributions
        const contributions = await this.databaseService.getContributionsByCampaignId(campaignId);

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

    return enrichedCampaigns;
  }

  /**
   * Get contributions made by user
   * @param userAddress - Wallet address
   * @returns Array of contributions with campaign data
   */
  async getContributions(userAddress: string) {
    const contributions = await this.databaseService.getContributionsByAddress(userAddress);

    // Enrich each contribution with campaign data
    const enrichedContributions = await Promise.all(
      contributions.map(async (contribution) => {
        const campaign = await this.databaseService.getCampaignByBlobId(
          contribution.campaign_id,
        );

        return {
          ...contribution,
          campaign: campaign || null,
        };
      }),
    );

    return enrichedContributions;
  }
}

