export interface IDatabaseService {
  createCampaign(campaign: any): Promise<any>;
  createCampaignWithDetails(campaign: any): Promise<any>;
  createEventWithDetails(event: any): Promise<any>;
  getCampaigns(limit: number, offset: number): Promise<any[]>;
  getCampaignByBlobId(blobId: string): Promise<any | null>;
  getCampaignByObjectId(objectId: string): Promise<any | null>;
  getCampaignByDbId(id: string): Promise<any | null>;
  getCampaignsByCreator(creatorAddress: string): Promise<any[]>;
  getEvents(limit: number, offset: number): Promise<any[]>;
  getEventById(eventId: string): Promise<any | null>;
  getEventMilestonesByEventId(eventId: string): Promise<any[]>;
  getEventServicesByEventId(eventId: string): Promise<any[]>;
  getEventGalleryImagesByEventId(eventId: string): Promise<any[]>;
  updateCampaignCurrentAmount(id: string, amount: number): Promise<any>;
  createImage(image: any): Promise<any>;
  getImagesByCampaignId(campaignId: string): Promise<any[]>;
  getStorySectionsByCampaignId(campaignId: string): Promise<any[]>;
  getRoadmapPhasesByCampaignId(campaignId: string): Promise<any[]>;
  getTeamMembersByCampaignId(campaignId: string): Promise<any[]>;
  createMilestone(milestone: any): Promise<any>;
  getMilestonesByObjectId(objectId: string): Promise<any[]>;
  getMilestone(campaignId: string, milestoneId: string): Promise<any | null>;
  updateMilestoneVoteResult(
    campaignId: string,
    milestoneId: string,
    voteResult: number,
  ): Promise<void>;
  updateMilestoneIsClaimed(
    campaignId: string,
    milestoneId: string,
    isClaimed: boolean,
  ): Promise<void>;
  getMilestonesByCampaignIdAndStatus(
    campaignId: string,
    status: string,
  ): Promise<any[]>;
  createContribution(contribution: any): Promise<any>;
  getContributionsByAddress(address: string): Promise<any[]>;
  getContributionsByCampaignId(campaignId: string): Promise<any[]>;
  createTier(tier: any): Promise<any>;
  createUser(user: any): Promise<any>;
  getUserByWalletAddress(walletAddress: string): Promise<any | null>;
  getUserByEmail(email: string): Promise<any | null>;
}
