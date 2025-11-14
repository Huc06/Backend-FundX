import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IDatabaseService } from '../interfaces/database.interface';

@Injectable()
export class SupabaseService implements IDatabaseService, OnModuleInit {
  private readonly logger = new Logger(SupabaseService.name);
  private client: SupabaseClient;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase URL and Anon Key must be provided.');
    }

    this.client = createClient(supabaseUrl, supabaseAnonKey);
    this.logger.log('Supabase client initialized.');
  }

  getClient(): SupabaseClient {
    return this.client;
  }

  async createCampaignWithDetails(campaign: any): Promise<any> {
    const { data, error } = await this.client.rpc(
      'create_campaign_with_details',
      {
        p_creator_id: campaign.creator_id,
        p_on_chain_object_id: campaign.on_chain_object_id,
        p_title: campaign.title,
        p_short_description: campaign.short_description,
        p_category: campaign.category,
        p_goal_amount: campaign.goal_amount,
        p_currency: campaign.currency,
        p_duration_days: campaign.duration_days,
        p_reward_type: campaign.reward_type,
        p_story_sections: campaign.story_sections,
        p_roadmap_phases: campaign.roadmap_phases,
        p_team_members: campaign.team_members,
        p_gallery_images: campaign.gallery_images,
      },
    );

    if (error) {
      this.logger.error(
        'Error calling create_campaign_with_details RPC',
        error,
      );
      throw new Error(error.message);
    }
    return { id: data };
  }

  async createEventWithDetails(event: any): Promise<any> {
    const { data, error } = await this.client.rpc('create_event_with_details', {
      p_creator_id: event.creator_id,
      p_name: event.name,
      p_description: event.description,
      p_start_time: event.start_time,
      p_end_time: event.end_time,
      p_funding_deadline: event.funding_deadline,
      p_timezone: event.timezone,
      p_location: event.location,
      p_visibility: event.visibility,
      p_target_amount: event.target_amount,
      p_reward_type: event.reward_type,
      p_capacity: event.capacity,
      p_ticket_price: event.ticket_price,
      p_milestones: event.milestones,
      p_services: event.services,
      p_gallery_images: event.gallery_images,
    });

    if (error) {
      this.logger.error('Error calling create_event_with_details RPC', error);
      throw new Error(error.message);
    }
    return { id: data };
  }

  // Campaign operations
  async createCampaign(campaign: any): Promise<any> {
    const { data, error } = await this.client
      .from('campaigns')
      .insert([campaign])
      .select();
    if (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
    return data[0];
  }

  async getCampaigns(limit: number, offset: number): Promise<any[]> {
    const { data, error } = await this.client
      .from('campaigns')
      .select('*')
      .range(offset, offset + limit - 1);
    if (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
    return data;
  }

  async getCampaignByBlobId(blobId: string): Promise<any | null> {
    // Note: 'blobId' is a concept from Walrus. We'll use the primary key 'id' in Postgres.
    const { data, error } = await this.client
      .from('campaigns')
      .select('*')
      .eq('id', blobId)
      .single();
    if (error) {
      this.logger.error(error);
      // 'single()' throws an error if no row is found, so we can return null here.
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    return data;
  }

  async getCampaignByObjectId(objectId: string): Promise<any | null> {
    const { data, error } = await this.client
      .from('campaigns')
      .select('*')
      .eq('on_chain_object_id', objectId)
      .single();
    if (error) {
      this.logger.error(error);
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    return data;
  }

  async getCampaignByDbId(id: string): Promise<any | null> {
    const { data, error } = await this.client
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      this.logger.error(error);
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    return data;
  }

  async getCampaignsByCreator(creatorAddress: string): Promise<any[]> {
    // This assumes `creatorAddress` is the `wallet_address` on the `users` table.
    // We need to join with the `users` table.
    const { data: user, error: userError } = await this.client
      .from('users')
      .select('id')
      .eq('wallet_address', creatorAddress)
      .single();
    if (userError) {
      this.logger.error(userError);
      if (userError.code === 'PGRST116') return [];
      throw new Error(userError.message);
    }

    const { data, error } = await this.client
      .from('campaigns')
      .select('*')
      .eq('creator_id', user.id);
    if (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
    return data;
  }

  async updateCampaignCurrentAmount(id: string, amount: number): Promise<any> {
    const { data, error } = await this.client
      .from('campaigns')
      .update({ amount_raised: amount })
      .eq('id', id)
      .select();
    if (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
    return data[0];
  }

  // Image operations
  async createImage(image: any): Promise<any> {
    const { data, error } = await this.client
      .from('campaign_gallery_images')
      .insert([image])
      .select();
    if (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
    return data[0];
  }

  async getImagesByCampaignId(campaignId: string): Promise<any[]> {
    const { data, error } = await this.client
      .from('campaign_gallery_images')
      .select('*')
      .eq('campaign_id', campaignId);
    if (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
    return data;
  }

  async getStorySectionsByCampaignId(campaignId: string): Promise<any[]> {
    const { data, error } = await this.client
      .from('campaign_story_sections')
      .select('*')
      .eq('campaign_id', campaignId);
    if (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
    return data;
  }

  async getRoadmapPhasesByCampaignId(campaignId: string): Promise<any[]> {
    const { data, error } = await this.client
      .from('campaign_roadmap_phases')
      .select('*')
      .eq('campaign_id', campaignId);
    if (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
    return data;
  }

  async getTeamMembersByCampaignId(campaignId: string): Promise<any[]> {
    const { data, error } = await this.client
      .from('campaign_team_members')
      .select('*')
      .eq('campaign_id', campaignId);
    if (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
    return data;
  }

  // Milestone operations
  async createMilestone(milestone: any): Promise<any> {
    const { data, error } = await this.client
      .from('milestones')
      .insert([milestone])
      .select();
    if (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
    return data[0];
  }

  async getMilestonesByObjectId(objectId: string): Promise<any[]> {
    // Assuming 'objectId' refers to 'on_chain_object_id' on the 'campaigns' table.
    const { data: campaign, error: campaignError } = await this.client
      .from('campaigns')
      .select('id')
      .eq('on_chain_object_id', objectId)
      .single();
    if (campaignError) {
      this.logger.error(campaignError);
      if (campaignError.code === 'PGRST116') return [];
      throw new Error(campaignError.message);
    }

    const { data, error } = await this.client
      .from('milestones')
      .select('*')
      .eq('campaign_id', campaign.id);
    if (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
    return data;
  }

  async getMilestone(
    campaignId: string,
    milestoneId: string,
  ): Promise<any | null> {
    const { data, error } = await this.client
      .from('milestones')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('id', milestoneId)
      .single();
    if (error) {
      this.logger.error(error);
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    return data;
  }

  async updateMilestoneVoteResult(
    campaignId: string,
    milestoneId: string,
    voteResult: number,
  ): Promise<void> {
    const { error } = await this.client
      .from('milestones')
      .update({ vote_result: voteResult })
      .eq('campaign_id', campaignId)
      .eq('id', milestoneId);
    if (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
  }

  async updateMilestoneIsClaimed(
    campaignId: string,
    milestoneId: string,
    isClaimed: boolean,
  ): Promise<void> {
    const { error } = await this.client
      .from('milestones')
      .update({ is_claimed: isClaimed })
      .eq('campaign_id', campaignId)
      .eq('id', milestoneId);
    if (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
  }

  async getMilestonesByCampaignIdAndStatus(
    campaignId: string,
    status: string,
  ): Promise<any[]> {
    const { data, error } = await this.client
      .from('milestones')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('status', status);
    if (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
    return data;
  }

  // Contribution operations
  async createContribution(contribution: any): Promise<any> {
    const { data, error } = await this.client
      .from('contributions')
      .insert([contribution])
      .select();
    if (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
    return data[0];
  }

  async getContributionsByAddress(address: string): Promise<any[]> {
    // Assuming 'address' is the 'wallet_address' on the 'users' table.
    const { data: user, error: userError } = await this.client
      .from('users')
      .select('id')
      .eq('wallet_address', address)
      .single();
    if (userError) {
      this.logger.error(userError);
      if (userError.code === 'PGRST116') return [];
      throw new Error(userError.message);
    }

    const { data, error } = await this.client
      .from('contributions')
      .select('*')
      .eq('user_id', user.id);
    if (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
    return data;
  }

  async getContributionsByCampaignId(campaignId: string): Promise<any[]> {
    const { data, error } = await this.client
      .from('contributions')
      .select('*')
      .eq('campaign_id', campaignId);
    if (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
    return data;
  }

  // Event operations
  async getEvents(limit: number, offset: number): Promise<any[]> {
    const { data, error } = await this.client
      .from('events')
      .select('*')
      .range(offset, offset + limit - 1);
    if (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
    return data;
  }

  async getEventById(eventId: string): Promise<any | null> {
    const { data, error } = await this.client
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
    if (error) {
      this.logger.error(error);
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }
    return data;
  }

  async getEventMilestonesByEventId(eventId: string): Promise<any[]> {
    const { data, error } = await this.client
      .from('milestones')
      .select('*')
      .eq('event_id', eventId);
    if (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
    return data;
  }

  async getEventServicesByEventId(eventId: string): Promise<any[]> {
    const { data, error } = await this.client
      .from('event_services')
      .select('*')
      .eq('event_id', eventId);
    if (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
    return data;
  }

  async getEventGalleryImagesByEventId(eventId: string): Promise<any[]> {
    const { data, error } = await this.client
      .from('event_gallery_images')
      .select('*')
      .eq('event_id', eventId);
    if (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
    return data;
  }

  async updateEvent(eventId: string, updates: any): Promise<any> {
    const { data, error } = await this.client
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select()
      .single();
    if (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
    return data;
  }

  // Tier operations
  async createTier(tier: any): Promise<any> {
    // The schema in DB.md does not have a 'tiers' table.
    // This method needs to be adapted or the schema updated.
    this.logger.warn(
      "createTier is not implemented for SupabaseService as 'tiers' table is missing in the schema.",
    );
    return Promise.resolve(tier);
  }

  // User operations
  async createUser(user: any): Promise<any> {
    const { data, error } = await this.client
      .from('users')
      .insert([user])
      .select();
    if (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
    return data[0];
  }

  async getUserByWalletAddress(walletAddress: string): Promise<any | null> {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();
    if (error) {
      this.logger.error(error);
      if (error.code === 'PGRST116') return null; // No rows found
      throw new Error(error.message);
    }
    return data;
  }

  async getUserByEmail(email: string): Promise<any | null> {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    if (error) {
      this.logger.error(error);
      if (error.code === 'PGRST116') return null; // No rows found
      throw new Error(error.message);
    }
    return data;
  }

  async updateUser(walletAddress: string, updates: any): Promise<any> {
    const { data, error } = await this.client
      .from('users')
      .update(updates)
      .eq('wallet_address', walletAddress)
      .select()
      .single();
    if (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
    return data;
  }
}
