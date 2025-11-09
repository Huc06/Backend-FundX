/**
 * Database abstraction interface
 * Allows easy swapping of database implementations
 */
export interface IDatabaseService {
  // Campaign operations
  createCampaign(campaign: any): Promise<any>;
  getCampaigns(limit: number, offset: number): Promise<any[]>;
  getCampaignByBlobId(blobId: string): Promise<any | null>;
  getCampaignByObjectId(objectId: string): Promise<any | null>;
  getCampaignsByCreator(creatorAddress: string): Promise<any[]>;
  updateCampaignCurrentAmount(blobId: string, amount: number): Promise<any>;

  // Image operations
  createImage(image: any): Promise<any>;
  getImagesByCampaignId(campaignId: string): Promise<any[]>;

  // Milestone operations
  createMilestone(milestone: any): Promise<any>;
  getMilestonesByObjectId(objectId: string): Promise<any[]>;
  getMilestone(objectId: string, milestoneId: string): Promise<any | null>;
  updateMilestoneVoteResult(
    objectId: string,
    milestoneId: string,
    voteResult: number,
  ): Promise<void>;
  updateMilestoneIsClaimed(
    objectId: string,
    milestoneId: string,
    isClaimed: boolean,
  ): Promise<void>;
  getMilestonesByCampaignIdAndStatus(
    campaignId: string,
    status: string,
  ): Promise<any[]>;

  // Contribution operations
  createContribution(contribution: any): Promise<any>;
  getContributionsByAddress(address: string): Promise<any[]>;
  getContributionsByCampaignId(campaignId: string): Promise<any[]>;

  // Tier operations
  createTier(tier: any): Promise<any>;
}

