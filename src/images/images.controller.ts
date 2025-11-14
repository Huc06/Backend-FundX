import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';

@ApiTags('Images')
@Controller()
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload-image')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Upload an image for a campaign' })
  @ApiBody({ type: CreateImageDto })
  @ApiResponse({
    status: 200,
    description: 'Image uploaded successfully',
    schema: {
      example: {
        is_success: true,
        data: {
          campaign_id: 'campaign-123',
          img_id: 'img-456',
          type: 'banner',
          created_at: '2025-11-09T...',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async uploadImage(@Body() createImageDto: CreateImageDto) {
    try {
      return await this.imagesService.createImage(createImageDto);
    } catch (error) {
      return {
        is_success: false,
        error: error.message,
      };
    }
  }
}
