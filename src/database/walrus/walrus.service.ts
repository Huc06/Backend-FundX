import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IDatabaseService } from '../interfaces/database.interface';

@Injectable()
export class WalrusService implements IDatabaseService, OnModuleInit {
  private readonly logger = new Logger(WalrusService.name);
  private readonly aggregatorUrl: string;
  private readonly rpcUrl?: string;

  constructor(private configService: ConfigService) {
    this.aggregatorUrl =
      this.configService.get<string>('WALRUS_AGGREGATOR_URL') ||
      'https://aggregator.walrus.space';
    this.rpcUrl = this.configService.get<string>('WALRUS_RPC_URL');
  }

  async onModuleInit() {
    this.logger.log(`Initializing Walrus service with aggregator: ${this.aggregatorUrl}`);
  }

  /**
   * Store data as JSON blob in Walrus
   */
  private async storeBlob(data: any): Promise<string> {
    try {
      const jsonData = JSON.stringify(data);
      const response = await fetch(`${this.aggregatorUrl}/v1/store`, {
        method: 'PUT',
        body: jsonData,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Walrus store failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.blobId;
    } catch (error) {
      this.logger.error(`Error storing blob in Walrus: ${error.message}`);
      throw error;
    }
  }

  /**
   * Retrieve blob from Walrus by blob ID
   */
  private async getBlob(blobId: string): Promise<any> {
    try {
      const response = await fetch(`${this.aggregatorUrl}/v1/blob/${blobId}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Walrus get failed: ${response.statusText}`);
      }

      const data = await response.text();
      return JSON.parse(data);
    } catch (error) {
      this.logger.error(`Error getting blob from Walrus: ${error.message}`);
      return null;
    }
  }

  /**
   * Store collection of items (simulating table-like structure)
   * In Walrus, we store collections as JSON arrays
   * Returns the blob ID for the collection
   */
  private async storeCollection(
    collectionName: string,
    items: any[],
  ): Promise<string> {
    const blobId = await this.storeBlob({ collection: collectionName, items });
    // Store the index blob ID in memory/config for retrieval
    // In production, you might want to store this in a separate index
    this.logger.debug(`Stored ${collectionName} collection with ${items.length} items`);
    return blobId;
  }

  /**
   * Get all items from a collection
   * Note: This is a simplified implementation. In production, you'd maintain
   * a proper index of blob IDs for each collection
   */
  private async getCollection(collectionName: string): Promise<any[]> {
    // Get the index blob ID from config
    const indexBlobId = this.configService.get<string>(
      `WALRUS_${collectionName.toUpperCase()}_INDEX`,
    );

    if (!indexBlobId) {
      this.logger.warn(
        `No index blob ID found for collection ${collectionName}. Returning empty array.`,
      );
      return [];
    }

    const data = await this.getBlob(indexBlobId);
    if (!data || !data.items) {
      return [];
    }

    return Array.isArray(data.items) ? data.items : [];
  }

  /**
   * Update collection index blob ID
   * This should be called after storing a new collection version
   */
  private async updateCollectionIndex(
    collectionName: string,
    blobId: string,
  ): Promise<void> {
    // In a real implementation, you'd update the config or a master index
    // For now, we'll log it - the blob ID should be manually added to .env
    this.logger.log(
      `Collection ${collectionName} updated. Add to .env: WALRUS_${collectionName.toUpperCase()}_INDEX=${blobId}`,
    );
  }

  // Campaign operations
  async createCampaign(campaign: any): Promise<any> {
    const campaigns = await this.getCollection('campaigns');
    campaigns.push(campaign);
    const blobId = await this.storeCollection('campaigns', campaigns);
    await this.updateCollectionIndex('campaigns', blobId);
    this.logger.log(`Campaign created. Collection blob ID: ${blobId}`);
    return campaign;
  }

  async getCampaigns(limit: number, offset: number): Promise<any[]> {
    const campaigns = await this.getCollection('campaigns');
    return campaigns.slice(offset, offset + limit);
  }

  async getCampaignByBlobId(blobId: string): Promise<any | null> {
    const campaigns = await this.getCollection('campaigns');
    return campaigns.find((c) => c.blob_id === blobId) || null;
  }

  async getCampaignByObjectId(objectId: string): Promise<any | null> {
    const campaigns = await this.getCollection('campaigns');
    return campaigns.find((c) => c.object_id === objectId) || null;
  }

  async getCampaignsByCreator(creatorAddress: string): Promise<any[]> {
    const campaigns = await this.getCollection('campaigns');
    return campaigns.filter((c) => c.creator_address === creatorAddress);
  }

  async updateCampaignCurrentAmount(blobId: string, amount: number): Promise<any> {
    const campaigns = await this.getCollection('campaigns');
    const campaign = campaigns.find((c) => c.blob_id === blobId);

    if (!campaign) {
      throw new Error(`Campaign with blob_id ${blobId} not found`);
    }

    campaign.current_amount = amount;
    const newBlobId = await this.storeCollection('campaigns', campaigns);
    await this.updateCollectionIndex('campaigns', newBlobId);
    return campaign;
  }

  // Image operations
  async createImage(image: any): Promise<any> {
    const images = await this.getCollection('images');
    images.push(image);
    const blobId = await this.storeCollection('images', images);
    await this.updateCollectionIndex('images', blobId);
    return image;
  }

  async getImagesByCampaignId(campaignId: string): Promise<any[]> {
    const images = await this.getCollection('images');
    return images.filter((img) => img.campaign_id === campaignId);
  }

  // Milestone operations
  async createMilestone(milestone: any): Promise<any> {
    const milestones = await this.getCollection('milestones');
    milestones.push(milestone);
    const blobId = await this.storeCollection('milestones', milestones);
    await this.updateCollectionIndex('milestones', blobId);
    return milestone;
  }

  async getMilestonesByObjectId(objectId: string): Promise<any[]> {
    const milestones = await this.getCollection('milestones');
    return milestones.filter((m) => m.object_id === objectId);
  }

  async getMilestone(objectId: string, milestoneId: string): Promise<any | null> {
    const milestones = await this.getCollection('milestones');
    return (
      milestones.find(
        (m) => m.object_id === objectId && m.milestone_id === milestoneId,
      ) || null
    );
  }

  async updateMilestoneVoteResult(
    objectId: string,
    milestoneId: string,
    voteResult: number,
  ): Promise<void> {
    const milestones = await this.getCollection('milestones');
    const milestone = milestones.find(
      (m) => m.object_id === objectId && m.milestone_id === milestoneId,
    );

    if (milestone) {
      milestone.vote_result = voteResult;
      const blobId = await this.storeCollection('milestones', milestones);
      await this.updateCollectionIndex('milestones', blobId);
    }
  }

  async updateMilestoneIsClaimed(
    objectId: string,
    milestoneId: string,
    isClaimed: boolean,
  ): Promise<void> {
    const milestones = await this.getCollection('milestones');
    const milestone = milestones.find(
      (m) => m.object_id === objectId && m.milestone_id === milestoneId,
    );

    if (milestone) {
      milestone.is_claimed = isClaimed;
      const blobId = await this.storeCollection('milestones', milestones);
      await this.updateCollectionIndex('milestones', blobId);
    }
  }

  async getMilestonesByCampaignIdAndStatus(
    campaignId: string,
    status: string,
  ): Promise<any[]> {
    const milestones = await this.getCollection('milestones');
    return milestones.filter(
      (m) => m.campaign_id === campaignId && m.status === status,
    );
  }

  // Contribution operations
  async createContribution(contribution: any): Promise<any> {
    const contributions = await this.getCollection('contributions');
    contributions.push(contribution);
    const blobId = await this.storeCollection('contributions', contributions);
    await this.updateCollectionIndex('contributions', blobId);
    return contribution;
  }

  async getContributionsByAddress(address: string): Promise<any[]> {
    const contributions = await this.getCollection('contributions');
    return contributions.filter((c) => c.wallet_address === address);
  }

  async getContributionsByCampaignId(campaignId: string): Promise<any[]> {
    const contributions = await this.getCollection('contributions');
    return contributions.filter((c) => c.campaign_id === campaignId);
  }

  // Tier operations
  async createTier(tier: any): Promise<any> {
    const tiers = await this.getCollection('tiers');
    tiers.push(tier);
    const blobId = await this.storeCollection('tiers', tiers);
    await this.updateCollectionIndex('tiers', blobId);
    return tier;
  }
}

