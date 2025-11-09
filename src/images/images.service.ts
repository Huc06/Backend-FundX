import { Injectable, Inject } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import type { IDatabaseService } from '../database/interfaces/database.interface';

@Injectable()
export class ImagesService {
  constructor(
    @Inject('DATABASE_SERVICE')
    private readonly databaseService: IDatabaseService,
  ) {}

  /**
   * Create/upload an image for a campaign
   */
  async createImage(createImageDto: CreateImageDto) {
    const image = {
      campaign_id: createImageDto.campaignId,
      img_id: createImageDto.imgId,
      type: createImageDto.type,
      created_at: new Date().toISOString(),
    };

    const savedImage = await this.databaseService.createImage(image);

    return {
      is_success: true,
      data: savedImage,
    };
  }
}
