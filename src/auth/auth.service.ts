import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import constants from '@src/config/constants';
import { ApplicationErrorException } from '@src/exceptions';
import { Request, Response } from 'express';
import { UserGoogleLoginDto, UserLoginDto } from './dtos/user-login.dto';
import { CreateGoogleUserDto, CreateUserDto } from '@src/user/dtos/create.dto';
import { UserService } from '@src/user/user.service';
import { Users } from '@src/entities';
import * as bcrypt from 'bcrypt';
import { UserResetPwDto } from './dtos/user-rs-password.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private config: ConfigService,
        private userService: UserService,
    ) {}

    async googleLogin(userDto: UserGoogleLoginDto): Promise<{ accessToken: string }> {
        const { googleId, email, username } = userDto;

        return await this.signToken(googleId, username, email);
    }

    async register(userDto: CreateUserDto): Promise<Users> {
        const user = await this.userService.createUser(userDto);
        delete user.password;
        return user;
    }

    async login(userDto: UserLoginDto): Promise<{ accessToken: string }> {
        const user = await this.userService.findByEmail(userDto.email);
        if (!user) {
            throw new ApplicationErrorException('E-00004', undefined, HttpStatus.UNAUTHORIZED);
        }
        const isPasswordValid = await bcrypt.compare(userDto.password, user.password);
        if (!isPasswordValid) {
            throw new ApplicationErrorException('E-00005', undefined, HttpStatus.BAD_REQUEST);
        }

        return await this.signToken(user.googleId, user.username, user.email);
    }

    async resetPassword(userDto: UserResetPwDto): Promise<void> {
        const user = await this.userService.findByEmail(userDto.email);
        if (!user) {
            throw new ApplicationErrorException('E-00004', undefined, HttpStatus.UNAUTHORIZED);
        }

        const newPassword = await bcrypt.hash(userDto.password, constants.SALT_ROUNDS);
        await this.userService.update(user.id, { password: newPassword });
    }


    async signToken(googleId: string, username: string, email: string): Promise<{ accessToken: string }> {
        const payload: Record<string, string> = {
            sub: googleId,
            username,
            email,
        };
        const secret = this.config.get('jwt.secret');
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: this.config.get('jwt.expirationTime'),
            secret: secret,
        });

        return { accessToken };
    }

    async logout(request: Request, response: Response): Promise<void> {
        request.logout((err) => {
            if (err) {
                throw new ApplicationErrorException(undefined, err.response.message, HttpStatus.BAD_REQUEST);
            }

            request.session.destroy(() => {
                const clientURL = this.config.get('frontendEndpoint') + constants.LOGIN_ROUTE;
                response.redirect(clientURL);
            });
        });
    }
}
