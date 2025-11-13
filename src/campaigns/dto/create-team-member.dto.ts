
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class CreateTeamMemberDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({
    description: 'JSON object for contact information (e.g., email, twitter)',
    type: 'object',
    example: { email: 'johndoe@example.com', twitter: '@johndoe' },
    additionalProperties: true,
  })
  @IsObject()
  contact_info: Record<string, any>;
}
