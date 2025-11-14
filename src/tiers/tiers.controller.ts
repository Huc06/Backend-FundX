import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { TiersService } from './tiers.service';
import { CreateTierDto } from './dto/create-tier.dto';

@ApiTags('Tiers')
@Controller()
export class TiersController {
  constructor(private readonly tiersService: TiersService) {}

  @Post('add-tier')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add a contribution tier to a campaign' })
  @ApiBody({ type: CreateTierDto })
  @ApiResponse({
    status: 200,
    description: 'Tier created successfully',
    schema: {
      example: {
        is_success: true,
        data: {
          campaign_id: 'campaign-123',
          tier: 'gold',
          limit: 100,
          current: 0,
          is_active: false,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
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
