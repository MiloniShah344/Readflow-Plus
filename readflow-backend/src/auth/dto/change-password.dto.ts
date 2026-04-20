import { IsString, MinLength, MaxLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters' })
  @MaxLength(50)
  newPassword: string;
}
