import { IsOptional, IsString, MaxLength, IsIn } from 'class-validator';

export class UpdateMeDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsIn(['light', 'dark'])
  theme?: string;
}
