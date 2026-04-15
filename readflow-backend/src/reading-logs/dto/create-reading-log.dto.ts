import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { Mood } from '../entities/reading-log.entity';

export class CreateReadingLogDto {
  @IsString()
  @IsNotEmpty({ message: 'Book ID is required' })
  bookId: string;

  @IsInt()
  @Min(1, { message: 'Pages read must be at least 1' })
  pagesRead: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  minutesSpent?: number;

  @IsOptional()
  @IsEnum(Mood)
  mood?: Mood;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  focusLevel?: number;

  @IsOptional()
  @IsDateString()
  date?: string;
}