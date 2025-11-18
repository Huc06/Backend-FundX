import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateContributionDto } from './dto/create-contribution.dto';
import type { IDatabaseService } from '../database/interfaces/database.interface';

@Injectable()
export class ContributionsService {
  constructor(
    @Inject('DATABASE_SERVICE')
    private readonly databaseService: IDatabaseService,
  ) {}

  async createContribution(createContributionDto: CreateContributionDto) {
    const {
      campaignId,
      eventId,
      walletAddress,
      amount,
      txHash,
      currency,
      tier,
    } = createContributionDto;

    let user = await this.databaseService.getUserByWalletAddress(walletAddress);
    if (!user) {
      user = await this.databaseService.createUser({
        wallet_address: walletAddress,
      });
    }

    const contribution = {
      user_id: user.id,
      campaign_id: campaignId || null,
      event_id: eventId || null,
      amount,
      transaction_hash: txHash,
      currency,
      tier,
    };

    const data = await this.databaseService.createContributionAndupdateAmount(contribution);
    return {
      is_success: true,
      data: data,
    };
  }

  async getAllContributions() {
    const data = await this.databaseService.getAllContributions();
    return {
      is_success: true,
      data: data,
    };
  }

  async getContributionsByWalletAddress(address: string) {
    const data = await this.databaseService.getContributionsByAddress(address);
    return {
      is_success: true,
      data: data,
    };
  }

  async getContributionsByCampaignId(campaignId: string) {
    const data = await this.databaseService.getContributionsByCampaignId(campaignId);
    return {
      is_success: true,
      data: data,
    };
  }

  async getContributionsByEventId(eventId: string) {
    const data = await this.databaseService.getContributionsByEventId(eventId);
    return {
      is_success: true,
      data: data,
    };
  }

  async getContributionsOfAllCampaigns() {
    const allContributions = await this.databaseService.getAllContributions();
    const data = allContributions.filter((c) => c.campaign_id);
    return {
      is_success: true,
      data: data,
    };
  }

  async getContributionsOfAllEvents() {
    const allContributions = await this.databaseService.getAllContributions();
    const data = allContributions.filter((c) => c.event_id);
    return {
      is_success: true,
      data: data,
    };
  }
}
