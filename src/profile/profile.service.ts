import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { IDatabaseService } from '../database/interfaces/database.interface';
import { CreateProfileDto, UserRole } from './dto/create-profile.dto';

export interface UserProfile {
  id: string;
  wallet_address: string;
  username?: string;
  email?: string;
  role: UserRole;
  bio?: string;
  avatar_url?: string;
  created_at: Date;
  updated_at: Date;
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

  async createProfile(createProfileDto: CreateProfileDto): Promise<any> {
    const existingUserByWallet = await this.databaseService.getUserByWalletAddress(createProfileDto.walletAddress);
    if (existingUserByWallet) {
      throw new BadRequestException('User with this wallet address already exists.');
    }

    if (createProfileDto.email) {
      const existingUserByEmail = await this.databaseService.getUserByEmail(createProfileDto.email);
      if (existingUserByEmail) {
        throw new BadRequestException('User with this email already exists.');
      }
    }

    const newUser = {
      wallet_address: createProfileDto.walletAddress,
      username: createProfileDto.username,
      email: createProfileDto.email,
      role: createProfileDto.role || UserRole.USER,
      bio: createProfileDto.bio,
      avatar_url: createProfileDto.avatarUrl,
    };

    return this.databaseService.createUser(newUser);
  }

  async getProfileByWalletAddress(walletAddress: string): Promise<any | null> {
    const user = await this.databaseService.getUserByWalletAddress(walletAddress);
    if (!user) {
      return null;
    }
    // For existing users, we might want to aggregate data like in getUserProfile
    // For now, just return the user object
    return user;
  }

  async getProfileByEmail(email: string): Promise<any | null> {
    const user = await this.databaseService.getUserByEmail(email);
    if (!user) {
      return null;
    }
    // For existing users, we might want to aggregate data like in getUserProfile
    // For now, just return the user object
    return user;
  }

  /**
   * Get user profile information
   * @param userAddress - Wallet address
   * @returns User profile data
   */
  async getUserProfile(userAddress: string): Promise<UserProfile> {
    const user = await this.databaseService.getUserByWalletAddress(userAddress);
    if (!user) {
      throw new BadRequestException('User not found.');
    }

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
      id: user.id,
      wallet_address: user.wallet_address,
      username: user.username,
      email: user.email,
      role: user.role,
      bio: user.bio,
      avatar_url: user.avatar_url,
      created_at: user.created_at,
      updated_at: user.updated_at,
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

