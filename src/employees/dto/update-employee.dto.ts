import { IsOptional, IsString, IsInt, Min, IsNotEmpty } from 'class-validator';

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  position?: string;

  @IsInt()
  @Min(0)
  salary?: number;
}