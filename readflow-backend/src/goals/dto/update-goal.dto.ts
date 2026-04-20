import { IsInt, Min, Max, IsOptional } from 'class-validator';

export class UpdateGoalDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  dailyPages?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  monthlyBooks?: number;
}
