import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUserGoogleOAuthReq } from '@src/interface/user-request.interface';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guard/google.guard';
import { JwtGuard } from './guard/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private config: ConfigService,
    ) {}

    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    async googleLogin(@Req() req: Request) {}

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleRedirect(@Req() req: Request, @Res() res: Response) {
        const userReq = req['user'] as IUserGoogleOAuthReq;
        const { accessToken } = await this.authService.googleLogin({
            googleId: userReq.googleId,
            email: userReq.email,
            username: userReq.name,
        });
        const clientURL = this.config.get('frontendEndpoint') + `?token=${accessToken}`;
        res.redirect(clientURL);
    }

    @Post('logout')
    @UseGuards(JwtGuard)
    async logout(@Req() req: Request, @Res() res: Response) {
        await this.authService.logout(req, res);
    }
}

