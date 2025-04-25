import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserResetPwDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
