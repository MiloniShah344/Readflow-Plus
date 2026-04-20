import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateNoteDto {
  @IsUUID()
  bookId: string;

  @IsString()
  @IsNotEmpty({ message: 'Note content cannot be empty' })
  content: string;

  @IsOptional()
  @IsBoolean()
  isHighlight?: boolean;
}
