import { IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateVoteResultDto {
  @IsNumber()
  @IsNotEmpty()
  voteResult: number;
}

