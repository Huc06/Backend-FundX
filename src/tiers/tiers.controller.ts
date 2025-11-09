import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { TiersService } from './tiers.service';
import { CreateTierDto } from './dto/create-tier.dto';

@Controller()
export class TiersController {
  constructor(private readonly tiersService: TiersService) {}

  @Post('add-tier')
  @HttpCode(HttpStatus.OK)
  async addTier(@Body() createTierDto: CreateTierDto) {
    try {
      return await this.tiersService.createTier(createTierDto);
    } catch (error) {
      return {
        is_success: false,
        error: error.message,
      };
    }
  }
}

