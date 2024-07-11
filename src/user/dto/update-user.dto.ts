import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsNumber()
    @IsOptional()
    roleId?: number;
}
