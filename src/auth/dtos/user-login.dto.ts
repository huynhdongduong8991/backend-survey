import { UserDto } from '@src/user/dtos/user.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserGoogleLoginDto extends UserDto {}

export class UserLoginDto extends UserDto {
    @IsNotEmpty()
    @IsString()
    password: string;
}
