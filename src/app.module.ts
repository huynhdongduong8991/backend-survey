import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SurveyModule } from './survey/survey.module';
import { SubmissionModule } from './submission/submission.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            load: [configuration],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => configService.get('defaultConnection'),
            inject: [ConfigService],
        }),
        AuthModule,
        UserModule,
        SurveyModule,
        SubmissionModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
