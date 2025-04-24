import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import constants from '@src/config/constants';
import { ApplicationErrorException } from '@src/exceptions';
import { Request, Response } from 'express';
import { UserLoginDto } from './dtos/user-login.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private config: ConfigService,
    ) {}

    async googleLogin(userDto: UserLoginDto): Promise<{ accessToken: string }> {
        const { googleId, email, username } = userDto;

        return await this.signToken(googleId, username, email);
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
