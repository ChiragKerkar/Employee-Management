import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsString()
    @IsOptional()
    role?: string;
}