import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsUrl, IsEnum } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export class CreateProfileDto {
  @ApiProperty({
    description: "The user's public blockchain wallet address",
    example: '0x1234567890abcdef1234567890abcdef12345678',
  })
  @IsString()
  walletAddress: string;

  @ApiProperty({
    description: 'A user-chosen display name',
    example: 'john_doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: "The user's email address",
    example: 'john.doe@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'The role of the user',
    enum: UserRole,
    example: UserRole.USER,
    default: UserRole.USER,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.USER;

  @ApiProperty({
    description: 'A short user biography',
    example: 'Passionate about blockchain and decentralized applications.',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: "URL to the user's profile picture",
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  avatarUrl?: string;
}
