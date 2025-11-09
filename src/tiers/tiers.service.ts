import { Injectable, Inject } from '@nestjs/common';
import { CreateTierDto } from './dto/create-tier.dto';
import type { IDatabaseService } from '../database/interfaces/database.interface';

@Injectable()
export class TiersService {
  constructor(
    @Inject('DATABASE_SERVICE')
    private readonly databaseService: IDatabaseService,
  ) {}

  /**
   * Create a new tier for a campaign
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

    const savedTier = await this.databaseService.createTier(tier);

    return {
      is_success: true,
      data: savedTier,
    };
  }
}
