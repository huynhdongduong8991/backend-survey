import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@src/user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        configService: ConfigService,
        private userServicve: UserService,
    ) {
        super({
            clientID: configService.get('google.clientId'),
            clientSecret: configService.get('google.clientSecrect'),
            callbackURL: configService.get('google.callbackURL'),
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
    ): Promise<void> {
        const { sub: id, email, name } = profile._json;
        const user = {
            googleId: id,
            email: email,
            username: name,
        };
        await this.userServicve.createGoogleUser(user);
        done(null, user);
    }
}
