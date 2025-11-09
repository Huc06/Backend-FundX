import { IsString, IsNotEmpty } from 'class-validator';

export class CreateImageDto {
  @IsString()
  @IsNotEmpty()
  campaignId: string;

  @IsString()
  @IsNotEmpty()
  imgId: string;

  @IsString()
  @IsNotEmpty()
  type: string;
}

