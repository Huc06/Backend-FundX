import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';

@Controller()
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload-image')
  @HttpCode(HttpStatus.OK)
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

