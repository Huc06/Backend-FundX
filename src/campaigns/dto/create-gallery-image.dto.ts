
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateGalleryImageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  image_url: string;

  @ApiProperty()
  @IsBoolean()
  is_cover: boolean;
}
