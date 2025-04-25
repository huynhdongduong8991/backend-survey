import { Module } from '@nestjs/common';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyEntity } from '@src/entities';
import { UserModule } from '@src/user/user.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([SurveyEntity]),
        UserModule,
    ],
    controllers: [SurveyController],
    providers: [SurveyService],
})
export class SurveyModule {}
