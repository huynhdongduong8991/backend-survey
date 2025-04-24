import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { GoogleStrategy } from "./strategy/google.strategy";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "@src/user/user.module";

@Module({
    imports: [
        JwtModule.register({}),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        ConfigModule,
        UserModule,
    ],
    providers: [AuthService, GoogleStrategy, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
