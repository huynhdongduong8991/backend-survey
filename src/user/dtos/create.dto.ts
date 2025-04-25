import { IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { UserDto } from './user.dto';

export class CreateGoogleUserDto extends UserDto {}

export class CreateUserDto extends UserDto {
    @IsNotEmpty()
    @IsString()
    password: string;
}
