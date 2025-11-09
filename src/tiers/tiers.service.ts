import { Injectable } from '@nestjs/common';
import { CreateTierDto } from './dto/create-tier.dto';

@Injectable()
export class TiersService {
  /**
   * Create a new tier for a campaign
   * TODO: Implement database logic with Walrus
   */
  async createTier(createTierDto: CreateTierDto) {
    const tier = {
      campaign_id: createTierDto.campaign_id,
      tier: createTierDto.tier,
      current: 0,
      limit: createTierDto.limit,
      is_active: false,
      description: createTierDto.description,
    };

    // TODO: Save to Walrus database
    // const savedTier = await this.databaseService.createTier(tier);

    return {
      is_success: true,
      data: tier,
    };
  }
}

