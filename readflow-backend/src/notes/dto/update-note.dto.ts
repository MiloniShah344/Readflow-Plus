import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateNoteDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  isHighlight?: boolean;
}
