import { IsEmail, IsNotEmpty, IsOptional, IsString, IsNumber, IsInt, Min } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsInt()
  @Min(0)
  salary: number;
}